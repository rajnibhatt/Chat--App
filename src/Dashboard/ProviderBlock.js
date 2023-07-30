import React, { useState } from "react";
import { auth } from "../misc/firebase";
import { Alert, Button, Icon, Tag } from "rsuite";
import {
    FacebookAuthProvider,
    GoogleAuthProvider,
    linkwithPopup,
    unlink} from 'firebase/auth';

const ProviderBlock = ()=>{

    const [isConnected,setIsConnected] = 
    useState({'google.com': auth.currentUser.providerData.some((data)=>data.providerId === 'google.com'),
    'facebook.com': auth.currentUser.providerData.some((data)=> data.providerId === 'facebook.com')
});

const updateIsConnected = (providerId,value)=>{
    setIsConnected(p=>{
        return{
            ...p,
            [providerId]: value,
        };
    });
};


const unlink = async(ProviderId) => {
    try{
        if(auth.currentUser.providerData.length === 1){
            console.log("Data: ",ProviderId);
            throw new Error(`you can not disconnect from ${ProviderId}`)
        }
   await auth.currentUser.unlink(ProviderId);
   updateIsConnected(ProviderId,false);
    }catch(err){
        Alert.error(err.message,4000);

    }

}


const unlinkFacebook = () => {
    unlink('facebook.com');
}
const unlinkGoogle = () => {
    unlink('google.com')
}


const link = async (Provider)=>{
    try{
         await auth.currentUser.linkwithPopup(Provider)
         Alert.info(`Linked To ${Provider.ProviderId}`,4000);
    }catch (err) {
       Alert.error(err.message,4000);
       updateIsConnected(Provider.providerId,true);

    }

}


const linkFacebook = () => {
    link(new FacebookAuthProvider())

};
const linkGoogle = () => {
    link(new GoogleAuthProvider())
};


    return(
        <div>
            {isConnected['google.com'] &&(
            <Tag color = "green" closable onClose={unlinkGoogle}>
                <Icon icon={"google" }>
                    Connected
                </Icon>
                </Tag>
               )}
               {isConnected['facebook.com'] &&(
                <Tag color = "blue" closable onClose={unlinkFacebook}>
                <Icon icon={"facebook"}>
                Connected
                </Icon>
            </Tag>
              )}
            <div className="mt-2">
                {!isConnected['google.com'] &&(
                <Button block color="green" onClick={linkGoogle}>
                    <Icon icon="google"></Icon>
                    Link to google
                </Button>
                )}
                {!isConnected["facebook.com"] &&(
                <Button block color="blue" onClick={linkFacebook}>
                    <Icon icon="facebook">

                    </Icon>
                    link to facebook
                </Button>
                 )}
            </div>
        </div>
    )
}
export default ProviderBlock;