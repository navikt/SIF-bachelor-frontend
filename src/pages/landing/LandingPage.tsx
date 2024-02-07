import { useState } from 'react';
import './LandingPage.css';
import { Search, Button } from "@navikt/ds-react"; 
import dokSearchIcon from "../../images/dokSearchIcon.svg";
import { FilterIcon } from '@navikt/aksel-icons';

export const LandingPage = () => {
  const [userId, setUserId] = useState('');

  const handleSearch = () => {
    // Søke logikken skal inn i denne funksjonen her!
    console.log(userId);
  };

  // Denne søke funksjonen oppdaterer userId state når vi skriver og endrer på inputen!
  const handleInputChange = (value: string) => {
    setUserId(value);
  };

  return (
    <div className="landing-container">
      <nav className="navbar">
        <h1>Vju</h1>
        <Button className="log-in-button">Logg inn</Button>
      </nav>
      <div className="content">
        <h2>Søk etter bruker-ID</h2>
        <div className="search-container">
          <Search
            className="search-bar"
            label="Søk etter bruker-ID"
            variant="primary"
            placeholder="Skriv inn bruker-ID"
            value={userId}
            onChange={handleInputChange}
            onSearchClick={handleSearch} // Changed from onSearch to onSearchClick
          />
          <FilterIcon title="a11y-title" fontSize="2.5rem" />
        </div>
      </div>
      <img className='img' src={dokSearchIcon} alt="Bilde av et dokument som blir forstørret med en magnifying glass" />
      <footer>
        <p>Vju er et verktøy for henting og behandling av journalposter for Sykdom i familien</p>
      </footer>
    </div>
  );
};

export default LandingPage;
