import { Button, Search } from "@navikt/ds-react";
import { useState, useEffect, useRef } from "react";
import { FilterIcon } from '@navikt/aksel-icons';
import FilterPopover from '../../search/FilterPopover/FilterPopover';

import "./NavSearchEngine.css";
import "../../../pages/landing/LandingPage.css"
const NavSearchEngine = () => {

    const [brukerId, setBrukerId] = useState('');

    // Manage state for rotating the filterIcon when clicking on it, initially false, aka not rotated
    const [isRotated, setIsRotated] = useState(false);

    // Manage state for opening the dropdown menu, which is initially false, aka dropdown menu not triggered.
    const [openState, setOpenState] = useState(false);
  
    const FilterIconRef = useRef(null);

    // Manage state for the filterData object that we receive in the dropdown to use in handleSearch
    const [filterData, setFilterData] = useState<filteredData>({
        startDate: undefined,
        endDate: undefined,
        filter: [],
        selectedStatus: [],
        selectedType: [],
    });

    /* Needed the type here because if not, we could get never[] arrays, which means that we wouldn't be able
     to add strings to these later which we don't want */
    type filteredData = {
        startDate?: Date,
        endDate?: Date,
        filter: string[],
        selectedStatus: string[],
        selectedType: string[],
    }

    // Denne søke funksjonen oppdaterer userId state når vi skriver og endrer på inputen!
    const handleInputChange = (value: string) => {
        setBrukerId(value);
    };

    const handleSubmitFilter = (receivedFilterData: filteredData) => {
        setFilterData(receivedFilterData);
      };

    const toggleIconRotation = () => {
        setOpenState(!openState);
        setIsRotated(!isRotated);
      };

return(
    <div>
        <div className="search-container">
            <Search 
                label="" 
                className="search-bar"
                placeholder="Skriv inn bruker-ID"
                onChange={handleInputChange} />
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
    </div>
);

}

export default NavSearchEngine;