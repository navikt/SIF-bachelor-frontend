import { Button } from "@navikt/ds-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation} from "react-router-dom";

import './Navbar.css';
import SearchEngine from "../searchEngine/SearchEngine";
const Navbar = () => {

  const navigate = useNavigate();
  const location = useLocation();

  // We have a useState hook to check if there is a token stored in sessionStorage and we set the isLoggedIn to true if found.
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('token') !== null);
  // Another boolean hook which sets itself to true if a token stored in sessionStorage is found and we set the button's content to "Logg ut" if true.
  const [buttonText, setButtonText] = useState(sessionStorage.getItem('token') ? "Logg ut" : "Logg inn");
  //For statussymbol - kan fjernes (Er her bare for å se at alt funker)
  const [statusColor, setStatusColor] = useState("gray");

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("The useEffect is triggered");
      if (!isTokenValid()) {
        // Handle token expiration
        console.error('Token expired');
       // toggleLogin(); // Comment out or remove this if we don't want to automatically log in again
      }
    }, 60000); // Check every minute
  
    // Need the cleanup function when the component unmounts or before it re-renders to prevent memory leak from older unused intervals
    return () => clearInterval(interval);
  }, []);

  const returnHome = () =>{
    navigate("/")
  }

  const isTokenValid = (): boolean => {
    const expirationTime = sessionStorage.getItem('token_expiration');
    return expirationTime !== null && new Date().getTime() < Number(expirationTime);
  };
  
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
        const response = await fetch("http://localhost:8282/default/token", {
          method: 'POST',
          headers: {
            // Means that the form data is encoded as URL encoded format, stndard convention
            'Content-Type': 'application/x-www-form-urlencoded',
            // Include other necessary headers here
          },
          /* This is the the encoded body where grant-type=client credentials is a typical OAuth terminology. client_credentials is a grant type
          typically used where client applications (in our case React frontend) authenticates by the CLIENT itself, instead of a user writing
          a username and password. In order to use the client_credentials grant type, we need to hardcode our client_id which is in our case just
          called dittCleintId as our unique identifier which the server will identify and authenticate. Client_secret represents the client secret
          which is a confidential value known only to the client and server.   */
          body: 'grant_type=client_credentials&client_id=dittClientId&client_secret=dinClientSecret',
        });
        // If the response status is 200 - 299, then we go into the if statement
        if (response.ok) {
          const data = await response.json();
          const expirationTime = new Date().getTime() + data.expires_in * 1000;
          console.log(data.access_token + "  " + expirationTime.toString());
          sessionStorage.setItem('token', data.access_token); // Store the token in sessionStorage
          sessionStorage.setItem('token_expiration', expirationTime.toString()); // Convert expirationTime to string
          setIsLoggedIn(true);
          setButtonText("Logg ut");
        } else {
          console.error('Error fetching token with status:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    } else {
      sessionStorage.removeItem('token'); // Remove the token from sessionStorage
      sessionStorage.removeItem('token_expiration');
      setIsLoggedIn(false);
      setButtonText("Logg inn");
    }
  };


  return (
    <nav className="navbar">
      
      <h1 className="logo" onClick={()=>{returnHome()}}>Vju</h1>
      <div className="status" style={{ backgroundColor: statusColor}}></div>
      <Button onClick={callProtectedEndpoint}>
        Call protected endpoint
      </Button>
      
      {location.pathname === "/SearchResults" && 
        (<div>
          <SearchEngine />
        </div>
        )
      }
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
