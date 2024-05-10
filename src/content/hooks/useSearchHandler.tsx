import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAPI } from "../http/SearchAPI";
import { SearchHandlerProps } from '../../assets/types/export';
import useError from './useError';

const useSearchHandler = ({ brukerId, brukerIdError, filterData}: SearchHandlerProps) => {
    //const [errorMessage, setErrorMessage] = useState('');
    const [ serverExceptionError, setExceptionError ] = useState('');
    const { setErrorMessage } = useError()
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (brukerIdError || !brukerId) {
            setErrorMessage({message: "Du må skrive inn et gyldig 3 til 11 sifret tall før du kan søke!", variant: "warning"});
            return;
        }

        const token = sessionStorage.getItem("token");

        if (!token) {
            setErrorMessage({message: "Du må logge inn for å søke!", variant: "warning"});
            return;
        }

        try {
            const data = await searchAPI(brukerId, filterData.startDate, filterData.endDate, filterData.selectedType, filterData.selectedStatus, filterData.filter, token);
            data.filterOptions = filterData;
            data.userkey = brukerId;
            setErrorMessage(null);
            navigate("/SearchResults", { state: data });
          } catch (error: any) {
            setErrorMessage(error.errorMessage);
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
