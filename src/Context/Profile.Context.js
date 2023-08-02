import React,{ createContext, useContext, useEffect, useState } from "react";
import { auth, database } from "../misc/firebase";
import { ref, onValue, off, set, onDisconnect } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import  firebase  from "firebase/app";
import { FieldValue, serverTimestamp } from 'firebase/database';


export const isOfflineForDatabase = {
    state: 'offline',
    last_changed: serverTimestamp(),
};

const isOnlineForDatabase = {
    state: 'online',
    last_changed: serverTimestamp(),
};


const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [profile,setProfile] = useState(false);
    const [isLoading,setIsLoading] = useState(true);
    
    useEffect(()=>{
        let userRef;
        let userStatusRef;
        
        const authUnsub = onAuthStateChanged(auth, async authObj=>{
            console.log("calling authUnSub");
            if(authObj){
                userStatusRef = ref(database,(`/status/${authObj.uid}`));
                userRef = ref(database, (`/profiles/${authObj.uid}`));
                console.log("auth is present");
                onValue(userRef, snap => {
                     const { name, createdAt, avatar } = snap.val();
                    const data = {
                        name,
                        avatar,
                        createdAt,
                        uid: authObj.uid,
                        email: authObj.email
                    };
                    setProfile(data);
                    setIsLoading(false);

                });

onValue(ref(database,'.info/connected'), snapshot=> {
    if (snapshot.val() === false) {
        return;
    };

        onDisconnect(userStatusRef).set(isOfflineForDatabase).then(()=> {
            set(userStatusRef, isOnlineForDatabase);
        
        });
});


                
            }else{
                console.log("auth is not present");
                if(userRef) {
                    off(userRef);
                }
                if(userStatusRef){
                    off(userStatusRef);

                }

         off(ref(database,'.info/connected'));
                setProfile(null);
                setIsLoading(false);
            }
        });

         return () => {
            authUnsub();

            off(ref(database, '.info/connected'));

            if (userRef) {
                off(userRef);
            }
            
            if(userStatusRef){
                 off(userStatusRef);
            }

    };

    }, [])

    return (
        <ProfileContext.Provider value={{ isLoading, profile }}>
            { children }
        </ProfileContext.Provider>
    );

};

export const useProfile = ()=> useContext(ProfileContext);