import React from "react";
import Modal from "../Modal";


interface ImageModalProps {
    isOpen: boolean; 
    onClose: () => void; 
    src: string; 
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, src }) => {
    if (!src) return null;

const bodyContent =(
    <div className="w-full h-full flex items-center justify-center">
        <img
            src={src}
            alt="Expanded Profile"
            className="max-w-full max-h-full object-contain"
        />
    </div>
)
const footerContent = (
    <div className="text-neutral-400 text-center mt-4">
        
    </div>
);

    return (
        <Modal
            disabled={true}
            title=""
            actionLabel=""
            body={bodyContent}
            footer={footerContent}
            isOpen={isOpen}
            onClose={onClose} onSubmit={function (): void {
                throw new Error("Function not implemented.");
            } }
        />
            
    );
};

export default ImageModal;