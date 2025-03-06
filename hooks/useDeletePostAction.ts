import { useCallback } from "react";
import useDeletePost from "./useDeletePost";
import toast from "react-hot-toast";

const useDeletePostAction = (postId: string) => {
    const { deletePost } = useDeletePost(postId);

    const handleDelete = useCallback(async () => {
       
            try {
                await deletePost();
                toast.success("Post deletado com sucesso!");
            } catch (error) {
                toast.error("Erro ao deletar o post");
            }

    }, [deletePost]);

    return { handleDelete };
};

export default useDeletePostAction;