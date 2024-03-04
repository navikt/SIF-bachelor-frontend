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

  const [token, setToken] = useState(sessionStorage.getItem("token"))

  // Error message
  const [errorMessage, setErrorMessage] = useState('');

  // For the input validation of the "brukerId"
  const [isValid, setIsValid] = useState(true);

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

    if(!brukerId) {
      setErrorMessage("Du må fylle inn en gyldig bruker-ID før du kan søke!");
      return;
  }

    if (!isValid) {
      setErrorMessage('Du må skrive inn et gyldig 3 til 11 sifret tall før du kan søke!');
      return;
  }

    // Opprett JSON body med userId
    const requestBody = {
      brukerId: {
        id: brukerId,
        type: "FNR" 
      },
      fraDato: filterData.startDate,
      tilDato: filterData.endDate,
      journalposttyper: filterData.selectedType,
      journalstatuser: filterData.selectedStatus,
      tema: filterData.filter
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
      data.filterOptions = filterData
      data.userkey = brukerId
      data.uniqueActionId = Array.from({length: 16}, () => Math.floor(Math.random() * 16).toString(16)).join('')
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
    const isValidInput = /^\d{3,11}$/.test(value);
    setIsValid(isValidInput);
    if (isValidInput) {
        setBrukerId(value);
        setErrorMessage('');
    } else {
        setErrorMessage('brukerId må være et 3 sifret tall mellom 3 og 11');
    }
  };

  return (
    <div className="landing-container">
      <div className="content">
        <div className='content-headers'>
          <h1 className='vju-logo'>Vju</h1>
          <h2 className='subtitle'>Søk etter bruker-ID</h2>
        </div>
        <div className="search-container">
          <Search
            className="search-bar"
            label="Søk etter bruker-ID"
            variant="primary"
            placeholder="Skriv inn bruker-ID"
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
      {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
      <img className='img' src={dokSearchIcon} alt="Bilde av et dokument som blir forstørret med en magnifying glass" />
      <p>Vju er et verktøy for henting og behandling av journalposter for Sykdom i familien</p>
    </div>
  );
};

export default LandingPage;