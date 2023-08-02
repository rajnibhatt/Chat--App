import React,{memo} from "react";
import ProfileAvatar from "../../../Dashboard/ProfileAvatar";
import TimeAgo from "timeago-react";
import ProfileInfoBtnModel from "./ProfileInfoBtnModel";

const MessageItems = ({message}) => {
    const {author,createdAt,txt} = message;

    return( 

 <li className="padded mb-1">
    <div className="d-flex align-item-center font-bolder mb-1">
        <ProfileAvatar 
        src={author.avatar} 
        name={author.name} 
        className="ml-1" 
        size="xs">
        </ProfileAvatar>

        <ProfileInfoBtnModel profile={author} appearance="link" className="p=0 ml-1 text-block"></ProfileInfoBtnModel>
        <TimeAgo
         datetime={createdAt}
         className="font-normal text-black-45 ml-2"
         />
   
    </div>
    <div>
         <span className="word-breal-all">{txt}</span>
    </div>
</li>
);
    }
export default memo(MessageItems);