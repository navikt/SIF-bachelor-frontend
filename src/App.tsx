import React from 'react';
import './App.css';
import '@navikt/ds-css';
import LandingPage from './routes/landing/LandingPage';
import SearchResults from './routes/search/SearchResults';
import ErrorDisplay from './routes/error/ErrorPage';
import {Navbar, Footer} from './content/components/navigation/export';
import { Route, Routes } from "react-router-dom";
import { ErrorProvider } from './content/state/export';
import NotificationAlert from './content/components/global/ErrorAlert';

function App() {
  return (
    
    <div className="App">
      <ErrorProvider>
      <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/searchResults" element={<SearchResults />} />
          <Route path="/error" element={<ErrorDisplay />} />
        </Routes>
      {/*<Footer />*/}
      <NotificationAlert />
      </ErrorProvider>
    </div>
    

  );
}

export default App;
