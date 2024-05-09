import {Search, Alert } from "@navikt/ds-react";
import { useState, useRef, useEffect } from "react";
import { FilterIcon } from '@navikt/aksel-icons';
import { FilterPopover } from "../export";
import { useLocation } from "react-router-dom";
import { FilterOptions } from "../../../../assets/types/export";
import useSearchHandler from "../../../hooks/useSearchHandler";
import { useValidation } from "../../../hooks/useValidation";

import "./SearchEngine.css";
import "../../../../routes/landing/LandingPage.css"

export const SearchEngine = () => {

    const [brukerId, setBrukerId] = useState('');
    // Manage state for rotating the filterIcon when clicking on it, initially false, aka not rotated
    const [isRotated, setIsRotated] = useState<boolean>(false);
    // Manage state for opening the dropdown menu, which is initially false, aka dropdown menu not triggered.
    const [openState, setOpenState] = useState<boolean>(false);

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

    const { brukerIdError, validateBrukerId } = useValidation();

    const { handleSearch, errorMessage, setErrorMessage, serverExceptionError, errorCode } = useSearchHandler({ brukerId, brukerIdError, filterData });


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
        validateBrukerId(brukerId);
      }, [brukerId]);

    // Denne søke funksjonen oppdaterer userId state når vi skriver og endrer på inputen!
    const handleInputChange = (value: string) => {
        setBrukerId(value); // Update state directly with input value
    };

    const handleSubmitFilter = (receivedFilterData: FilterOptions) => {
        setFilterData(receivedFilterData);
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
        {brukerIdError && brukerId && <div className={`alert-container ${isSearchResultsPage ?  'search-results-width' : ''}`}><Alert variant="warning">{brukerIdError}</Alert></div>}
        {alertShown && <Alert className={`${isSearchResultsPage ?  'search-results-alert' : ''}`} variant="success">Filteret er lagret!</Alert>}

    </div>
);

}

export default SearchEngine;