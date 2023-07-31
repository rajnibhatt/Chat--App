import React, { useCallback, useRef, useState } from "react";
import { useModelState } from "../misc/customhooks";
import { Button, ControlLabel, FormControl, FormGroup, Icon, Modal, Form, Schema, Alert } from "rsuite";
import { database,auth } from "../misc/firebase";
import { serverTimestamp } from 'firebase/database';


const {StringType} = Schema.Types;
const model = Schema.Model({
    name: StringType().isRequired('chat name is required'),
    description: StringType().isRequired('description is required'),

})

const INITIAL_FORM = {
    name:'',
    description:''
}
const CreateRoomBtnModel = () => {
    const {isOpen,open,close} = useModelState();

    const [formValue,SetFormValue] = useState(INITIAL_FORM);
    const [isLoading,setIsLoading] = useState(false);
    const formRef = useRef();

    const onFormChange = useCallback((value) =>{
        SetFormValue(value);

    },[]);

    const onSubmit = async ()=>{
        if(!formRef.current.check()){
            return;
        }

setIsLoading(true);
const newRoomData = {
    ...formValue,
    createdAt: serverTimestamp(),
    admins:{
    [auth.currentUser.uid]:true
    },
};

try{
   await database.ref('rooms').push(newRoomData);
   Alert.info(`${formValue.name} has been created`,4000);
   setIsLoading(false);
   SetFormValue(INITIAL_FORM);
   close();

}catch(err){
 setIsLoading(false);
    Alert.error(err.message,4000);
}
    }

    return <div className="mt-2">
        <Button block color="green" onClick={open}>
            <Icon icon = "creative"></Icon>
            Create new chat room

        </Button>
        <Modal show={isOpen} onHide={close}>
            <Modal.Header>
                <Modal.Title>New Chat Room</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form 
                fluid onChange={onFormChange}
                 formValue={formValue} 
                 model={model}
                 ref={formRef}
                 >
                    <FormGroup>
                        <ControlLabel>Room Name</ControlLabel>
                        <FormControl name="name" placeholder="enter chat room name..."></FormControl>
                    </FormGroup>
                     <FormGroup>
                        <ControlLabel> Description</ControlLabel>
                        <FormControl componentClass="textarea" rows={5} name="description" placeholder="enter room description..."></FormControl>
                    </FormGroup>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button block appearance="primary" onClick={onSubmit} disabled={isLoading}>
                    Create new chat room
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
}

export default CreateRoomBtnModel;