import { useContext, useCallback, useState } from "react";
import { useNotification } from "./export";
import { Journalpost, UseSplitDocsProps } from "../../assets/types/export";
import { convertStatus } from "../../assets/utils/FormatUtils";
import { splitDocumentsAPI } from "../http/SplitAPI";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

const useSplitDocs = ({journalpostId, oldMetadata, newMetadata, journalstatus, journalposttype, appendNewJournalpost, onStatusChange, selectedDocuments, unselectedDocuments, setLocalErr}: UseSplitDocsProps) => { 
    
    const { setNotificationMessage } = useNotification()
    const { isAuthenticated, getToken } = useKindeAuth()
    const splitDocs = useCallback(async () => {

        if (!isAuthenticated) {
            setNotificationMessage({message: "Du må logge inn for å splitte dokumenter!", variant: "warning"});
            return;
        }
        
        try {
            const token = await getToken()
            const newJournalpostIds = await splitDocumentsAPI(journalpostId, token, oldMetadata, newMetadata);

            const newJournalPost: Journalpost = {
                journalpostId: newJournalpostIds[1], 
                tittel: newMetadata.tittel, 
                journalposttype: newMetadata.journalposttype,
                datoOpprettet: (new Date()).toString(), 
                journalstatus: journalstatus, 
                tema: newMetadata.tema, 
                brukerid: newMetadata.bruker.id,
                avsenderMottaker: newMetadata.avsenderMottaker,
                relevanteDatoer: [],
                dokumenter: selectedDocuments.map(doc => ({
                    dokumentInfoId: doc.dokumentInfoId,
                    tittel: doc.tittel,
                    brevkode: doc.brevkode,
                    originalJournalpostId: journalpostId,
                    logiskeVedlegg: []
                }))
            };

            const oldJournalPost: Journalpost = {
                journalpostId: newJournalpostIds[0],
                tittel: oldMetadata.tittel, 
                journalposttype: oldMetadata.journalposttype, 
                datoOpprettet: (new Date()).toString(), 
                journalstatus: journalstatus, 
                tema: oldMetadata.tema, 
                brukerid: oldMetadata.bruker.id,
                avsenderMottaker: oldMetadata.avsenderMottaker,
                relevanteDatoer: [],
                dokumenter: unselectedDocuments.map(doc => ({
                    dokumentInfoId: doc.dokumentInfoId,
                    tittel: doc.tittel,
                    brevkode: doc.brevkode,
                    originalJournalpostId: journalpostId,
                    logiskeVedlegg: []
                }))
            }; 

            appendNewJournalpost(newJournalPost, oldJournalPost);
            onStatusChange(convertStatus(journalposttype), journalpostId);

        } catch (error) {
            setNotificationMessage({message: "Kunne ikke splitte dokumenter, prøv igjen senere.", variant: "error"})
        }
    }, [journalpostId, oldMetadata, newMetadata, journalposttype, appendNewJournalpost, onStatusChange, setNotificationMessage]);

    return {
        splitDocs
    };
};

export default useSplitDocs
