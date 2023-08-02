import React,{memo} from "react";
import { Alert, Button, Drawer } from "rsuite";
import { useMediaQuery, useModelState } from "../../../misc/customhooks";
import EditableInput from "../../EditableIInputs";
import { useCurrentRoom } from "../../../Context/Current-room.context";
import { ref, set } from "firebase/database";
import { database } from "../../../misc/firebase";
import { useParams } from "react-router-dom";

const EditRoomBtnDrawer = ()=>{

    const isMobile = useMediaQuery('max-width: 992px');
    const {isOpen,open,close} = useModelState();
    const {chatId} = useParams();
    const name = useCurrentRoom(v=> v.name);
    const description = useCurrentRoom(v=> v.description);

    const updateData = (key,value)=>{
        set(ref(database,`/rooms/${chatId}/${key}`),value).then(()=>{
            Alert.success('Successfully updated',4000);
        }).catch(err => {
            Alert.error(err.message,4000);
          })


    }

    const onNameSave = (name)=>{
        updateData('name',name);

    }

    const onDescriptionSave = (desc)=>{
        updateData('description',desc)

    }

    return(
            <div>
                <Button className="br-circle" size="sm" color="red" onClick={open}>A</Button>
                <Drawer full={isMobile} show={isOpen} onHide={close} placement="right">
                    <Drawer.Header>
                        <Drawer.Title>Edit Room</Drawer.Title>
                    </Drawer.Header>
                    <Drawer.Body>
                        <EditableInput
                        initialValue={name}
                        onSave={onNameSave}
                        label={<h6 className="mb-2">name</h6>}
                        emptyMsg="Name can not be empty"
                        />
                           <EditableInput
                           componentClass = "textarea"
                           rows="5"
                        initialValue={description}
                        onSave={onDescriptionSave}
                        label={<h6 className="mb-2">description</h6>}
                        emptyMsg="Description can not be empty"
                        wrapperClassName="mt-3"
                       />

                    </Drawer.Body>
                    <Drawer.Footer>
                        <Button block onClick={close}>Close</Button>
                    </Drawer.Footer>
                </Drawer>
            </div>
        )

}

export default memo(EditRoomBtnDrawer);