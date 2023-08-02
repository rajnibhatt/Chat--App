import { equalTo, get, orderByChild, query,ref as dbRef } from "firebase/database";

export function getNameInitials(name){
    const splitName = name.toUpperCase().split('');
    if(splitName.length > 1){

        return splitName[0][0] + splitName[1][0]
    }
    return splitName[0][0];
}

export function transformToArrWithId(snapVal) {
    return snapVal
     ? Object.keys(snapVal).map(roomId=>{
        return {...snapVal[roomId],id:roomId};
    })
     : [];
}


export async function getUserUpdates(userId, keyToUpdate, value, db){
    const updates = {};
    updates[`/profiles/${userId}/${keyToUpdate}`] = value;

    const getMsgs = get(
        query(
        dbRef(db,'/messages'),
        orderByChild('author/uid'),
        equalTo(userId),
    
        ));

    const getRooms = get(
        query(
            dbRef(db,'/rooms'),
            orderByChild('lastMessage/author/uid'),
            equalTo(userId)

        )
    );
    const [mSnap,rSnap] = await Promise.all([getMsgs,getRooms]);

    mSnap.forEach(msgSnap => {
         updates[`/messages/${msgSnap.key}/author/${keyToUpdate}`] = value;
    });

    rSnap.forEach(roomSnap => {
    updates[`/rooms/${roomSnap.key}/lastMessage/author/${keyToUpdate}`] = value;
  });
  return updates;
}
