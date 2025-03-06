import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/router";
import { AiOutlineHeart, AiFillHeart, AiOutlineMessage, AiFillEdit, AiOutlineDelete } from "react-icons/ai";
import React, { useCallback, useMemo, useState } from "react";

import useCurrentUser from "@/hooks/useCurrentUser";
import useLoginModal from "@/hooks/useLoginModal";
import useLike from "@/hooks/useLike";

import Avatar from "../Avatar";
import useEditPostAction from "@/hooks/useEditPostAction";
import useDeletePostAction from "@/hooks/useDeletePostAction";
import Button from "../Button";
import DeleteModal from "../modals/DeleteModal";
import Emoji from "../Emoji";

interface PostItemProps {
    data: Record<string, any>;
    userId?: string;
}

const PostItem: React.FC<PostItemProps> = ({ data, userId }) => {
    const router = useRouter();
    const loginModal = useLoginModal();

    const { data: currentUser } = useCurrentUser();
    const { hasLiked, toggleLike } = useLike({ postId: data.id, userId });

    const { handleDelete } = useDeletePostAction(data.id);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    const { handleEdit } = useEditPostAction(data.id);
    const [isEditing, setIsEditing] = useState(false);
    const [editedBody, setEditedBody] = useState(data.body);

    const handleEmojiClick = (emoji: string) => {
        setEditedBody((editedBody: string) => editedBody + emoji);
    };

    const goToUser = useCallback((event: any) => {
        event.stopPropagation();

        router.push(`/users/${data.user.id}`);
    }, [router, data.user.id]);

    const goToPost = useCallback(() => {
        router.push(`/posts/${data.id}`);
    }, [router, data.id]);

    const onLike = useCallback((event: any) => {
        event.stopPropagation();

        if (!currentUser) {
            return loginModal.onOpen();
        }

        toggleLike();
    }, [loginModal, currentUser, toggleLike]);

    const createdAt = useMemo(() => {
        if (!data?.createdAt) {
            return null;
        }

        return formatDistanceToNowStrict(new Date(data.createdAt));
    }, [data?.createdAt]);

    const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart;
    const isPostCreator = currentUser?.id === data.userId;

    const handleSaveChanges = async () => {
        if (!editedBody.trim()) {
            return;
        }

        try {
            await handleEdit(editedBody);
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className="border-b-[1px] border-neutral-800 p-5 cursor-pointer hover:bg-neutral-900 transition">
                <div className="flex flex-row items-start gap-3">
                    <Avatar userId={data.user.id} />
                    <div>
                        <div className="flex flex-row items-center gap-2">
                            <p onClick={goToUser} className="text-white font-semibold cursor-pointer hover:underline">
                                {data.user.name}
                            </p>
                            <span onClick={goToUser} className="text-neutral-500 cursor-pointer hover:underline hidden md:block">
                                @{data.user.username}
                            </span>
                            <span className="text-neutral-500 text-sm">
                                {createdAt}
                            </span>
                        </div>

                        {isEditing ? (
                            <div>
                                <textarea
                                    value={editedBody}
                                    onChange={(e) => setEditedBody(e.target.value)}
                                    className="disabled:opacity-80 p-2 peer resize-none mt-3 w-full border rounded-2xl bg-black ring-0 outline-none text-[20px] placeholder-neutral-500 text-white"
                                />
                                <hr className="opacity-10 peer-focus:opacity-100 h-[1px] w-full border-neutral-800 transition" />
                                <div>
                                    <Emoji onEmojiClick={handleEmojiClick} />
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <Button
                                        label="Salvar Alterações"
                                        onClick={handleSaveChanges}
                                        disabled={!editedBody.trim()}
                                    />
                                    <Button
                                        label="Cancelar"
                                        secondary
                                        onClick={() => setIsEditing(false)}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="text-white mt-1">{data.body}</div>
                        )}

                        <div className="flex flex-row items-center mt-3 gap-10">
                            <div className="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-sky-500">
                                <AiOutlineMessage onClick={goToPost} size={20} />
                                <p>{data.comments?.length || 0}</p>
                            </div>
                            <div onClick={onLike} className="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-red-500">
                                <LikeIcon size={20} color={hasLiked ? 'red' : ''} />
                                <p>{data.likedIds.length}</p>
                            </div>
                            {isPostCreator && !isEditing && (
                                <>
                                    <div className="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-sky-500">
                                        <AiFillEdit size={20} onClick={() => setIsEditing(true)} />
                                    </div>
                                    <div className="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-sky-500">
                                        <AiOutlineDelete size={20} onClick={() => setIsDeleteModalOpen(true)} />
                                    </div>
                                </>
                            )} 
                        </div>
                    </div>
                </div>
            </div>
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={async () => {
                    try {
                        await handleDelete(); 
                        setIsDeleteModalOpen(false); 
                    } finally {
                        setIsDeleteModalOpen(false); 
                    }
                }}
            />
        </>
    );
};

export default PostItem;