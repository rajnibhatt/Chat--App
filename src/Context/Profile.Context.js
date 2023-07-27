import React,{ createContext, useContext, useEffect, useState } from "react";
import { auth, database } from "../misc/firebase";
import { ref, onValue, off } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [profile,setProfile] = useState(false);
    const [isLoading,setIsLoading] = useState(true);

    useEffect(()=>{
        let userRef;
        // let userStatusRef;

        const authUnsub = onAuthStateChanged(auth, async authObj=>{
            console.log("calling authUnSub");
            if(authObj){
                userRef = ref(database, (`/profiles/${authObj.uid}`));
                console.log("auth is present");
                onValue(userRef, snap => {
                    const {name,createdAt} = snap.val();

                    const data = {
                        name,
                        createdAt,
                        uid: authObj.uid,
                        email: authObj.email
                    };
                    setProfile(data);
                    setIsLoading(false);

                });
                
            }else{
                console.log("auth is not present");
                if(userRef) {
                    off(userRef);
                }
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

    };

    }, [])

    return (
        <ProfileContext.Provider value={{ isLoading, profile }}>
            { children }
        </ProfileContext.Provider>
    );

};

export const useProfile = ()=> useContext(ProfileContext);