import React, { useCallback } from "react";
import { Alert, Button,Drawer,Icon } from "rsuite";
import { useModelState,useMediaQuery } from "../misc/customhooks";
import Dashboard from '.';
import {set,ref} from 'firebase/database'
import { auth, database } from "../misc/firebase";
import { isOfflineForDatabase } from "../Context/Profile.Context";

 const DashboardToggle = () =>{
    
    const {isOpen,close,open} =  useModelState();
    const isMobile = useMediaQuery('(max-width: 992px)');

    const onSignOut = useCallback(()=>{
 
          set(ref(database,`/status/${auth.currentUser.uid}`),isOfflineForDatabase).then(()=>{
           
              
        auth.signOut();
        Alert.info('Signed Out',4000);
        
        close();
    }).catch(err=>{
Alert.error(err.message,4000);
    });
    },[close])

    return(
            <>
            <Button block color = "blue" onClick={open}>

            <Icon icon="dashboard"> Dashboard</Icon>
            </Button>
            <Drawer  full={isMobile} show={isOpen} onHide={close} placement="left">
                <Dashboard onSignOut={onSignOut}/>
            </Drawer>

        </>

        
    );
}

export default DashboardToggle;