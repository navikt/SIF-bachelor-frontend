import { Button } from "@navikt/ds-react";
import { useState } from "react";

export const FeilRegistrer = ({ journalposttype, journalpostId}: {
    journalposttype: string,
    journalpostId: string,
}) => {

    // Error message
    const [errorMessage, setErrorMessage] = useState('');

    const baseUrl = process.env.REACT_APP_BASE_URL

    const registrerFeil = (journalpostId: string, journalposttype: string) => {

        const token = sessionStorage.getItem("token");

        if(!token) {
            setErrorMessage("Du må logge inn for å søke!");
            return;
        }

        fetch(`${baseUrl}/feilRegistrer/${journalpostId}/${journalposttype}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Read the response body only once
        })
        .then(data => {
            console.log(data);
        })
    }

    return(
        <Button
            onClick={() => registrerFeil(journalpostId, journalposttype)}
        >
        {journalposttype === "I" ? "Sett Status Utgår" : "Sett Status Avbrutt"}
        </Button>
    )
}

export default FeilRegistrer;