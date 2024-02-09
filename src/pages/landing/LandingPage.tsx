import { useState } from 'react';
import './LandingPage.css';
import { Search } from "@navikt/ds-react"; 
import dokSearchIcon from "../../images/dokSearchIcon.svg";
import { FilterIcon } from '@navikt/aksel-icons';

export const LandingPage = () => {
  const [userId, setUserId] = useState('');
  const [journalposts, setJournalposts] = useState(null);

  const handleSearch = () => {
    console.log("The button is being clicked!")
    // Assuming /hentJournalposter endpoint expects a query parameter `brukerID`
    fetch("http://localhost:8080/simple_hentJournalPoster")
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text(); // Parse response as text
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };


  // Denne søke funksjonen oppdaterer userId state når vi skriver og endrer på inputen!
  const handleInputChange = (value: string) => {
    setUserId(value);
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
            value={userId}
            onChange={handleInputChange}
            onSearchClick={handleSearch}
          />
          <FilterIcon title="a11y-title" fontSize="2.5rem" />
        </div>
      </div>
      <img className='img' src={dokSearchIcon} alt="Bilde av et dokument som blir forstørret med en magnifying glass" />
    </div>
  );
};

export default LandingPage;