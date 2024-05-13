import React from 'react';
import './App.css';
import '@navikt/ds-css';
import LandingPage from './routes/landing/LandingPage';
import SearchResults from './routes/search/SearchResults';
import ErrorDisplay from './routes/error/ErrorPage';
import {Navbar, Footer} from './content/components/navigation/export';
import { Route, Routes } from "react-router-dom";
import { ErrorProvider } from './content/state/export';
import { NotificationAlert } from './content/components/global/export';
import { KindeProvider } from "@kinde-oss/kinde-auth-react";

function App() {
  return (
    
    <div className="App">
      <KindeProvider 
        clientId="84cea90adf4948289954d52a02eae104"
        domain="https://bachelor.kinde.com"
        audience="https://bachelor.kinde.com/api"
        logoutUri={window.location.origin}
        redirectUri={window.location.origin}>
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
      </KindeProvider>
    </div>
    

  );
}

export default App;
