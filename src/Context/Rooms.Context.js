import { React,createContext, useContext, useEffect, useState } from "react";
import {onValue, ref,off } from 'firebase/database';
import { database } from "../misc/firebase";
import { transformToArrWithId } from "../misc/helper";




const RoomsConntext = createContext();

export const RoomsProvider = ({children})=>{

    const [rooms,setRooms] = useState(null);

    useEffect(() => {
        const roomListRef = ref(database, 'rooms');

        onValue(roomListRef, (snap) => {
            if (snap.exists()) {
            // Data exists, proceed with the transformation
            const data = transformToArrWithId(snap.val());
            setRooms(data);
            console.log(snap.val());
            console.log(data);
            } else {
            // Data doesn't exist, handle accordingly (e.g., set default value or show a message)
            console.log("Data doesn't exist.");
            }
        });

        return () => {
            off(roomListRef);
        };
    }, []);


    return <RoomsConntext.Provider value={rooms}>{children}</RoomsConntext.Provider>
}

export const useRooms = () => useContext(RoomsConntext);