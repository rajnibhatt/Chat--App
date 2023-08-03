import React from "react";
import { Modal } from "rsuite";
import { useModelState } from "../../../misc/customhooks";

const ImgBtnModal = ({src,fileName})=>{
    const {isOpen,open,close} = useModelState();

    return(
        <>
            <input type="image" src={src} alt="file" onClick={open} className="mw-100 mh-100 w-auto"></input>
            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    <Modal.Title>{fileName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img src={src} width="100%" height="100%" alt="file"></img>
                </Modal.Body>
                <Modal.Footer>
                    <a href={src} target="_blank" rel="noopener noreferrer" >View Origional</a>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ImgBtnModal;