import { useState, useEffect } from 'react';
import { Alert, AlertProps } from '@navikt/ds-react';
import { useError } from '../../hooks/export';
import { XMarkIcon } from '@navikt/aksel-icons';
import "./ErrorAlert.css";

const ErrorAlert = () => {
    const { errorMessage, setErrorMessage } = useError();
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (errorMessage?.message) {
            setShow(true)
            const timer = setTimeout(() => {
                setShow(false)
            }, 3000)

            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    useEffect(() => {
        if (!show && errorMessage) {
            const timer = setTimeout(() => {

                setErrorMessage(errorMessage)
            }, 300)

            return () => clearTimeout(timer);
        }
    }, [show, errorMessage, setErrorMessage]);

    if (!errorMessage?.message) return null;

    return (
        <Alert className={`error-box ${show ? 'show' : ''}`} variant={errorMessage.variant} closeButton onClose={() => setShow(false)}>
            {errorMessage.message}
        </Alert>
    );
};

export default ErrorAlert;