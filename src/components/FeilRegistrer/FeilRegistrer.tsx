import { Button, Modal, BodyLong } from "@navikt/ds-react";
import { useState } from "react";
import { TasklistStartIcon, XMarkOctagonIcon } from "@navikt/aksel-icons";

export const FeilRegistrer = ({ journalposttype, journalpostId}: {
    journalposttype: string,
    journalpostId: string,
}) => {

    // Error message
    const [errorMessage, setErrorMessage] = useState('');

    const [open, setOpen] = useState(false);

    const baseUrl = process.env.REACT_APP_BASE_URL

    const registrerFeil = (journalpostId: string, journalposttype: string) => {

        const token = sessionStorage.getItem("token");

        if(!token) {
            setErrorMessage("Du må logge inn for å søke!");
            return;
        }

        fetch(`${baseUrl}/feilregistrer?journalpostId=${journalpostId}&type=${journalposttype}`, {
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
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        });
        setOpen(false);
    }

    const convertStatus = (journaltype: string) => {
        if(journaltype === "I") {
            return "Utgår";
        } else {
            return "Avbrutt";
        }
    }

    return(
        <>
            <Button
                onClick={() => { setOpen(true)}}
                iconPosition="right"
                icon={journalposttype === "I" ? <TasklistStartIcon aria-hidden /> : <XMarkOctagonIcon aria-hidden />}
            >
            {journalposttype === "I" ? "Sett Status Utgår" : "Sett Status Avbrutt"}
            </Button>

            <Modal
                open={open}
                onClose={() => setOpen(false)}
                header={{
                heading: `Er du sikker på at du vil sette status på journalposten til ${convertStatus(journalposttype)}?`,
                size: "small",
                closeButton: false,
                }}
                width="small"
            >
                <Modal.Body>
                <BodyLong>
                    Når er journalpost feilregistreres, kan den ikke registreres tilbake igjen.
                </BodyLong>
                </Modal.Body>
                <Modal.Footer>
                <Button type="button" variant="danger" onClick={() => {
                    registrerFeil(journalpostId, journalposttype);
                    }}>
                    Ja, jeg er sikker
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setOpen(false)}
                >
                    Avbryt
                </Button>
                </Modal.Footer>
            </Modal>
        </>       
    )
}

export default FeilRegistrer;