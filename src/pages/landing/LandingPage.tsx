import { useState, useRef } from 'react';
import './LandingPage.css';
import { Search } from "@navikt/ds-react"; 
import { useLocation, useNavigate } from "react-router-dom";
import dokSearchIcon from "../../images/dokSearchIcon.svg";
import { FilterIcon } from '@navikt/aksel-icons';
import FilterPopover from '../../components/search/FilterPopover/FilterPopover';

export const LandingPage = () => {
  const [brukerId, setBrukerId] = useState('');
  // const [journalposts, setJournalposts] = useState(null);

  // Manage state for opening the dropdown menu, which is initially false, aka dropdown menu not triggered.
  const [openState, setOpenState] = useState(false);
  // Manage state for rotating the filterIcon when clicking on it, initially false, aka not rotated
  const [isRotated, setIsRotated] = useState(false);

  const FilterIconRef = useRef(null);

  const navigate = useNavigate()

  /* Needed the type here because if not, we could get never[] arrays, which means that we wouldn't be able
     to add strings to these later which we don't want */
  type filteredData = {
    startDate?: Date,
    endDate?: Date,
    filter: string[],
    selectedStatus: string[],
    selectedType: string[],
  }

  // Manage state for the filterData object that we receive in the dropdown to use in handleSearch
  const [filterData, setFilterData] = useState<filteredData>({
    startDate: undefined,
    endDate: undefined,
    filter: [],
    selectedStatus: [],
    selectedType: [],
  });

  const handleSubmitFilter = (receivedFilterData: filteredData) => {
    setFilterData(receivedFilterData);
  };

  /* Managing state that we used to do locally in FilterPopoverContent.tsx,
     but we'll lift the state up to the LandingPage to use it to search */

  const checkProps = () => {
      console.log(filterData);
  }

  const handleSearch = () => {
    const token = sessionStorage.getItem("token");
    // Opprett JSON body med userId
    const requestBody = {
      brukerId: {
        id: brukerId,
        type: "FNR" 
      }
    };
    // Definer headers for POST request
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append(`Authorization`, `Bearer ${token}`)

      console.log("The button is being clicked!")
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
      data.filterOptions = filterData
      data.userkey = brukerId
      navigate("/SearchResults", {state: data})
      // Oppdater tilstand her om nødvendig, f.eks. setJournalposts(data)
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  };

  const toggleIconRotation = () => {
    setOpenState(!openState);
    setIsRotated(!isRotated);
  };

  // Denne søke funksjonen oppdaterer userId state når vi skriver og endrer på inputen!
  const handleInputChange = (value: string) => {
    setBrukerId(value);
  };

  return (
    <div className="landing-container">
      <div className="content">
        <h2>Søk etter bruker-ID</h2>
        <div className="search-container">
          <Search
            className="search-bar"
            label="Søk etter bruker-ID"
            variant="primary"
            placeholder="Skriv inn bruker-ID"
            value={brukerId}
            onChange={handleInputChange}
            onSearchClick={handleSearch}
          />
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
      <img className='img' src={dokSearchIcon} alt="Bilde av et dokument som blir forstørret med en magnifying glass" />
      <p>Vju er et verktøy for henting og behandling av journalposter for Sykdom i familien</p>
    </div>
  );
};

export default LandingPage;