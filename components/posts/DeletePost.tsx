import useDeletePost from "@/hooks/useDeletePost";
import toast from "react-hot-toast";

interface DeletePostProps {
    postId: string;
}

const DeletePost = ({ postId }: DeletePostProps) => {
    const { deletePost } = useDeletePost(postId);

    const handleDelete = async () => {
        if (window.confirm("Tem certeza que deseja deletar este post?")) {
            try {
                await deletePost();
                toast.success("Post deletado com sucesso!");
            } catch (error) {
                toast.error("Erro ao deletar o post");
            }
        }
    };

    return (
        <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">
            Deletar Post
        </button>
    );
};

export default DeletePost;