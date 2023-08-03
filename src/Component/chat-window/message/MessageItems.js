import React,{memo} from "react";
import ProfileAvatar from "../../../Dashboard/ProfileAvatar";
import TimeAgo from "timeago-react";
import ProfileInfoBtnModel from "./ProfileInfoBtnModel";
import PresenceDot from "../../Presence";
import { Button } from "rsuite";
import { useCurrentRoom } from "../../../Context/Current-room.context";
import { auth } from "../../../misc/firebase";

const MessageItems = ({message,handleAdmin}) => {
    const {author,createdAt,txt} = message;
    const isAdmin = useCurrentRoom(v => v.isAdmin);
    const admins = useCurrentRoom(v => v.admins);
    const isMsgAuthorAdmin = admins.includes(author.uid);
    const isAuthor = auth.currentUser.uid === author.uid;
    const canGrantAdmin = isAdmin && !isAuthor;


    return( 

 <li className="padded mb-1">
    <div className="d-flex align-item-center font-bolder mb-1">
        <PresenceDot uid={author.uid}></PresenceDot>
        <ProfileAvatar 
        src={author.avatar} 
        name={author.name} 
        className="ml-1" 
        size="xs">
        </ProfileAvatar>

        <ProfileInfoBtnModel 
        profile={author} 
        appearance="link"
        className="p=0 ml-1 text-block">
            {canGrantAdmin && (
            <Button block  onClick={()=>handleAdmin(author.uid)}color="blue">
                {isMsgAuthorAdmin
                 ? 'remove admi permission'
                 :'give admin in this room'}
                 </Button>
        )}
        </ProfileInfoBtnModel>
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