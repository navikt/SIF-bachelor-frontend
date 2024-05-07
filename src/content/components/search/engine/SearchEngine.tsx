import {Search, Alert } from "@navikt/ds-react";
import { useState, useRef, useEffect } from "react";
import { FilterIcon } from '@navikt/aksel-icons';
import { FilterPopover } from "../export";
import {useNavigate, useLocation } from "react-router-dom";
import { FilterOptions } from "../../../../assets/types/export";
import useSearchHandler from "../../../hooks/useSearchHandler";

import "./SearchEngine.css";
import "../../../../routes/landing/LandingPage.css"

export const SearchEngine = () => {

    const [brukerId, setBrukerId] = useState('');
    // Manage state for rotating the filterIcon when clicking on it, initially false, aka not rotated
    const [isRotated, setIsRotated] = useState<boolean>(false);
    // Manage state for opening the dropdown menu, which is initially false, aka dropdown menu not triggered.
    const [openState, setOpenState] = useState<boolean>(false);
    // For the input validation of the "brukerId"
    const [isValid, setIsValid] = useState<boolean>(true);
    const [alertShown, setAlertShown] = useState(false);
    // Manage state for the filterData object that we receive in the dropdown to use in handleSearch
    const [filterData, setFilterData] = useState<FilterOptions>({
        startDate: undefined,
        endDate: undefined,
        filter: [],
        selectedStatus: [],
        selectedType: [],
    });
    const FilterIconRef = useRef(null);
    const location = useLocation();

    // Check if the current path is /SearchResults for resizable searchbar 
    const isSearchResultsPage = location.pathname === "/SearchResults" || location.pathname === "/error";

    const { handleSearch, errorMessage, setErrorMessage, serverExceptionError, errorCode } = useSearchHandler({ brukerId, isValid, filterData });


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

    // Denne søke funksjonen oppdaterer userId state når vi skriver og endrer på inputen!
    const handleInputChange = (value: string) => {
        setBrukerId(value); // Update state directly with input value
    };

    const handleSubmitFilter = (receivedFilterData: FilterOptions) => {
        setFilterData(receivedFilterData);
        // console.log(filterData);
      };

    const toggleIconRotation = () => {
        setOpenState(!openState);
        setIsRotated(!isRotated);
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