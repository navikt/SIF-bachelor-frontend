import React from 'react';
import { Arkiv } from './components/Arkiv';
import './App.css';
import '@navikt/ds-css';
import Greeting from './components/Greeting';
import Journalpost from './components/Journalpost';
import Get from './components/Get'
import LandingPage from './pages/landing/LandingPage';
import Footer from './components/common/footer/Footer';
import Navbar from './components/common/navbar/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <LandingPage></LandingPage>
      <Footer></Footer>
      {/*       
      <Greeting/>
      <Get/>
      <Journalpost/>               
      */}      
      
    </div>
  );
}

export default App;
