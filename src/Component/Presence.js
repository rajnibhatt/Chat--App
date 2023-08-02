import React from "react";
import { usePresence } from "../misc/customhooks";
import { Whisper, Tooltip, Badge } from 'rsuite';

const getColor = presence => {
  if (!presence) {
    return 'gray';
  }

  switch (presence.state) {
    case 'online':
      return 'green';
    case 'offline':
      return 'red';
    default:
      return 'gray';
  }
};

const getText= (presence)=>{
    if(!presence){
        return 'unknown state';
    }
    return presence.state === 'online' ? 'online':`last online ${new Date(presence.last_change).toLocaleDateString()}`;
}

const PresenceDot = ({uid}) => {

    const presence = usePresence(uid);


    return (

     <Whisper
      placement="top"
      trigger="hover"
      speaker={<Tooltip>{getText(presence)}</Tooltip>}
    >
      <Badge
        className="cursor-pointer"
        style={{ backgroundColor: getColor(presence) }}
      />
    </Whisper>
    )
}

export default PresenceDot;