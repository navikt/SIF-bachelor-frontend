import {Search, Alert } from "@navikt/ds-react";
import { useState, useRef, useEffect } from "react";
import { FilterIcon } from '@navikt/aksel-icons';
import FilterPopover from './filters/FilterPopover/FilterPopover';
import {useNavigate, useLocation } from "react-router-dom";
import { filteredData, ErrorResponse } from "../types";

import "./SearchEngine.css";
import "../../pages/landing/LandingPage.css"

export const SearchEngine = () => {

    const baseUrl = process.env.REACT_APP_BASE_URL

    const [brukerId, setBrukerId] = useState('');

    // Manage state for rotating the filterIcon when clicking on it, initially false, aka not rotated
    const [isRotated, setIsRotated] = useState(false);

    // Manage state for opening the dropdown menu, which is initially false, aka dropdown menu not triggered.
    const [openState, setOpenState] = useState(false);

    // For the input validation of the "brukerId"
    const [isValid, setIsValid] = useState(true);

      // Error message
    const [errorMessage, setErrorMessage] = useState('');
    const [serverExceptionError, setExceptionError] = useState('');
  
    const FilterIconRef = useRef(null);

    const navigate = useNavigate();

    const location = useLocation();

    // Check if the current path is /SearchResults for resizable searchbar 
    const isSearchResultsPage = location.pathname === "/SearchResults";

    useEffect(() => {
        setErrorMessage(''); // Reset the error message on component mount
      }, []); // The empty dependency array ensures this effect runs only once on mount

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
        const isValidInput = /^\d{3,11}$/.test(value);
        setIsValid(isValidInput);
        if (isValidInput) {
            setBrukerId(value);
            setErrorMessage('');
        } else if (value === '') {
            setErrorMessage('');
        } else {
            setErrorMessage('BrukerId må være et tresifret tall mellom 3 og 11');
        }
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
                throw new Error('Network response was not ok');
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
        .catch(response => {
            // Handle error response and er parse it to the ErrorResponse interface
                response.json().then((error: ErrorResponse) => {
                  console.error('Error fetching data:', error);
                  setExceptionError(error.errorMessage || 'An unexpected error occurred. Please try again later.');
                }).catch((jsonError: Error) => {
                  // Handle any errors that occur during the parsing of the error response
                  console.error('Error parsing error response:', jsonError);
                  setExceptionError('An unexpected error occurred. Please try again later.');
                });
              }); 
            };

    // Conditional rendering based on the error state
    if (serverExceptionError) {
    return <Alert variant="error" style={{ width:"750px" }}>{serverExceptionError}</Alert>;
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
            />
        </div>
        {errorMessage && brukerId && <div className={`alert-container ${isSearchResultsPage ?  'search-results-width' : ''}`}><Alert variant="warning">{errorMessage}</Alert></div>}
</div>
);

}

export default SearchEngine;