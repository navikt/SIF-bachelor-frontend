import React from 'react';
import { Arkiv } from './components/Arkiv';
import './App.css';
import '@navikt/ds-css'; // Import the design system styles

function App() {
  return (
    <div className="App">
      <h1>Arkiv</h1>
      <Arkiv />
    </div>
  );
}

export default App;
