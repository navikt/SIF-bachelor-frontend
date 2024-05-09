import React,{ createContext, useContext, useState, ReactNode } from 'react';
import { ErrorProviderProps } from "../../assets/types/props"
import { SetErrorProp } from '../../assets/types/misc';

type ErrorContextType = {
    errorMessage: SetErrorProp | null;
    setErrorMessage: (error: SetErrorProp | null) => void;
};

export const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: ErrorProviderProps) => {

    const [errorMessage, setErrorMessage] = useState<SetErrorProp | null>(null);

    return (
        <ErrorContext.Provider value={{ errorMessage, setErrorMessage }}>
            {children}
        </ErrorContext.Provider>
    );
};
