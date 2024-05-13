import React,{ createContext, useContext, useState, ReactNode } from 'react';
import { NotificationProviderProps } from "../../assets/types/props"
import { SetNotificationProp } from "../../assets/types/props";

type NotificationContextType = {
    notificationMessage: SetNotificationProp | null;
    setNotificationMessage: (content: SetNotificationProp | null) => void;
};

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: NotificationProviderProps) => {

    const [notificationMessage, setNotificationMessage] = useState<SetNotificationProp | null>(null);

    return (
        <NotificationContext.Provider value={{ notificationMessage, setNotificationMessage }}>
            {children}
        </NotificationContext.Provider>
    );
};
