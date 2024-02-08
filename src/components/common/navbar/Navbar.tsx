import { Button } from "@navikt/ds-react";
import './Navbar.css';
const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Vju</h1>
      <Button className="log-in-button">Logg inn</Button>
    </nav>
  );
};

export default Navbar;
