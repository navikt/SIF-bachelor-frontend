import { Button } from "@navikt/ds-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import './Navbar.css';
import { SearchEngine } from "../../search/export";

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

   // Function to toggle login/logout
  const toggleLogin = async () => {
    if (!isLoggedIn) { 
      try {
       
        const response = await fetch("/login");
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
      
      {(location.pathname === "/SearchResults" || location.pathname === "/error") && 
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
