import React from 'react';
import { Arkiv } from './components/Arkiv';
import './App.css';
import '@navikt/ds-css'; // Import the design system styles
import Greeting from './components/Greeting';
import Journalpost from './components/Journalpost';
import Get from './components/Get'
import LandingPage from './pages/landing/LandingPage';

function App() {
  return (
    <div className="App">
      <LandingPage></LandingPage>

      {/*       
      <Greeting/>
      <Get/>
      <Journalpost/>               
      */}      
      
    </div>
  );
}

export default App;
