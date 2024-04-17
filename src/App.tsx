import React from 'react';
import './App.css';
import '@navikt/ds-css';
import LandingPage from './pages/landing/LandingPage';
import SearchResults from './pages/searchResults/SearchResults';
import ErrorDisplay from './pages/error/ErrorPage';
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/searchResults" element={<SearchResults />} />
        <Route path="/error" element={<ErrorDisplay />} />
      </Routes>
    </div>
  );
}

export default App;
