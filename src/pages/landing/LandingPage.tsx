import React, { useState } from 'react';
import './LandingPage.css';
import { Search, Button } from "@navikt/ds-react"; 

export const LandingPage = () => {
  const [userId, setUserId] = useState('');

  const handleSearch = () => {
    // Implement your search logic here
    console.log(userId);
  };

  // This function updates the userId state when the input changes
  const handleInputChange = (value: string) => {
    setUserId(value);
  };

  return (
    <div className="landing-container">
      <nav className="navbar">
        <h1>Vju</h1>
        <Button className="log-in-button">Logg inn</Button>
      </nav>
      <main>
        <h2>Søk etter bruker-ID</h2>
        <Search
          className="searchBar"
          label="Søk etter bruker-ID"
          variant="primary"
          placeholder="Skriv inn bruker-ID"
          value={userId}
          onChange={handleInputChange}
          onSearchClick={handleSearch} // Changed from onSearch to onSearchClick
        />
      </main>
      <footer>
        <p>Dokkis er et verktøy for henting og behandling av journalposter for Sykdom i familien</p>
      </footer>
    </div>
  );
};

export default LandingPage;
