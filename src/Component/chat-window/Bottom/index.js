import React, { useCallback, useState } from "react";
import { Alert, Icon, Input, InputGroup } from "rsuite";
import { useProfile } from '../../../Context/Profile.Context';
import { serverTimestamp,push,ref,update } from "firebase/database";
import { useParams } from 'react-router-dom';
import { database } from "../../../misc/firebase";
import AttachmmenttBtnModel from "./AttachmentBtnModel";
import AudioMsgBtn from '../message/ImgBtnModal';

function assembleMessage(profile,chatId){
    return {
        roomId: chatId,
        author: {
            name :profile.name,
            uid : profile.uid,
            createdAt : profile.createdAt,
            ...(profile.avatar ? { avatar : profile.avatar} : {}),

        },
        createdAt: serverTimestamp(),
        likeCount:0,
    };
}

const ChatBottom = () => {
  
  const [input,setInput] = useState('');
  const [isLoading,setIsLoading] = useState(false);

  const {chatId} = useParams();
  const {profile} = useProfile();

  const onInputChange = useCallback((value)=>{
    setInput(value);

  },[]);

  
  const onSendClick = async ()=>{

if(input.trim() === ''){
    return;
}
const msgData = assembleMessage(profile,chatId);
msgData.txt = input;

const updates = {};
const messageId = push(ref(database,'messages')).key;

updates[`/messages/${messageId}`] = msgData;
updates[`/rooms/${chatId}/lastMessage`] = {
    ...msgData,
    msgId : messageId,
};

setIsLoading(true);
try{

await update(ref(database),updates);
setInput('');
setIsLoading(false);

}catch(err) {

    setIsLoading(false);
     Alert.error(err.message);
    
}

  }
  const onKeyDown = (ev) =>{
    if(ev.keyCode === 13){
        ev.preventDefault();
        onSendClick();
    }

  };

  const afterUpload = useCallback(async (files)=>{
    setIsLoading(true);
    const updates = {};
    files.forEach(file => {
      const msgData = assembleMessage(profile,chatId);
      msgData.file = file;
      const messageId = push(ref(database,'messages')).key;
      updates[`/messages/${messageId}`] = msgData;

      
    });
    const lastMsdId = Object.keys(updates).pop();
    updates[`/rooms/${chatId}/lastMessage`] = {
      ...updates[lastMsdId],
      msgId : lastMsdId,
    };

    try {
      await update(ref(database),updates);
      setIsLoading(false);

    } catch (err) {

      setIsLoading(false);
      Alert.error(err.message);
          
    }



  },[chatId,profile])

  
  return  <div> 
  <InputGroup>
  <AttachmmenttBtnModel afterUpload={afterUpload}/>
  <AudioMsgBtn afterUpload={afterUpload}/>
  <Input 
  placeholder="Write a new message here..."  
  value={input}
   onChange={onInputChange} 
   onKeyDown={onKeyDown}
   ></Input>
  <InputGroup.Button 
  color="blue" 
  appearance="primary" 
  onClick={onSendClick}
  disabled={isLoading}
  >
    <Icon icon="send"></Icon>
  </InputGroup.Button>
  </InputGroup>
  
  
   </div>
    
} ;

export default ChatBottom;