import { useCallback, useEffect, useState } from "react";

import useCurrentUser from "@/hooks/useCurrentUser";
import useEditModal from "@/hooks/useEditModal";
import useUser from "@/hooks/useUser";

import toast from "react-hot-toast";
import axios from "axios";

import Modal from "../Modal";
import Input from "../Input";
import ImageUpload from "../ImageUpload";
import DeleteAccountModal from "./DeleteAccountModal";
import { AiOutlineDelete } from "react-icons/ai";

const EditModal = () => {
    const { data: currentUser } = useCurrentUser();
    const { mutate: mutateFetchedUser } = useUser(currentUser?.id);
    const editModal = useEditModal();

    const [profileImage, setProfileImage] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');

    const [isDeleteAccountModalOpen, setisDeleteAccountModalOpen] = useState(false);



    useEffect(() => {
        setProfileImage(currentUser?.profileImage);
        setCoverImage(currentUser?.coverImage);
        setName(currentUser?.name);
        setUsername(currentUser?.username);
        setBio(currentUser?.bio);
    }, [
        currentUser?.name,
        currentUser?.username,
        currentUser?.bio,
        currentUser?.profileImage,
        currentUser?.coverImage
    ]);

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = useCallback(async () => {
        try {
            setIsLoading(true);

            await axios.patch('/api/edit', { name, username, bio, profileImage, coverImage });
            mutateFetchedUser();

            toast.success('Updated');

            editModal.onClose();
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    }, [bio, name, username, profileImage, coverImage, editModal, mutateFetchedUser]);

    const handleDeleteUser = useCallback(async () => {
        try {

            setIsLoading(true);

            const response = await axios.delete('/api/deleteUser');


            if (response.status === 200) {
                toast.success('Conta excluída com sucesso!');
                editModal.onClose();

                window.location.href = '/';
            } else {
                throw new Error('Erro ao excluir a conta.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Algo deu errado ao excluir a conta.');
        } finally {
            setIsLoading(false);
        }
    }, [editModal]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <ImageUpload
                value={profileImage}
                disabled={isLoading}
                onChange={(image) => setProfileImage(image)}
                label="Foto de Perfil"
            />
            <ImageUpload
                value={coverImage}
                disabled={isLoading}
                onChange={(image) => setCoverImage(image)}
                label="Imagem de Fundo"
            />
            <Input
                placeholder="Nome"
                onChange={(e) => setName(e.target.value)}
                value={name}
                disabled={isLoading}
            />
            <Input
                placeholder="Usuário"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                disabled={isLoading}
            />
            <Input
                placeholder="Biografia"
                onChange={(e) => setBio(e.target.value)}
                value={bio}
                disabled={isLoading}
            />
            <div className="flex justify-end">
                <button //onClick={handleDeleteUser}
                    onClick={() => {
                        setisDeleteAccountModalOpen(true);
                    }}
                    className="
                flex
                gap-2
                justify-center
                items-center
                text-red-500 
                font-bold
                disabled:opacity-70
                disabled:cursor-not-allowed
                rounded-full
                hover:opacity-80
                transition
                bg-white
                border-black
                text-xl
                px-3
                py-2"> <AiOutlineDelete size={20} />
                    <p>Deletar conta</p>
                </button>
            </div>
        </div>
    )

    return (
        <>
            <Modal
                disabled={isLoading}
                isOpen={editModal.isOpen}
                title="Editar Perfil"
                actionLabel="Salvar"
                onClose={editModal.onClose}
                onSubmit={onSubmit}
                body={bodyContent}
            />
            <DeleteAccountModal
                isOpen={isDeleteAccountModalOpen}
                onClose={() => setisDeleteAccountModalOpen(false)}
                onDelete={async () => {
                    try {
                        await handleDeleteUser();
                        setisDeleteAccountModalOpen(false);
                    } finally {
                        setisDeleteAccountModalOpen(false);
                    }
                }}
            />
        </>
    )
}

export default EditModal;