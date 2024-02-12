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
            onSearchClick={handleSearch}
          />
          <FilterIcon
            className={`filter-icon ${isRotated ? 'rotated' : ''}`} 
            ref={FilterIconRef} 
            title="a11y-title" 
            fontSize="2.5rem" 
            onClick={toggleIconRotation} />
          <FilterPopover anchorEl={FilterIconRef} openState={openState} setOpenState={setOpenState}></FilterPopover>
        </div>
      </div>
      <img className='img' src={dokSearchIcon} alt="Bilde av et dokument som blir forstørret med en magnifying glass" />
    </div>
  );
};

export default LandingPage;