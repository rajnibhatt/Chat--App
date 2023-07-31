import React from "react";
import { useCurrentRoom } from "../../../Context/Current-room.context";
import { Button, Modal } from "rsuite";
import { useModelState } from "../../../misc/customhooks";

const RoomInfoBtnModel = ()=>{

    const {isOpen,close,open} = useModelState();
    const description = useCurrentRoom(v=>v.description);
    const name = useCurrentRoom(v=> v.name);

    return( <div>
        <Button appearance="link" className="px-0" onClick={open}>Room Information</Button>
        <Modal show={isOpen} onHide={close} >
            <Modal.Header>
                <Modal.Title>
                    About{name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h6 className="mb-1">description</h6>
                <p>{description}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button block onClick={close}>
                    close
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
)
};

export default RoomInfoBtnModel;