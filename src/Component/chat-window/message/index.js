import { off, onValue, orderByChild, ref as dbRef ,query, equalTo, runTransaction } from "firebase/database";
import React, { useState,useEffect,useCallback } from "react";
import { useParams } from "react-router-dom";
import { auth, database,storage} from "../../../misc/firebase";
import { Alert, Form } from "rsuite";
import MessageItem from '../message/MessageItems';
import { deleteObject, ref as storageRef } from 'firebase/storage';
import {transformToArrWithId, groupBy } from "../../../misc/helper";



const Messages = () => {

    const {chatId} =  useParams();
    const [messages,setMessages] = useState(null);

    const isChatEmpty = messages && messages.length === 0;
    const canShowMessages = messages && messages.length > 0;


    useEffect (()=>{
        const messageRef = dbRef(database,'/messages');

        console.log("Chat id: ", chatId);
      
        onValue(
            query(messageRef,orderByChild('roomId'),equalTo(chatId)),
            (snap) => {
                const data = transformToArrWithId(snap.val());
                console.log("data:", data);
                setMessages(data);
            }
        );
     
       return()=>{
         off(messageRef);
        
       
       };

    },[chatId]);




    const handleAdmin = useCallback(async(uid)=>{
        const adminRef = dbRef(database, `/rooms/${chatId}/admins`);
        let alertMsg;
        await runTransaction(adminRef, admins =>{
                if (admins) {
            if (admins[uid]) {
              admins[uid] = null;
              alertMsg = 'Admin permission removed';
            } else {
              admins[uid] = true;
              alertMsg = 'Admin permission granted';
            }
          }
          return admins;
        });

    Alert.info(alertMsg, 4000);
    },[chatId]);

 const handleLike = useCallback(async(msgId)=>{

        const {uid} = auth.currentUser;    
        const messageRef = dbRef(database, `/messages/${msgId}`);
        let alertMsg;
         await runTransaction(messageRef, msg =>{
            console.log("msg data: ",msg)
                if (msg) {
            if (msg.likes && msg.likes[uid]) {
              msg.likeCount -= 1;
              msg.likes[uid] = null;
              alertMsg = 'like removed';
            } else {
                msg.likeCount = typeof msg.likeCount === 'number' ? msg.likeCount+1 : 1;
                if(!msg.likes){
                    msg.likes = {};
                }
              msg.likes[uid] = true;
              alertMsg = 'Like added';
            }
          }
          return msg;
        });

    Alert.info(alertMsg, 4000);

 },[]);

 const handleDelete = useCallback(async(msgId,file)=> 
  {
        if(!window.confirm('delet this message ? ')){
            return;

        }
        const isLast = messages[messages.length - 1].id === msgId;
        const updates = {};
        updates[`/message/${msgId}`] = null;
        if(isLast && messages.length > 1){
            updates[`/rooms/${chatId}/lastMessage`] = {
                ...messages[messages.length - 2],
                msgId: messages[messages.length - 2].id
            }
        }
        if(isLast && messages.length === 1){
             updates[`/rooms/${chatId}/lastMessage`] = null;

        }
        try{
await database.ref().update(updates);
Alert.info('message has been deleted')
        }catch(err){
 return Alert.error(err.message);
        }
if(file){
try{
  const fileRef = storageRef(storage, file.url);
          await deleteObject(fileRef);

}catch(err){
 Alert.error(err.message);
}
}
 },[chatId,messages]
 );


 const renderMessages = () => {
    const groups = groupBy(messages, item =>
      new Date(item.createdAt).toDateString()
    );

    const items = [];

    Object.keys(groups).forEach(date => {
      items.push(
        <li key={date} className="text-center mb-1 padded">
          {date}
        </li>
      );

      const msgs = groups[date].map(msg => (
        <MessageItem
          key={msg.id}
          message={msg}
          handleAdmin={handleAdmin}
          handleLike={handleLike}
          handleDelete={handleDelete}
        />
      ));

      items.push(...msgs);
    });

    return items;
  };


    return (
        <ul className="msg-list custom-scroll">
            {isChatEmpty && <li>No Messages Yet</li>}
            {canShowMessages && renderMessages()}
             
            
        </ul>
    );
            
 };   

export default Messages;