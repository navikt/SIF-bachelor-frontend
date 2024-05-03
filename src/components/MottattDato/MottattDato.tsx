import { Button, Modal, BodyLong } from "@navikt/ds-react";
import { useState } from "react";
import { TableIcon } from "@navikt/aksel-icons";

export const MottattDato = ({journalpostId} : {journalpostId: string}) => {

    // Error message
    const [errorMessage, setErrorMessage] = useState('');

    const [open, setOpen] = useState(false);

    const baseUrl = process.env.REACT_APP_BASE_URL

    const registrerMottattDato = () => {
        const token = sessionStorage.getItem("token");

        if(!token) {
            setErrorMessage("Du må logge inn for å søke!");
            return;
        }

        const currentDate = new Date();

        const requestBody = {
            journalpostId: journalpostId,
            mottattDato: currentDate
          };

        fetch(`${baseUrl}/oppdaterJournalpost`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                },
            body: JSON.stringify(requestBody),
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

    return(
    <>
        <Button
            onClick={() => { setOpen(true)}}
            iconPosition="right"
            icon={<TableIcon aria-hidden />}
            size="small"
        >
        Registrer Mottatt Dato
        </Button>

        <Modal
            open={open}
            onClose={() => setOpen(false)}
            header={{
            heading: "Er du sikker på at du vil sette mottatt dato på journalposten?",
            size: "small",
            closeButton: false,
            }}
            width="small"
        >
            <Modal.Body>
            <BodyLong>
                Ved å trykke "Ja, jeg er sikker" vil dagens dato registreres i systemet for denne journalposten.
            </BodyLong>
            </Modal.Body>
            <Modal.Footer>
            <Button type="button" variant="danger" onClick={() => {
                registrerMottattDato();
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

export default MottattDato;