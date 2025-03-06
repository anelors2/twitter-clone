import serverAuth from "@/libs/serverAuth";
import prisma from '@/libs/prismadb';
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Verifica se o método é DELETE
        if (req.method !== 'DELETE') {
            return res.status(405).json({ error: "Método não permitido" });
        }

        // Verifica se o usuário está autenticado
        const { currentUser } = await serverAuth(req, res);

        // Exclui o usuário do banco de dados
        await prisma.user.delete({
            where: { id: currentUser.id }
        });

        // Retorna uma mensagem de sucesso
        return res.status(200).json({ message: "Usuário excluído com sucesso!" });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: "Erro ao excluir o usuário." });
    }
}