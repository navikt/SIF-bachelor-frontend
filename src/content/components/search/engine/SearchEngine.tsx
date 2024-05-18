import {Search, Alert } from "@navikt/ds-react";
import { useState, useRef, useEffect } from "react";
import { FilterIcon } from '@navikt/aksel-icons';
import { FilterPopover } from "../export";
import { useLocation } from "react-router-dom";
import { FilterOptions } from "../../../../assets/types/export";
import { useNotification, useSearchHandler, useValidation} from "../../../hooks/export";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

import "./SearchEngine.css";
import "../../../../routes/landing/LandingPage.css"

export const SearchEngine = () => {

    const { setNotificationMessage } = useNotification()
    const { isAuthenticated, getToken } = useKindeAuth()
    const [brukerId, setBrukerId] = useState('');
    // Manage state for rotating the filterIcon when clicking on it, initially false, aka not rotated
    const [isRotated, setIsRotated] = useState<boolean>(false);
    // Manage state for opening the dropdown menu, which is initially false, aka dropdown menu not triggered.
    const [openState, setOpenState] = useState<boolean>(false);

    //const [alertShown, setAlertShown] = useState(false);
    // Manage state for the filterData object that we receive in the dropdown to use in handleSearch
    const [filterData, setFilterData] = useState<FilterOptions>({
        startDate: undefined,
        endDate: undefined,
        filter: [],
        selectedStatus: [],
        selectedType: [],
    });
    const [userHasInteracted, setUserHasInteracted] = useState<boolean>(false);

    const FilterIconRef = useRef(null);
    const location = useLocation();

    // Check if the current path is /SearchResults for resizable searchbar 
    const isSearchResultsPage = location.pathname === "/SearchResults" || location.pathname === "/error";

    const { brukerIdError, validateBrukerId } = useValidation();

    const { handleSearch, serverExceptionError } = useSearchHandler({isAuthenticated, getToken});

    useEffect(() => {
        setNotificationMessage(null); // Reset the error message on component mount
        setUserHasInteracted(false)
      }, []); // The empty dependency array ensures this effect runs only once on mount

    useEffect(()=>{
        console.log("brukerid")
        console.log(brukerIdError)
        setNotificationMessage({message: brukerIdError, variant: "warning"})
    }, [brukerIdError])

    useEffect(() => {
        if (userHasInteracted) { // Only validate if the user has interacted with the input
            validateBrukerId(brukerId);
        }
    }, [brukerId, userHasInteracted, validateBrukerId]);


    // Denne søke funksjonen oppdaterer userId state når vi skriver og endrer på inputen!
    const handleInputChange = (value: string) => {
        setBrukerId(value);
        if (!userHasInteracted) setUserHasInteracted(true); // Set to true on first interaction
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
        setNotificationMessage({message: serverExceptionError, variant: "error"})
    }

return(
    <div className="search-container">
        <div className={`search-input-container ${isSearchResultsPage ? 'search-results-width' : ''}`}>
            <Search 
                label="" 
                className="search-bar"
                placeholder="Skriv inn bruker-ID"
                onChange={handleInputChange}
                onSearchClick={()=>handleSearch({brukerId, brukerIdError, filterData})} />            
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
                onSuccess={setNotificationMessage}
            />
        </div>
    </div>
);

}

export default SearchEngine;