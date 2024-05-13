import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAPI } from "../http/SearchAPI";
import { SearchHandlerProps } from '../../assets/types/export';
import useNotification from './useNotification';

const useSearchHandler = ({ brukerId, brukerIdError, filterData}: SearchHandlerProps) => {
    //const [errorMessage, setErrorMessage] = useState('');
    const [ serverExceptionError, setExceptionError ] = useState('');
    const { setNotificationMessage } = useNotification()
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (brukerIdError || !brukerId) {
            setNotificationMessage({message: "Du må skrive inn et gyldig 3 til 11 sifret tall før du kan søke!", variant: "warning"});
            return;
        }

        const token = sessionStorage.getItem("token");

        if (!token) {
            setNotificationMessage({message: "Du må logge inn for å søke!", variant: "warning"});
            return;
        }

        try {
            const data = await searchAPI(brukerId, filterData.startDate, filterData.endDate, filterData.selectedType, filterData.selectedStatus, filterData.filter, token);
            data.filterOptions = filterData;
            data.userkey = brukerId;
            setNotificationMessage(null);
            navigate("/SearchResults", { state: data });
          } catch (error: any) {
            setNotificationMessage(error.errorMessage);
            navigate("/error", {
              state: {
                errorCode: error.status || "Unknown Error",
                errorMessage: error.errorMessage || "An unexpected error occurred. Please try again later.",
              },
            });
          }
    };

    return {
        handleSearch,
        serverExceptionError,
    };
};

export default useSearchHandler;
