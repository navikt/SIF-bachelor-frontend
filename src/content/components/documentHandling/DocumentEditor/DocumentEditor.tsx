import {useRef, useState, useEffect } from "react"
import {Button, Modal, TextField, Table } from "@navikt/ds-react"
import { PencilIcon } from "@navikt/aksel-icons";
import { IDocument, Journalpost, DocumentEditorProps } from "../../../../assets/types/export";
import {DocumentViewer} from "../DocumentViewer/DocumentViewer";
import { convertStatus, displayType, metadataTemplate } from "../../../../assets/utils/FormatUtils";

export const DocumentEditor = ({ brukerId, journalpostId, tittel, journalposttype, datoOpprettet, journalstatus, tema, avsenderMottaker, documentsToView, addGlobalDocument, documents, appendNewJournalpost, handleIsVisible, onStatusChange}: DocumentEditorProps ) => {

    // State to keep track of selected document IDs
    const [selectedDocuments, setSelectedDocuments] = useState<IDocument[]>([]);

    // State to keep track of selected document IDs
    const [unselectedDocuments, setUnselectedDocuments] = useState<IDocument[]>([]);

    // Callback to be called from DocumentViewer when the selection changes
    const handleUnselectedDocumentsChange = (unselectedDocs: IDocument[]) => {
        setUnselectedDocuments(unselectedDocs);
    };

    // Callback to be called from DocumentViewer when the selection changes
    const handleSelectedDocumentsChange = (selectedDocs: IDocument[]) => {
        setSelectedDocuments(selectedDocs);
    };

    // oldMetadata which is originally in the journalpost
    const [oldMetadata, setOldMetadata] = useState(metadataTemplate(brukerId, tittel, journalposttype, datoOpprettet, tema, avsenderMottaker));

    // For the updated metadata in the journalpost
    const [newMetadata, setNewMetadata] = useState(metadataTemplate(brukerId, tittel, journalposttype, datoOpprettet, tema, avsenderMottaker));

    // Error message
    const [errorMessage, setErrorMessage] = useState('');

    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        // Map each selectedDocumentId to a new entry in dokumentvarianter
        setNewMetadata(prev => ({
            ...prev,
            dokumenter: selectedDocuments.map((document: IDocument) => ({
                brevkode: document.brevkode,
                dokumentvarianter: [
                    {
                        filtype: "PDFA",
                        fysiskDokument: document.dokumentInfoId,
                        variantformat: "ARKIV"
                    }
                ],
                tittel: document.tittel,
            }))
        }));

        setOldMetadata(prev => ({
            ...prev,
            dokumenter: unselectedDocuments.map((document: IDocument) => ({
                brevkode: "placeholder",
                dokumentvarianter: [
                    {
                        filtype: "PDFA",
                        fysiskDokument: document.dokumentInfoId,
                        variantformat: "ARKIV"
                    }
                ],
                tittel: document.tittel,
            }))
        }));

    }, [selectedDocuments, unselectedDocuments]);

    const handleTittelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewMetadata((prevMetadata) => ({
        ...prevMetadata,
        tittel: event.target.value,
        }));
    };

    const handleTemaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewMetadata((prevMetadata) => ({
        ...prevMetadata,
        tema: event.target.value,
        }));
    };

    const splitDocs = async () => {
        const token = sessionStorage.getItem("token");

        if(!token) {
            setErrorMessage("Du må logge inn for å søke!");
            return;
        }

        console.log(journalpostId);

        // Opprett JSON body med userId
        const requestBody = {
            journalpostID : journalpostId,
            oldMetadata: oldMetadata,
            newMetadata: newMetadata,       
          };

          console.log(oldMetadata)
          console.log(newMetadata)

        fetch("/createJournalpost", {
            method: 'POST',
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody), // Konverterer JavaScript objekt til en JSON string
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); 
        })  
        .then(data => {
            console.log(data); 
            const newJournalpostIds = data.map((journalpost: any) => journalpost.journalpostId);
            console.log(newJournalpostIds);
            
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

            const newJournalStatus = convertStatus(journalposttype);
            onStatusChange(newJournalStatus, journalpostId); 
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });

        console.log(requestBody)
        console.log("Modalen er nå lukket")
        ref.current?.close()
    }
    return(
        <div>
            <Button 
                onClick={() => {ref.current?.showModal()}}
                iconPosition="right" icon={<PencilIcon aria-hidden />} 
                >Splitt ut dokumenter
            </Button>

            <Modal ref={ref} header={{ heading: "Splitt Opp Dokumenter" }} width={"40%"}>
                <Modal.Body>
                    <div>
                        <TextField      
                            label="Journalpost ID"      
                            value={journalpostId}
                            className="inputBox"
                            readOnly
                        />
                        <TextField      
                            label="Tittel"      
                            value={newMetadata.tittel}
                            onChange={handleTittelChange}
                            className="inputBox"
                        />
                        <h3>Avsender / Mottaker </h3>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell scope="col">ID</Table.HeaderCell>
                                    <Table.HeaderCell scope="col">ID-Type</Table.HeaderCell>
                                    <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
                                    <Table.HeaderCell scope="col">Land</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row>
                                    <Table.DataCell>
                                        <TextField
                                        label="ID"
                                        hideLabel
                                        value={avsenderMottaker.id}
                                        />
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <TextField
                                        label="ID-Type"
                                        hideLabel
                                        value={avsenderMottaker.type}
                                        />
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <TextField
                                        label="Navn"
                                        hideLabel
                                        value={avsenderMottaker.navn}
                                        />
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <TextField
                                        label="Land"
                                        hideLabel
                                        value={avsenderMottaker.land}
                                        />
                                    </Table.DataCell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                        <TextField      
                            label="Type"      
                            value={displayType(newMetadata.journalposttype)}
                            className="inputBox"
                            readOnly
                        />
                        <TextField      
                            label="Dato"      
                            value={datoOpprettet}
                            className="inputBox"
                            readOnly
                        />
                        <TextField      
                            label="Status"      
                            value={journalstatus}
                            className="inputBox"
                            readOnly
                        />
                        <TextField      
                            label="Tema"      
                            value={newMetadata.tema}
                            onChange={handleTemaChange}
                            className="inputBox"
                        />
                        <h2>Velg dokumenter</h2>
                        <DocumentViewer 
                            documentsToView={documentsToView}
                            addGlobalDocument={addGlobalDocument}
                            documents={documents}
                            isModal={true}
                            handleSelectedIdandTitle={handleSelectedDocumentsChange}
                            handleUnselectedIdandTitle={handleUnselectedDocumentsChange}
                            handleIsVisible={handleIsVisible}
                        />
                    </div>        
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={splitDocs}>Splitt ut dokumenter til ny journalpost</Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>{
                            ref.current?.close()
                        }}
                        
                    >Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default DocumentEditor;