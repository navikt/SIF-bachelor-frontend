import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAPI } from "../http/SearchAPI";
import { SearchHandlerProps } from '../../assets/types/export';
import useNotification from './useNotification';
import {useKindeAuth} from '@kinde-oss/kinde-auth-react';


const useSearchHandler = ({ brukerId, brukerIdError, filterData}: SearchHandlerProps) => {

    const [ serverExceptionError, setExceptionError ] = useState('');
    const { setNotificationMessage } = useNotification()
    const navigate = useNavigate();
    const { isAuthenticated, getToken } = useKindeAuth()

    

    const handleSearch = async () => {
        if (brukerIdError || !brukerId) {
            setNotificationMessage({message: "Du må skrive inn et gyldig 3 til 11 sifret tall før du kan søke!", variant: "warning"});
            return;
        }


        if (!isAuthenticated) {
            setNotificationMessage({message: "Du må logge inn for å søke!", variant: "warning"});
            return;
        }

        try {
            const token = await getToken()
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
