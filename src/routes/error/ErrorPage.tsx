import { useLocation } from "react-router-dom";
import "./ErrorPage.css";
import errorPageImg from "../../assets/errorPageImg.jpg";

const ErrorDisplay = () => {
    const location = useLocation();
    const { errorCode, errorMessage } = location.state || { errorCode: '', errorMessage: 'An error occurred' };
  
    return (
        <div className="error-display-container">
            <div className="error-code">
                {errorCode}
            </div>
            <h1 className="header">Beklager, det oppsto en feil.</h1>
            <p className="error-message">{errorMessage}</p>
            <img className="pic" src={errorPageImg} alt="Bilde av et dokument som ikke blir funnet" />
        </div>
    );
  };
  
  export default ErrorDisplay;