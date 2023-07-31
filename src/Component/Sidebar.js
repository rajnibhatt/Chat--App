import React, { useEffect, useRef, useState } from "react";
import { Divider } from "rsuite";
import DashboardToggle from "../Dashboard/DashboardToggle";
import CreateRoomBtnModel from "../Dashboard/CreateRoomBtnModel";
import ChatRoomList from "./Rooms/ChatRoomList";



const Sidebar = () => {

    const topSidebarRef = useRef();
    const [height,setHeight] = useState(0);

    useEffect(()=>{
        if(topSidebarRef.current){
            setHeight(topSidebarRef.current.scrollHeight);
        }
    },[topSidebarRef]);
    return(
        <div className="h-100 pt-2">
            <div ref={topSidebarRef}>
                <DashboardToggle/>
                <CreateRoomBtnModel/>
                <Divider>Join Conversation</Divider>
            
            </div>
            <ChatRoomList aboveElHeight={height}></ChatRoomList>
        </div>
    )
}

export default Sidebar;