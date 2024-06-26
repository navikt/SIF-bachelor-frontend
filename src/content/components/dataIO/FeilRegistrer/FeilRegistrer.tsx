import { Button, Modal, BodyLong } from "@navikt/ds-react";
import { useState } from "react";
import { TasklistStartIcon, XMarkOctagonIcon } from "@navikt/aksel-icons";
import { convertStatus } from "../../../../assets/utils/FormatUtils";
import { useNotification } from "../../../hooks/export"
import { feilRegistrerAPI } from "../../../http/FeilRegistrerAPI";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

export const FeilRegistrer = ({ journalposttype, journalpostId, onStatusChange, formatStatus}: {
        journalposttype: string,
        journalpostId: string,
        onStatusChange: (newStatus: string, journalpostId: string) => void,
        formatStatus: (status: string) => string
    }) => {

    const { setNotificationMessage } = useNotification()
    const [open, setOpen] = useState(false);
    const { getToken, isAuthenticated } = useKindeAuth()



    const registrerFeil = async () => {

        

        if(!isAuthenticated) {
            setNotificationMessage({message: "Du må logge inn for å feilregistrere", variant:"warning"});
            setOpen(false);
            return;
        }

        try {
            const token = await getToken()
            const success = await feilRegistrerAPI(journalpostId, journalposttype, token);
      
            if (success) {
              const newJournalStatus = convertStatus(journalposttype);
              onStatusChange(newJournalStatus, journalpostId);
              setNotificationMessage({ message: "Feilregistrert", variant: "success" });
            } else {
              setNotificationMessage({
                message: "Kunne ikke feilregistrere. Prøv igjen senere.",
                variant: "error",
              });
            }
          } catch (error: any) {
            setNotificationMessage({ message: error.message, variant: "error" });
          }

        setOpen(false);
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
                heading: `Er du sikker på at du vil sette status på journalposten til "${formatStatus(convertStatus(journalposttype))}"?`,
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
                    registrerFeil();
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