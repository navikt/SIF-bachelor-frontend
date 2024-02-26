import {Search } from "@navikt/ds-react";
import { useState, useEffect, useRef } from "react";
import { FilterIcon } from '@navikt/aksel-icons';
import FilterPopover from '../../search/FilterPopover/FilterPopover';
import {useNavigate } from "react-router-dom";

import "./NavSearchEngine.css";
import "../../../pages/landing/LandingPage.css"
const NavSearchEngine = () => {

    const [brukerId, setBrukerId] = useState('');

    // Manage state for rotating the filterIcon when clicking on it, initially false, aka not rotated
    const [isRotated, setIsRotated] = useState(false);

    // Manage state for opening the dropdown menu, which is initially false, aka dropdown menu not triggered.
    const [openState, setOpenState] = useState(false);
  
    const FilterIconRef = useRef(null);

    const navigate = useNavigate()

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
        // console.log(filterData);
      };

    const toggleIconRotation = () => {
        setOpenState(!openState);
        setIsRotated(!isRotated);
      };

    const handleSearch = () => {
        const token = sessionStorage.getItem("token");
        // Opprett JSON body med userId
        const requestBody = {
            dokumentoversiktBruker: brukerId
        };
        // Definer headers for POST request
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append(`Authorization`, `Bearer ${token}`)

            console.log("The button is being clicked!" + "the filters are: " + filterData)
            // Assuming /hentJournalposter endpoint expects a query parameter `brukerID`
            fetch("http://localhost:8080/hentJournalpostListe", {
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
            console.log(data);
            const updatedData = {
                ...data,
                filterOptions: filterData,
                userkey: brukerId
            };
            navigate("/SearchResults", {state: updatedData})
            // Oppdater tilstand her om nødvendig, f.eks. setJournalposts(data)
        });
    };

return(
    <div>
        <div className="search-container">
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
    </div>
);

}

export default NavSearchEngine;