
import React,{memo} from "react";
import ProfileAvatar from "../../../Dashboard/ProfileAvatar";
import TimeAgo from "timeago-react";
import ProfileInfoBtnModel from "./ProfileInfoBtnModel";
import PresenceDot from "../../Presence";
import { Button } from "rsuite";
import { useCurrentRoom } from "../../../Context/Current-room.context";
import { auth } from "../../../misc/firebase";
import { useHover,useMediaQuery } from "../../../misc/customhooks";
import IconBtnControl from '../message/IconBtnControl';
import ImgBtnModal from '../message/ImgBtnModal';


const renderFileMessage = (file)=>{
    if(file.contentType.includes('image')){
        return(
        <div className="height-220">
            <ImgBtnModal src={file.url} fileName = {file.name}/>
        </div>
        );
    } else {

        return <a href={file.urrl}>Download {file.name}</a>
    }


}

const MessageItems = ({message,handleAdmin,handleLike,handleDelete}) => {
    const {author,createdAt,txt,file,likes,likeCount} = message;
    const [selfRef,isHovered] = useHover();
    const isMobile = useMediaQuery('(max-width: 992px)');
    const isAdmin = useCurrentRoom(v => v.isAdmin);
    const admins = useCurrentRoom(v => v.admins);
    const isMsgAuthorAdmin = admins.includes(author.uid);
    const isAuthor = auth.currentUser.uid === author.uid;
    const canGrantAdmin = isAdmin && !isAuthor;
    const canShowIcons = isMobile || isHovered;
    const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);


    return( 

 <li className={`padded mb-1 cursor-pointer ${isHovered ? 'bg-black-02':''}`} 
 ref={selfRef}>
    <div className="d-flex align-items-center font-bolder mb-1">
        <PresenceDot uid={author.uid}/>
        <ProfileAvatar 
        src={author.avatar} 
        name={author.name} 
        className="ml-1" 
        size="xs"
        />
        
        <ProfileInfoBtnModel 
        profile={author} 
        appearance="link"
        className="p-0 ml-1 text-black">
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
         <IconBtnControl
         {...( isLiked ? {color: 'red'} :{})}
            isVisible={canShowIcons}
            iconName="heart"
            tooltip="like this messsage"
            onClick={()=>handleLike(message.id)}
            badgeContent={likeCount}

         />
         {isAuthor && (
          <IconBtnControl
            isVisible={canShowIcons}
            iconName="close"
            tooltip="Delete this message"
            onClick={() => handleDelete(message.id)}
          />
        )}
   
    </div>
    <div>
        {txt && <span className="word-breal-all">{txt}</span>}
        {file && renderFileMessage(file)}
    </div>
</li>
);
    };

    export default memo(MessageItems);
 