import { useState, useRef } from 'react';
import './LandingPage.css';
import { Search } from "@navikt/ds-react"; 
import dokSearchIcon from "../../images/dokSearchIcon.svg";
import { FilterIcon } from '@navikt/aksel-icons';
import FilterPopover from '../../components/search/FilterPopover/FilterPopover';

export const LandingPage = () => {
  const [brukerId, setBrukerId] = useState('');
  // const [journalposts, setJournalposts] = useState(null);
  const [openState, setOpenState] = useState(false);
  const [isRotated, setIsRotated] = useState(false);

  const FilterIconRef = useRef(null);

  /* Managing state that we used to do locally in FilterPopoverContent.tsx,
     but we'll lift the state up to the LandingPage to use it to search */
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filter, setFilter] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);

  const checkProps = () => {
    console.log("Form submitted");
    console.log("StartDate is: " + startDate + " and the endDate is: " + endDate);
    console.log("The chosen temaer are: " + filter);
    console.log("The chosen Status checkboxes are: " + selectedStatus);
    console.log("The chosen Type checkboxes are: " + selectedType);
  }

  const handleSearch = () => {
    // Opprett JSON body med userId
    const requestBody = {
      dokumentoversiktBruker: brukerId
    };

    // Definer headers for POST request
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

      console.log("The button is being clicked!")
      // Assuming /hentJournalposter endpoint expects a query parameter `brukerID`
      fetch("http://localhost:8080/hentJournalpostListe", {
      method: 'POST',
      headers: headers,
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
            onSearchClick={checkProps}
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
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            filter={filter}
            setFilter={setFilter}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedType={selectedType}
            setSelectedType={setSelectedType}/>
        </div>
      </div>
      <img className='img' src={dokSearchIcon} alt="Bilde av et dokument som blir forstørret med en magnifying glass" />
    </div>
  );
};

export default LandingPage;