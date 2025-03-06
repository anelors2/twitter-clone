import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/libs/serverAuth";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: "Método não permitido" });
    }

    try {
        const { currentUser } = await serverAuth(req, res);
        const { notificationId } = req.query;

        if (!notificationId || typeof notificationId !== 'string') {
            throw new Error('ID inválido');
        }


        const notification = await prisma.notification.findUnique({
            where: { id: notificationId },
        });

        if (!notification || notification.userId !== currentUser.id) {
            throw new Error('Notificação não encontrada ou não pertence ao usuário.');
        }


        await prisma.notification.delete({
            where: { id: notificationId },
        });


        const remainingNotifications = await prisma.notification.findMany({
            where: { userId: currentUser.id },
        });


        if (remainingNotifications.length === 0) {
            await prisma.user.update({
                where: { id: currentUser.id },
                data: { hasNotification: false },
            });
        }

        return res.status(200).json({ message: "Notificação excluída com sucesso!" });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: "Erro ao excluir a notificação." });
    }
}