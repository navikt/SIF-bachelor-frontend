import { useState, useEffect } from 'react';
import { Alert, AlertProps } from '@navikt/ds-react';
import { useNotification } from '../../hooks/export';
import { XMarkIcon } from '@navikt/aksel-icons';
import "./ErrorAlert.css";

const NotificationAlert = () => {
    const { notificationMessage, setNotificationMessage } = useNotification();
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (notificationMessage?.message) {
            setShow(true)
            const timer = setTimeout(() => {
                setShow(false)
                setNotificationMessage(null)
            }, 3000)

            return () => clearTimeout(timer);
        }
    }, [notificationMessage]);

    useEffect(() => {
        if (!show && notificationMessage) {
            const timer = setTimeout(() => {

                setNotificationMessage(notificationMessage)
            }, 300)

            return () => clearTimeout(timer);
        }
    }, [show, notificationMessage, setNotificationMessage]);

    if (!notificationMessage?.message) return null;

    return (
        <Alert className={`error-box ${show ? 'show' : ''}`} variant={notificationMessage.variant} closeButton onClose={() => setShow(false)}>
            {notificationMessage.message}
        </Alert>
    );
};

export default NotificationAlert;