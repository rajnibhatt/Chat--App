import React from "react";
import { Loader } from "rsuite";
import ChatTop from "../../Component/chat-window/top";
import Message from "../../Component/chat-window/message";
import ChatBottom from "../../Component/chat-window/Bottom";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { useRooms } from "../../Context/Rooms.Context";
import { CurrentRoomProvider } from "../../Context/Current-room.context";
import { transformToArr } from "../../misc/helper";
import { auth } from "../../misc/firebase";

const Chat = () => {

const {chatId} = useParams();
const rooms = useRooms();

if(!rooms){
    return <Loader center vertical size="md" content="Loading" speed="slow"></Loader>
}
const currentRoom = rooms.find(room=> room.id === chatId);

if(!currentRoom){
    return <h6 className="text-center mt-page">chat {chatId} NOT FOUD</h6>
}
const {name,description} = currentRoom;
const admins = transformToArr(currentRoom.admins);
const isAdmin = admins.includes(auth.currentUser.uid);
const currentRoomData = {
    name,
    description,
    admins,
    isAdmin,

}
    return(
        <CurrentRoomProvider data={currentRoomData}>
            <div className="chat-top">
                <ChatTop></ChatTop>
            </div>

            <div className="chat-middle">
               <Message></Message> 
            </div>

            <div className="chat-bottom">
                <ChatBottom></ChatBottom>
            </div>
          
        </CurrentRoomProvider>
    )
}

export default Chat;