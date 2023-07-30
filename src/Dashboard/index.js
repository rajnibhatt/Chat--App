import React from "react";
import { Drawer,Button, Divider, Alert } from 'rsuite';
import { useProfile } from "../Context/Profile.Context";
import EditableInput from "../Component/EditableIInputs";
import { database } from "../misc/firebase";
import { ref, set } from "firebase/database";
import ProviderBlock from "./ProviderBlock";
import AvatarBtn from "./AvatarBtn";


const Dashboard = ({onSignOut}) => {
const {profile} = useProfile();
const onSave = async newData =>{
    const userNickNameRef = ref(database, `/Profiles/${profile.uid}/name`);
    try{
        await set(userNickNameRef, newData);
        Alert.success('Nick name has been updated',4000);
    }catch(err){
        Alert.error(err.message,4000);
    }
};
    return (
    <>
    <Drawer.Header>
        <Drawer.Title>
            Dashboard
        </Drawer.Title>
    </Drawer.Header>
    <Drawer.Body>

        <h3>Hey,{profile.name}</h3>
        <ProviderBlock></ProviderBlock>
        <Divider/>
        <EditableInput
        name= "NickName"
        initialValue = {profile.name}
        onSave = {onSave}
        label = {<h6 className="mb-2">NickName</h6>}
        />
        <AvatarBtn></AvatarBtn>
    </Drawer.Body>
    <Drawer.Footer>
    <Button block color="red" onClick={onSignOut}>
        SignOut
    </Button>
    </Drawer.Footer>
    </>
    );
};

export default Dashboard;