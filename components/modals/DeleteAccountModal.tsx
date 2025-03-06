import Modal from "../Modal";

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose, onDelete }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={onDelete}
            title="Excluir Tweet"
            actionLabel="Excluir"
            disabled={false}
            body={
                <div className="
                w-full
                p-6
                text-lg
                bg-black
                border-2
                border-neutral-800
                rounded-md
                outline-none
                focus:border-sky-500
                focus:border-2
                transition
                disabled:bg-neutral-900
                disabled:opacity-70">
                    <p className="text-white text-center font-bold">
                        Tem certeza que deseja excluir sua conta?
                    </p>
                </div>
            }
        />
    );
};

export default DeleteAccountModal;