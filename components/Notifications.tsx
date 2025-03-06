import useCurrentUser from "@/hooks/useCurrentUser";
import useNotifications from "@/hooks/useNotifications";
import React, { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Notifications = () => {
    const { data: currentUser } = useCurrentUser();
    const { data: notifications = [], mutate } = useNotifications(currentUser?.id);


    const clearNotifications = useCallback(async () => {
        try {
            await axios.post('/api/notifications/clear');
            toast.success("Notificações limpas!");
            mutate(); 
        } catch (error) {
            console.error(error);
            toast.error("Erro ao limpar as notificações.");
        }
    }, [mutate]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Notificações</h1>

            {/* Botão para limpar notificações */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={clearNotifications}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                    Limpar Notificações
                </button>
            </div>

            {notifications.length === 0 ? (
                <p className="text-neutral-500">Nenhuma notificação disponível.</p>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notification: Record<string, any>) => (
                        <div key={notification.id} className="p-4 border-b border-neutral-800">
                            <p className="text-white">{notification.body}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;