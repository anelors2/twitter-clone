import { BsTwitter } from "react-icons/bs";
import { useCallback, useEffect } from "react";

import useCurrentUser from "@/hooks/useCurrentUser";
import useNotifications from "@/hooks/useNotifications";
import toast from "react-hot-toast";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";


const NotificationsFeed = () => {
    const { data: currentUser, mutate: mutateCurrentUser } = useCurrentUser();
    const { data: fetchedNotifications = [], mutate: mutateNotifications } = useNotifications(currentUser?.id);

    useEffect(() => {
        mutateCurrentUser();
    }, [mutateCurrentUser]);

    const deleteNotification = useCallback(async (notificationId: string) => {
        try {
            await axios.delete(`/api/notification/${notificationId}`);
            toast.success("Notificação excluída!");

            mutateNotifications();
        } catch (error) {
            console.error('Error',error);
            toast.error("Erro ao excluir.");
        }
    }, [mutateNotifications]);


    if (fetchedNotifications.length === 0) {
        return (
            <div className="text-neutral-600 text-center p-6 text-xl">
                Sem notificações!
            </div>
        )
    }

    return (
        <div className="flex flex-col">
           

            {fetchedNotifications.length === 0 ? (
                <p className="text-neutral-500 text-center">Nenhuma notificação disponível.</p>
            ) : (
                
                fetchedNotifications.map((notification: Record<string, any>) => (
                <div>
                    <div key={notification.id} className="flex flex-row items-center p-6 gap-4 border-b-[1px] border-neutral-800">
                        <BsTwitter color="white" size={32} />
                        <p className="text-white">{notification.body}</p>
                        <AiOutlineClose size={20} color="white" onClick={() => deleteNotification(notification.id)} className="cursor-pointer ml-auto"/>
                    </div>
                </div>
                ))
            )}
        </div>
    )
}

export default NotificationsFeed;