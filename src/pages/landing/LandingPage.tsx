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
      <div className="content">
        <h2>Søk etter bruker-ID</h2>
        <form className="search-container">
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
        </form>
      </div>
      <img className='img' src={dokSearchIcon} alt="Bilde av et dokument som blir forstørret med en magnifying glass" />
    </div>
  );
};

export default LandingPage;
