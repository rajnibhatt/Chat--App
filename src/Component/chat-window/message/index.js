import { off, onValue, orderByChild, ref as dbRef ,query, equalTo } from "firebase/database";
import React, { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import { database } from "../../../misc/firebase";
import { transformToArrWithId } from "../../../misc/helper";
import MessageItems from '../message/MessageItems';



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

    return (
        <ul className="msg-list custom-scroll">
            {isChatEmpty && <li>No Messages Yet</li>}
            {canShowMessages && messages.map((msg)=><MessageItems key={msg.id} message={msg}/>)}
            
        </ul>
    );
};

export default Messages;