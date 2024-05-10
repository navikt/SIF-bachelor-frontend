import { Button, Modal, BodyLong } from "@navikt/ds-react";
import { useState } from "react";
import { TableIcon } from "@navikt/aksel-icons";
import { useError } from "../../../hooks/export";
import { registrerMottattDatoAPI } from "../../../http/MottattDatoAPI";

export const MottattDato = ({journalpostId, handleMottattDato} : { journalpostId: string, handleMottattDato: (journalpostId: string) => void}) => {

    // Error message
    const { setErrorMessage} = useError()

    const [open, setOpen] = useState(false);

    const registrerMottattDato = async () => {
        const token = sessionStorage.getItem("token");

        if(!token) {
            setErrorMessage({message: "Du må logge inn for å registrere dato!", variant:"warning"});
            setOpen(false)
            return;
        }

        try {
            const success = await registrerMottattDatoAPI(journalpostId, token);
      
            if (success) {
              handleMottattDato(journalpostId);
              setErrorMessage({ message: "Satt dato mottatt.", variant: "success" });
            } else {
              setErrorMessage({
                message: "Kunne ikke oppdatere journalen. Prøv igjen senere.",
                variant: "error",
              });
            }
          } catch (error: any) {
            setErrorMessage({message: error.message,variant: "error",});
          }

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