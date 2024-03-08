import './LandingPage.css';
import dokSearchIcon from "../../images/dokSearchIcon.svg";
import { SearchEngine } from "../../components/searchEngine/SearchEngine"

export const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="content">
        <div className='content-headers'>
          <h1 className='vju-logo'>Vju</h1>
          <h2 className='subtitle'>Søk etter bruker-ID</h2>
        </div>
        <SearchEngine></SearchEngine>
      </div>
      <img className='img' src={dokSearchIcon} alt="Bilde av et dokument som blir forstørret med en magnifying glass" />
      <p>Vju er et verktøy for henting og behandling av journalposter for Sykdom i familien</p>
    </div>
  );
};

export default LandingPage;