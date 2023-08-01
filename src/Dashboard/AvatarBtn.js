import React, { useState,useRef } from "react";
import { Alert, Button, Modal } from "rsuite";
import { useModelState } from "../misc/customhooks";
import AvatarEditor from 'react-avatar-editor';
import { database, storage } from "../misc/firebase";
import { ref as storageref, uploadBytes, getDownloadURL } from "firebase/storage"
import { useProfile } from "../Context/Profile.Context";
import { ref, set, update } from "firebase/database";
import ProfileAvatar from "./ProfileAvatar";
import { getUserUpdates } from "../misc/helper";



const fileInputTypes = ".png, .jpeg, .jpg";
const acceptedFileTypes = ['image/png','image/jpeg','image/pjpeg'];
const getBlob = (canvas) =>{
    return new Promise((resolve,reject)=>{
        canvas.toBlob((Blob)=>{
            if(Blob){
                resolve(Blob);
            }else{
                reject(new Error("file process error"));
            }
        })
    })
}
const isValidFile = (file)=>{
    return acceptedFileTypes.includes(file.type);
}

const AvatarBtn = () => {

  const { isOpen, open, close } = useModelState();
  const {profile} = useProfile();

    const [img,setImg] = useState(null);
    const [isLoading,setIsLoading] = useState(false);
    const AvatarEditorRef = useRef();

const onFileInputChange = (ev)=>{
    const currentFile = ev.target.files;

    if(currentFile.length === 1){
        const file = currentFile[0];

        if(isValidFile(file) ){
            setImg(file);
            console.log(file);
            open();
        }else{

            Alert.warning(`wrong file type ${file.type},4000`);
        }

    }
};
    const onUploadClick = async ()=>{
        const canvas = AvatarEditorRef.current.getImageScaledToCanvas();
        setIsLoading(true);
        try{

            const Blob = await getBlob(canvas);
            const AvatarFileRef = storageref(storage, `/profile/${profile.uid}/avatar`);
            await uploadBytes(AvatarFileRef, Blob, {
                cacheControl: `public, max-age=${3600 * 24 * 3}`,
            });
            const downloadUrl = await getDownloadURL(AvatarFileRef);
             const updates =  await getUserUpdates(
                profile.uid,
                'avatar',
                downloadUrl,
                database
                );
           await update(ref(database), updates);
            setIsLoading(false);
            Alert.info('Avatar has been uploaded',4000);


        }catch(err){
            setIsLoading(false);
            Alert.error(err.message,4000);
            console.log(err.message);
        }   
     }


    return(
        <div className="mt-3 text-center" >
            <ProfileAvatar src={profile.avatar} 
            name={profile.name}
              className="width-200 height-200 img-fullsize font-huge"></ProfileAvatar>
            <div>
                <label htmlFor="avatar-upload" className="d-block cursor-pointer padded">
                    Selecct new avatar
                    <input 
                    id="avatar-upload"
                     type="file" 
                     className="d-none" 
                     accept={fileInputTypes}
                     onChange={onFileInputChange}
                     
                     >
                     </input>
                </label>
                <Modal show={isOpen} onHide={close}>
                    <Modal.Header>
                        <Modal.Title>
                            Adjust andd upload new avatar
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="d-flex justify-content-center align-item-center h-100">

                        {img && (
                        <AvatarEditor
                        ref={AvatarEditorRef}
                            image={img}
                            width={250}
                            height={250}
                         
                            />
                        
                        
)}
                    </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button block appearance="ghost" onClick={onUploadClick} disabled={isLoading}>
                            Upload new Avatar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

        </div>
    )

}
export default AvatarBtn;