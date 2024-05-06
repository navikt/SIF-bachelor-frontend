import {Search, Alert } from "@navikt/ds-react";
import { useState, useRef, useEffect } from "react";
import { FilterIcon } from '@navikt/aksel-icons';
import FilterPopover from './filters/FilterPopover/FilterPopover';
import {useNavigate, useLocation } from "react-router-dom";
import { filteredData, ErrorResponse } from "../types";

import "./SearchEngine.css";
import "../../../routes/landing/LandingPage.css"

export const SearchEngine = () => {

    const baseUrl = process.env.REACT_APP_BASE_URL

    const [brukerId, setBrukerId] = useState('');

    // Manage state for rotating the filterIcon when clicking on it, initially false, aka not rotated
    const [isRotated, setIsRotated] = useState(false);

    // Manage state for opening the dropdown menu, which is initially false, aka dropdown menu not triggered.
    const [openState, setOpenState] = useState(false);

    // For the input validation of the "brukerId"
    const [isValid, setIsValid] = useState(true);

    const [alertShown, setAlertShown] = useState(false);

      // Error message
    const [errorMessage, setErrorMessage] = useState('');
    const [serverExceptionError, setExceptionError] = useState('');
    const [errorCode, setErrorCode] = useState('');
  
    const FilterIconRef = useRef(null);

    const navigate = useNavigate();

    const location = useLocation();

    // Check if the current path is /SearchResults for resizable searchbar 
    const isSearchResultsPage = location.pathname === "/SearchResults" || location.pathname === "/error";

    useEffect(() => {
        setErrorMessage(''); // Reset the error message on component mount
      }, []); // The empty dependency array ensures this effect runs only once on mount

    useEffect(() => {
        console.log(alertShown)
        if(alertShown){
            setTimeout(() => {
                setAlertShown(false);
                console.log(alertShown)
            }, 3000);
        }
    }, [alertShown]);

    useEffect(() => {
        const isValidInput = /^\d{3,11}$/.test(brukerId);
        setIsValid(isValidInput);
        if (isValidInput) {
            setErrorMessage(''); // Clear error message if valid
        } else if (brukerId === '') {
            setErrorMessage(''); // Clear error message if input is empty
        } else {
            setErrorMessage('BrukerId må være et tresifret tall mellom 3 og 11'); // Set specific error message if invalid
        }
    }, [brukerId]); // Depend on brukerId to re-run validation
    

    // Manage state for the filterData object that we receive in the dropdown to use in handleSearch
    const [filterData, setFilterData] = useState<filteredData>({
        startDate: undefined,
        endDate: undefined,
        filter: [],
        selectedStatus: [],
        selectedType: [],
    });

    

    // Denne søke funksjonen oppdaterer userId state når vi skriver og endrer på inputen!
    const handleInputChange = (value: string) => {
        setBrukerId(value); // Update state directly with input value
    };

    const handleSubmitFilter = (receivedFilterData: filteredData) => {
        setFilterData(receivedFilterData);
        // console.log(filterData);
      };

    const toggleIconRotation = () => {
        setOpenState(!openState);
        setIsRotated(!isRotated);
      };

    const handleSearch = () => {

        if(!brukerId) {
            setErrorMessage("Du må fylle inn en gyldig bruker-ID før du kan søke!");
            return;
        }
        
        if (!isValid) {
            setErrorMessage('Du må skrive inn et gyldig 3 til 11 sifret tall før du kan søke!');
            return;
        }

        const token = sessionStorage.getItem("token");

        if(!token) {
            setErrorMessage("Du må logge inn for å søke!");
            return;
        }
        
        // Opprett JSON body med userId
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
        // Definer headers for POST request
            // Assuming /hentJournalposter endpoint expects a query parameter `brukerID`
            fetch(baseUrl + "/hentJournalpostListe", {
            method: 'POST',
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody), // Konverterer JavaScript objekt til en JSON string
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then((body) => {
                    throw { status: response.status, errorMessage: body.errorMessage };
                });
            }
            return response.json(); // Parse response as JSON
        })
        .then(data => {
            if(data.errorMessage){
                setExceptionError(data.errorMessage);
              }
            else{
                data.filterOptions = filterData
                data.userkey = brukerId
                data.uniqueActionId = Array.from({length: 16}, () => Math.floor(Math.random() * 16).toString(16)).join('')
                console.log(data)
                navigate("/SearchResults", {state: data})
                // Oppdater tilstand her om nødvendig, f.eks. setJournalposts(data)
            }
        })
        .catch(error => {
            // Check if the error has a status property
            if (error.status) {
                console.log("The error status is: " + error.status)
                navigate('/error', { state: { errorCode: error.status, errorMessage: error.errorMessage
                     || 'An unexpected error occurred.' } });
            } else {
                console.error('Error fetching data:', error);   
                navigate('/error', { state: { errorCode: 'Unknown Error', errorMessage: 'An unexpected error occurred. Please try again later.' } });
            }
        });
            };

    // Conditional rendering based on the error state
    if (serverExceptionError) {
        return (
            <div>
                {errorCode && <Alert variant="error" style={{ width:"750px" }}>Error Code: {errorCode}</Alert>}
                <Alert variant="error" style={{ width:"750px" }}>{serverExceptionError}</Alert>
            </div>
        );
    }

return(
    <div className="search-container">
        <div className={`search-input-container ${isSearchResultsPage ? 'search-results-width' : ''}`}>
            <Search 
                label="" 
                className="search-bar"
                placeholder="Skriv inn bruker-ID"
                onChange={handleInputChange}
                onSearchClick={handleSearch} />                
            <FilterIcon
                className={`filter-icon ${isRotated ? 'rotated' : ''}`} 
                ref={FilterIconRef} 
                title="Filtericon for filterdropdown" 
                fontSize="2.5rem" 
                onClick={toggleIconRotation} />
            <FilterPopover
                anchorEl={FilterIconRef}
                openState={openState}
                setOpenState={setOpenState}
                onFilterSubmit={handleSubmitFilter}
                onClose={toggleIconRotation}
                showSuccessAlert={setAlertShown}
            />
        </div>
        {errorMessage && brukerId && <div className={`alert-container ${isSearchResultsPage ?  'search-results-width' : ''}`}><Alert variant="warning">{errorMessage}</Alert></div>}
        {alertShown && <Alert className={`${isSearchResultsPage ?  'search-results-alert' : ''}`} variant="success">Filteret er lagret!</Alert>}

</div>
);

}

export default SearchEngine;