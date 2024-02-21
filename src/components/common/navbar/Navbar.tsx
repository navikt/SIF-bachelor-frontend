import { Button } from "@navikt/ds-react";
import React, { useState, useEffect } from "react";

import './Navbar.css';
const Navbar = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('token') !== null);
  const [buttonText, setButtonText] = useState(sessionStorage.getItem('token') ? "Logg ut" : "Logg inn");
  //For statussymbol - kan fjernes (Er her bare for å se at alt funker)
  const [statusColor, setStatusColor] = useState("gray");


  const callProtectedEndpoint = async () => {
    const token = sessionStorage.getItem("token");

    try{
      const response = await fetch('http://localhost:8080/test/protected', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //Oppdatering av statussymbol 
      if (response.ok) {
        setStatusColor("green");
        //dersom vi ikke er authorized vil statussymbolet være oransj.
      } else if (response.status === 401) {
        setStatusColor("orange");
      } else {
        // Handle other statuses if needed
        setStatusColor("gray");
      }
    }catch(err){
      console.error('Error calling the protected endpoint:', err);
      setStatusColor("red");
    }
  }

   // Function to toggle login/logout
  const toggleLogin = async () => {
    if (!isLoggedIn) {
      try {
        const response = await fetch("http://localhost:34553/default/token", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            // Include other necessary headers here
          },
          // Update with your actual client_id and client_secret values if necessary
          body: 'grant_type=client_credentials&client_id=dittClientId&client_secret=dinClientSecret',
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data.access_token);
          sessionStorage.setItem('token', data.access_token); // Store the token in sessionStorage
          setIsLoggedIn(true);
          setButtonText("Logg ut");
        } else {
          // Log the error based on response status
          console.error('Error fetching token with status:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    } else {
      sessionStorage.removeItem('token'); // Remove the token from sessionStorage
      setIsLoggedIn(false);
      setButtonText("Logg inn");
    }
  };


  return (
    <nav className="navbar">
      <h1>Vju</h1>
      <div className="status" style={{ backgroundColor: statusColor}}></div>
      <Button onClick={callProtectedEndpoint}>
        Call protected endpoint
      </Button>
      <Button
        className={`log-in-button ${isLoggedIn ? 'logged-in' : ''}`}
        onClick={toggleLogin}
      >
        {buttonText}
      </Button>
    </nav>
  );
};

export default Navbar;
