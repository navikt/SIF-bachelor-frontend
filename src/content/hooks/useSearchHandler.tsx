import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SearchHandlerProps } from '../../assets/types/export';
import useError from './useError';

const useSearchHandler = ({ brukerId, brukerIdError, filterData}: SearchHandlerProps) => {
    //const [errorMessage, setErrorMessage] = useState('');
    const [ serverExceptionError, setExceptionError ] = useState('');
    const { setErrorMessage } = useError()
    const navigate = useNavigate();

    const handleSearch = () => {
        if (brukerIdError || !brukerId) {
            setErrorMessage({message: "Du må skrive inn et gyldig 3 til 11 sifret tall før du kan søke!", variant: "warning"});
            return;
        }

        const token = sessionStorage.getItem("token");

        if (!token) {
            setErrorMessage({message: "Du må logge inn for å søke!", variant: "warning"});
            return;
        }

        const requestBody = {
            brukerId: {
              id: brukerId,
              type: "FNR"
            },
            fraDato: filterData.startDate,
            tilDato: filterData.endDate,
            journalposttyper: filterData.selectedType,
            journalstatuser: filterData.selectedStatus,
            tema: filterData.filter,
        };

        fetch("/hentJournalpostListe", {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then((body) => {
                    setErrorMessage(body.errorMessage)
                    throw { status: response.status, errorMessage: body.errorMessage };
                });
            }
            setErrorMessage(null)
            return response.json();
        })
        .then(data => {
            console.log("DATA SOM GÅR VIDERE:")
            console.log(data)
            data.filterOptions = filterData;
            data.userkey = brukerId;
            navigate("/SearchResults", { state: data });
        })
        .catch((error) => {
            navigate('/error', {
                state: {
                    errorCode: error.status || 'Unknown Error',
                    errorMessage: error.errorMessage || 'An unexpected error occurred. Please try again later.',
                },
            });
        });
    };

    return {
        handleSearch,
        serverExceptionError,
    };
};

export default useSearchHandler;
