import { Button, Modal, BodyLong } from "@navikt/ds-react";
import { useState } from "react";
import { TableIcon } from "@navikt/aksel-icons";
import { useError } from "../../../hooks/export";

export const MottattDato = ({journalpostId, handleMottattDato} : { journalpostId: string, handleMottattDato: (journalpostId: string) => void}) => {

    // Error message
    const {errorMessage, setErrorMessage} = useError()

    const [open, setOpen] = useState(false);

    const registrerMottattDato = () => {
        const token = sessionStorage.getItem("token");

        if(!token) {
            setErrorMessage({message: "Du må logge inn for å registrere dato!", variant:"warning"});
            setOpen(false)
            return;
        }

        const currentDate = new Date();

        const requestBody = {
            journalpostId: journalpostId,
            mottattDato: currentDate
          };

        fetch(`/oppdaterJournalpost`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                },
            body: JSON.stringify(requestBody),
        })
        .then(response => {
            if (!response.ok) {
                setErrorMessage({message:"Kunne ikke oppdatere journalen. Prøv igjen senere.", variant: "error"})
            }
            return response.json(); // Read the response body only once
        })
        .then(data => {
            console.log(data);
            if(data === true){
                handleMottattDato(journalpostId);
            }
        })
        .catch((error) => {
            setErrorMessage({message:"Kunne ikke oppdatere journalen. Prøv igjen senere.", variant: "error"})
        });
        setErrorMessage({message: "Satt dato mottatt.", variant: "success"})
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