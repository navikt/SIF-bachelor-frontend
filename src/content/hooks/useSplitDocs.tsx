import { useContext, useCallback, useState } from "react";
import { useError } from "./export";
import { Journalpost, UseSplitDocsProps } from "../../assets/types/export";
import { convertStatus } from "../../assets/utils/FormatUtils";
import { splitDocumentsAPI } from "../http/SplitAPI";

const useSplitDocs = ({journalpostId, oldMetadata, newMetadata, journalstatus, journalposttype, appendNewJournalpost, onStatusChange, selectedDocuments, unselectedDocuments, setLocalErr}: UseSplitDocsProps) => { 
    
    const { setErrorMessage } = useError()
    
    const splitDocs = useCallback(async () => {

        const token = sessionStorage.getItem("token");

        if (!token) {
            setErrorMessage({message: "Du må logge inn for å splitte dokumenter!", variant: "warning"});
            return;
        }

        const requestBody = {
            journalpostID: journalpostId,
            oldMetadata: oldMetadata,
            newMetadata: newMetadata,
        }
        
        try {
            const newJournalpostIds = await splitDocumentsAPI(journalpostId, token, oldMetadata, newMetadata);

            const newJournalPost: Journalpost = {
                journalpostId: newJournalpostIds[1], 
                tittel: newMetadata.tittel, 
                journalposttype: newMetadata.journalposttype,
                datoOpprettet: (new Date()).toString(), 
                journalstatus: journalstatus, 
                tema: newMetadata.tema, 
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
            setErrorMessage({message: "Internal server error", variant: "error"})
        }
    }, [journalpostId, oldMetadata, newMetadata, journalposttype, appendNewJournalpost, onStatusChange, setErrorMessage]);

    return {
        splitDocs
    };
};

export default useSplitDocs
