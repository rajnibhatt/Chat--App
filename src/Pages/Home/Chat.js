import React from "react";
import { Loader } from "rsuite";
import ChatTop from "../../Component/chat-window/top";
import Message from "../../Component/chat-window/message";
import ChatBottom from "../../Component/chat-window/Bottom";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { useRooms } from "../../Context/Rooms.Context";

const Chat = () => {

const {chatId} = useParams();
const rooms = useRooms();

if(!rooms){
    return <Loader center vertical size="md" content="Loading" speed="sllow"></Loader>
}
const currentRoom = rooms.find(room=> room.id === chatId);

if(!currentRoom){
    return <h6 className="text-center mt-page">chat {chatId} NOT FOUD</h6>
}

    return(
        <>
            <div className="chat-top">
                <ChatTop></ChatTop>
            </div>

            <div className="chat-middle">
               <Message></Message> 
            </div>

            <div className="chat-bottom">
                <ChatBottom></ChatBottom>
            </div>
          
        </>
    )
}

export default Chat;