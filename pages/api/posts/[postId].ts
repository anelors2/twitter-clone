import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    const { currentUser } = await serverAuth(req, res);

    
    const { postId } = req.query;

    if (!postId || typeof postId !== "string") {
        return res.status(400).json({ error: "ID inválido" });
    }

    try {

        if (req.method === "GET") {
            const post = await prisma.post.findUnique({
                where: { id: postId },
                include: {
                    user: true, 
                    comments: true, 
                },
            });

            if (!post) {
                return res.status(404).json({ error: "Post não encontrado" });
            }

            return res.status(200).json(post);
        }

        if (req.method === "DELETE") {
            const post = await prisma.post.findUnique({
                where: { id: postId },
            });

            if (!post) {
                return res.status(404).json({ error: "Post não encontrado" });
            }

            if (post.userId !== currentUser.id) {
                return res.status(403).end
            }

            await prisma.post.delete({
                where: { id: postId },
            });

            return res.status(200).json({ message: "Post deletado com sucesso" });
        }

        if (req.method === "PUT") {
            const { body } = req.body;

            if (!body || typeof body !== "string" || body.trim() === "") {
                return res.status(400).end;
            }

            const post = await prisma.post.findUnique({
                where: { id: postId },
            });

            if (!post) {
                return res.status(404).end;
            }

            if (post.userId !== currentUser.id) {
                return res.status(403).end;
            }

            const updatedPost = await prisma.post.update({
                where: { id: postId },
                data: { body },
            });

            return res.status(200).json(updatedPost);
        }

        return res.status(405).end;
    } catch (error) {
        console.error(error);
        return res.status(500).end;
    }
}