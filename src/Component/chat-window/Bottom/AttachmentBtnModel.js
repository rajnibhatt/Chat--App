import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Icon, InputGroup, Modal,Uploader,Alert } from "rsuite";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useModelState } from "../../../misc/customhooks";
import { storage } from '../../../misc/firebase';


const MAX_FILE_SIZE = 1000 * 1024 * 5;

const AttachmmenttBtnModel = ({afterUpload})=>{

    const {chatId} = useParams();
    const {isOpen,close,open} = useModelState();
    const [fileList,setFileList] = useState([]);
    const [isLoading,setIsLoading] = useState (false);

    const onChange = (fileArr)=>{
        const filtered = fileArr.filter(el=> el.blobFile.size <= MAX_FILE_SIZE).slice(0,5);
        setFileList(filtered);

    }

    const onUpload = async ()=>{

        try{
            const uploadPromises = fileList.map(f => {
        return uploadBytes(
          ref(storage, `/chat/${chatId}/${Date.now() + f.name}`),
          f.blobFile,
          {
            cacheControl: `public, max-age=${3600 * 24 * 3}`,
          }
        );
      });
      const uploadSnapshots = await Promise.all(uploadPromises);
      const shapePromises = uploadSnapshots.map(async snap => {
        return {
          contentType: snap.metadata.contentType,
          name: snap.metadata.name,
          url: await getDownloadURL(snap.ref),
        };
      });
              const files = await Promise.all(shapePromises);
              await afterUpload(files);
              setIsLoading(false);
              close();

        }catch(err)
        {
            setIsLoading(false);
            Alert.error(err.message);
        }
    } 



     return(
        <>
<InputGroup.Button onClick={open}>
        <Icon icon="attachment"></Icon>
</InputGroup.Button>
<Modal show={isOpen} onHide={close}>
    <Modal.Header>
        <Modal.Title>
            Upload Files
        </Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Uploader
        
        autoUpload={false}
        action=""
        fileList={fileList}
        onChange={onChange}
        multiple
        listType="picture-text"
        className="w-100"
        disabled={isLoading}
        
      />
    </Modal.Body>
    <Modal.Footer>
        <Button block disabled={isLoading} onClick={onUpload}>Send To Chat</Button>
        <div className="text-right mt-2"><small>* only files less then 5 mb are allowed </small></div>
    </Modal.Footer>
</Modal>


         </>
     )
}

export default AttachmmenttBtnModel;