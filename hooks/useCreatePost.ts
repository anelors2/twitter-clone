import { useCallback } from "react";
import axios from "axios";
import useSWR from "swr";

const useCreatePost = () => {
    const { mutate } = useSWR("/api/posts");

    const createPost = useCallback(async (body: string) => {
        try {
            const response = await axios.post("/api/posts", { body });
            mutate();
            return response.data;
        } catch (error) {
            console.error(error);
            throw new Error("Erro ao criar o post");
        }
    }, [mutate]);

    return { createPost };
};

export default useCreatePost;