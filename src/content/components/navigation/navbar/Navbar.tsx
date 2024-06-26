import { Button } from "@navikt/ds-react";
import { useNavigate, useLocation} from "react-router-dom";
import './Navbar.css';
import { SearchEngine } from "../../search/export";
import { useNotification }from "../../../hooks/export";
import {useKindeAuth} from '@kinde-oss/kinde-auth-react';



const Navbar = () => {
  const { login, logout, isAuthenticated, user } = useKindeAuth()
  const { setNotificationMessage } = useNotification()
  const navigate = useNavigate();
  const location = useLocation();
  // We have a useState hook to check if there is a token stored in sessionStorage and we set the isLoggedIn to true if found.
  // Another boolean hook which sets itself to true if a token stored in sessionStorage is found and we set the button's content to "Logg ut" if true.
  const returnHome = () =>{
    navigate("/")
  }
  const toggleLogin = async () => {
    await login()
    setNotificationMessage({message: "Logget inn!", variant:"info"})
  }
  const toggleLogout = async () => {
    await logout()
    setNotificationMessage({message: "Logget ut!", variant:"info"})
  }
  return (
    <nav className="navbar">
      <h1 className="logo" onClick={()=>{returnHome()}}>Vju</h1>
      {(location.pathname === "/SearchResults" || location.pathname === "/error") &&
        (<div>
          <SearchEngine />
        </div>
        )
      }
      {(!isAuthenticated) ? (
        <Button className={`log-in-button`} onClick={toggleLogin}>Logg inn</Button>
      ) : (
        <div className="user-display">
          <p>Hei, {user?.given_name + " " + user?.family_name}</p>
          <Button className={`log-in-button logged-in`} onClick={toggleLogout}>Logg ut</Button>
        </div>
      )}
    </nav>
  );
};
export default Navbar;