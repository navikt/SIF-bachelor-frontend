import React from 'react';
import { Arkiv } from './components/Arkiv';
import './App.css';
import '@navikt/ds-css'; // Import the design system styles
import Greeting from './components/Greeting';
import Journalpost from './components/Journalpost';
import Get from './components/Get'


function App() {
  return (
    <div className="App">
      <h1>Arkiv</h1>
      <Greeting/>

      <Get/>

      <Journalpost/>

      
    </div>
  );
}

export default App;
