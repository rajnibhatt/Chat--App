
import React,{memo} from "react";
import { useCurrentRoom } from "../../../Context/Current-room.context";
import { ButtonToolbar, Icon } from "rsuite";
import { Link } from 'react-router-dom';
import { useMediaQuery } from '../../../misc/customhooks';
import RoomInfoBtnModel from './RoomInfoBtnModel';
import EditRoomBtnDrawer from "./EditRoomBtnDrawer";

const ChatTop = () => {
  const name = useCurrentRoom(v => v.name);
  const isAdmin = useCurrentRoom(v=>v.isAdmin);
  const isMobile = useMediaQuery('(max-width: 992px)');

  return <div>
    <div className="d-flex justify-content-between align-items-center">
      <h4 className="text-disapper d-flex align-items-center">
        <Icon componentClass={Link}  to= "/" 
        icon="arrow-circle-left" size="2x" 
        className={isMobile ? 'd-inline-block p-0 mr-2 text-blue link-unstyled ': 'd-none'}>
        </Icon>
        <span className="text-disappear">{name}</span>
      </h4>
    <ButtonToolbar className="ws-nowrap">
      {isAdmin && 
      <EditRoomBtnDrawer/>
      }
      </ButtonToolbar>
    </div>
    <div className="d-flex justify-content-between align-items-center">
<span>ToDo</span>
<RoomInfoBtnModel></RoomInfoBtnModel>
    </div>
  </div>;
};

export default memo(ChatTop);
