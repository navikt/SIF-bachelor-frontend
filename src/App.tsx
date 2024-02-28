import React from 'react';
import './App.css';
import '@navikt/ds-css';
import LandingPage from './pages/landing/LandingPage';
import SearchResults from './pages/searchResults/SearchResults';
import Footer from './components/common/footer/Footer';
import Navbar from './components/common/navbar/Navbar';
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/searchResults" element={<SearchResults />} />
      </Routes>
    </div>
  );
}

export default App;
