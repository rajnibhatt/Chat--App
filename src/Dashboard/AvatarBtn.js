import React, { useState } from "react";
import { Alert, Button, Modal } from "rsuite";
import { useModelState } from "../misc/customhooks";
import AvatarEditor from 'react-avatar-editor';



const fileInputTypes = ".png, .jpeg, .jpg";
const acceptedFileTypes = ['image/png','image/jpeg','image/pjpeg'];
const isValidFile = (file)=>{
    return acceptedFileTypes.includes(file.type);
}

const AvatarBtn = () => {

  const { isOpen, open, close } = useModelState();

    const [img,setImg] = useState(null);

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
}

    return(
        <div className="mt-3 text-center" >
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
                            image={img}
                            width={250}
                            height={250}
                         
                            />
                        
                        
)}
                    </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button block appearance="ghost">
                            Upload new Avatar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

        </div>
    )

}
export default AvatarBtn;