import { useState } from 'react';
import './LandingPage.css';
import { Search } from "@navikt/ds-react"; 
import dokSearchIcon from "../../images/dokSearchIcon.svg";
import { FilterIcon } from '@navikt/aksel-icons';

export const LandingPage = () => {
  const [userId, setUserId] = useState('');
  const [journalposts, setJournalposts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = () => {
    setIsLoading(true);
    setError(null);
    // Assuming /hentJournalposter endpoint expects a query parameter `brukerID`
    fetch(`/hentJournalposter?brukerID=${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setJournalposts(data); // Assuming the data structure matches your needs
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.toString());
        setIsLoading(false);
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
        <form className="search-container">
          <Search
            className="search-bar"
            label="Søk etter bruker-ID"
            variant="primary"
            placeholder="Skriv inn bruker-ID"
            value={userId}
            onChange={handleInputChange}
            onSearchClick={handleSearch} // Changed from onSearch to onSearchClick because of the Aksel documentation
          />
          <FilterIcon title="a11y-title" fontSize="2.5rem" />
        </form>
      </div>
      <img className='img' src={dokSearchIcon} alt="Bilde av et dokument som blir forstørret med en magnifying glass" />
    </div>
  );
};

export default LandingPage;
