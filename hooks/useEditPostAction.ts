import { useCallback } from "react";
import useEditPost from "./useEditPost";
import toast from "react-hot-toast";

const useEditPostAction = (postId: string) => {
    const { editPost } = useEditPost(postId);

    const handleEdit = useCallback(async (editedBody: string) => {
        if (!editedBody.trim()) {
            toast.error("O conteúdo do post não pode estar vazio");
            return;
        }

        try {
            await editPost(editedBody);
            toast.success("Post editado com sucesso!");
        } catch (error) {
            toast.error("Erro ao editar o post");
        }
    }, [editPost]);

    return { handleEdit };
};

export default useEditPostAction;