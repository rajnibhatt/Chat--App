import React from "react";
import TimeAgo from "timeago-react";

const RoomIttem = ({room})=>{

    return(
        <div>
            
            <div className="d-flex justify-content-between align-items-center">
                <h3 className="text-disappear">{room.name}</h3>
                <TimeAgo
                datetime={new Date()} className="font-normal text-black-45"
                ></TimeAgo>

            </div>
            <div className="d-flex align-itemss-center text-black-70">
            <span>No message yet....</span>
            </div>
        </div>
    )
}

export default RoomIttem;