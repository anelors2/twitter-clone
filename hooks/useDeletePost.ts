import { useCallback } from "react";
import axios from "axios";
import useSWR from "swr";

const useDeletePost = (postId: string) => {
    const { mutate } = useSWR("/api/posts");

    const deletePost = useCallback(async () => {
        try {
            await axios.delete(`/api/posts/${postId}`);
            // Atualiza a lista de posts após a exclusão
            mutate(); // Revalida os dados do SWR
        } catch (error) {
            console.error(error);
            throw new Error("Erro ao deletar o post");
        }
    }, [postId, mutate]);

    return { deletePost };
};

export default useDeletePost;