import { useCallback } from "react";
import axios from "axios";
import useSWR from "swr";

const useEditPost = (postId: string) => {
    const { mutate } = useSWR(`/api/posts/${postId}`);

    const editPost = useCallback(async (newBody: string) => {
        try {
            const response = await axios.put(`/api/posts/${postId}`, { body: newBody });
            // Atualiza o post específico após a edição
            mutate(); // Revalida os dados do SWR
            return response.data;
        } catch (error) {
            console.error(error);
            throw new Error("Erro ao editar o post");
        }
    }, [postId, mutate]);

    return { editPost };
};

export default useEditPost;