import { off, onValue, orderByChild, ref as dbRef ,query, equalTo } from "firebase/database";
import React, { useState,useEffect,useCallback } from "react";
import { useParams } from "react-router-dom";
import { database } from "../../../misc/firebase";
import { transformToArrWithId } from "../../../misc/helper";
import MessageItems from '../message/MessageItems';
import { Alert } from "rsuite";



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
        const adminRef = database.ref(`/rooms/${chatId}/admins`);
        let alertMsg;
        await adminRef.transaction(admins =>{
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
    },[chatId])


    return (
        <ul className="msg-list custom-scroll">
            {isChatEmpty && <li>No Messages Yet</li>}
            {canShowMessages && messages.map((msg)=>
            <MessageItems key={msg.id} 
            message={msg}
             handleAdmin={handleAdmin}/>
             )}
            
        </ul>
    );
};

export default Messages;