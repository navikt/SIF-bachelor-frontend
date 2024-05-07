import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SearchHandlerProps } from '../../assets/types/props';

const useSearchHandler = ({ brukerId, isValid, filterData }: SearchHandlerProps) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [serverExceptionError, setExceptionError] = useState('');
    const [errorCode, setErrorCode] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (!brukerId) {
            setErrorMessage("Du må fylle inn en gyldig bruker-ID før du kan søke!");
            return;
        }
        
        if (!isValid) {
            setErrorMessage('Du må skrive inn et gyldig 3 til 11 sifret tall før du kan søke!');
            return;
        }

        const token = sessionStorage.getItem("token");

        if (!token) {
            setErrorMessage("Du må logge inn for å søke!");
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
                    throw { status: response.status, errorMessage: body.errorMessage };
                });
            }
            return response.json();
        })
        .then(data => {
            console.log("DATA SOM GÅR VIDERE:")
            console.log(data)
            data.filterOptions = filterData
            navigate("/SearchResults", { state: data });
        })
        .catch(error => {
            if (error.status) {
                navigate('/error', { state: { errorCode: error.status, errorMessage: error.errorMessage || 'An unexpected error occurred.' } });
            } else {
                console.error('Error fetching data:', error);   
                navigate('/error', { state: { errorCode: 'Unknown Error', errorMessage: 'An unexpected error occurred. Please try again later.' } });
            }
        });
    };

    return {
        handleSearch,
        errorMessage,
        setErrorMessage,
        serverExceptionError,
        errorCode,
    };
};

export default useSearchHandler;
