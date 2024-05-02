import {useRef, useState, useEffect } from "react"
import {Button, Modal, TextField, Select } from "@navikt/ds-react"
import { PencilIcon } from "@navikt/aksel-icons";
import { AvsenderMottaker, IDocument, Journalpost, Metadata } from "../types";
import {DocumentViewer} from "../DocumentViewer/DocumentViewer";

export const DocumentEditor = ({ brukerId, journalpostId, tittel, journalposttype, datoOpprettet, journalstatus, tema, avsenderMottaker, documentsToView, addGlobalDocument, documents, appendNewJournalpost, handleIsVisible, onStatusChange}: { 
    brukerId: string,
    journalpostId: string, 
    tittel: string, 
    journalposttype: string, 
    datoOpprettet: string, 
    journalstatus: string, 
    tema: string,
    avsenderMottaker: AvsenderMottaker,
    documentsToView: IDocument[],
    addGlobalDocument: (document: IDocument) => void,
    documents: IDocument[],
    setIsModalOpen: (isModalOpen: boolean) => void,
    appendNewJournalpost: (newJournalPost: any, oldJournalPost: any) => void,
    handleIsVisible: (document: IDocument) => boolean;
    onStatusChange: (newStatus: string, journalpostId: string) => void
}) => {
    
    const baseUrl = process.env.REACT_APP_BASE_URL

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
    const [oldMetadata, setOldMetadata] = useState<Metadata>({
        bruker: {
            id: brukerId,
            type: "FNR",
        },
        dokumenter: [
            {
                brevkode: "NAV 04-01.03",
                dokumentvarianter: [
                    {
                        filtype: "PDFA",
                        fysiskDokument: "Dokument",
                        variantformat: "ARKIV"
                    }
                ],
                tittel: "placeholder",
            }
        ],
        datoDokument: datoOpprettet,
        tittel: tittel,
        journalposttype: journalposttype,
        tema: tema,
        avsenderMottaker: avsenderMottaker
    });

    // For the updated metadata in the journalpost
    const [newMetadata, setNewMetadata] = useState<Metadata>({
        bruker: {
            id: brukerId,
            type: "FNR",
        },
        dokumenter: [{
            brevkode: "NAV 04-01.03",
            dokumentvarianter: [
                {
                    filtype: "PDFA",
                    fysiskDokument: "Dokument",
                    variantformat: "ARKIV"
                }
            ],
            tittel: "placeholder",
        }],
        datoDokument: datoOpprettet,
        tittel: tittel,
        journalposttype: journalposttype,
        tema: tema,
        avsenderMottaker: avsenderMottaker 
    });

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

        // As soon as selectedDocumentIds updates, update newMetadata
        // setNewMetadata({...newMetadata, dokumentVarianter: newDokumentvarianter})
        // As soon as unselectedDocumentIds updates, update oldMetadata
        // setOldMetadata({...oldMetadata, dokumentID: unselectedDocumentIds});
    }, [selectedDocuments, unselectedDocuments]);

    const displayType = (type: string) => {
        if (type === "U") {
            return "Utgående";
        } else if (type === "I") {
            return "Inngående";
        } else if (type === "N") {
            return "Notat";
        }
    }

        // Update handlers for each metadata field
    const handleTittelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewMetadata((prevMetadata) => ({
        ...prevMetadata,
        tittel: event.target.value,
        }));
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setNewMetadata((prevMetadata) => ({
        ...prevMetadata,
        status: event.target.value,
        }));
    };

    const handleTemaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewMetadata((prevMetadata) => ({
        ...prevMetadata,
        tema: event.target.value,
        }));
    };
    const convertStatus = (journaltype: string) => {
        if(journaltype === "I") {
            return "UTGÅR";
        } else {
            return "AVBRUTT";
        }
    }

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

        fetch(baseUrl + "/createJournalpost", {
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
            return response.json(); // Read the response body only once
        })  
        .then(data => {
            console.log(data); // Work with the data here
            const newJournalpostIds = data.map((journalpost: any) => journalpost.journalpostId);
            console.log(newJournalpostIds);
            

                // Create new journal post objects
                const newJournalPost: Journalpost = {
                    journalpostId: newJournalpostIds[1], // This is the new ID from the response
                    tittel: newMetadata.tittel, // Assuming you want to use the title from newMetadata
                    journalposttype: newMetadata.journalposttype, // Assuming you want to use the journal post type from newMetadata
                    datoOpprettet: (new Date()).toString(), // Assuming you want to set the creation date to now
                    journalstatus: journalstatus, // You would need to define how to get this value
                    tema: newMetadata.tema, // Assuming you want to use the theme from newMetadata
                    avsenderMottaker: newMetadata.avsenderMottaker,
                    dokumenter: selectedDocuments.map(doc => ({
                        dokumentInfoId: doc.dokumentInfoId,
                        tittel: doc.tittel,
                        brevkode: doc.brevkode,
                        originalJournalpostId: journalpostId,
                        logiskeVedlegg: []
                    }))
                };

            const oldJournalPost: Journalpost = {
                journalpostId: newJournalpostIds[0], // This is the new ID from the response
                tittel: oldMetadata.tittel, // Assuming you want to use the title from newMetadata
                journalposttype: oldMetadata.journalposttype, // Assuming you want to use the journal post type from newMetadata
                datoOpprettet: (new Date()).toString(), // Assuming you want to set the creation date to now
                journalstatus: journalstatus, // You would need to define how to get this value
                tema: oldMetadata.tema, // Assuming you want to use the theme from newMetadata
                avsenderMottaker: oldMetadata.avsenderMottaker,
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
    //    console.log(selectedDocumentIds)
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
                        <Select label="Status" onChange={handleStatusChange} readOnly>
                            <option value="JOURNALFOERT">Journalført</option>
                            <option value="FERDIGSTILT">Utgående</option>
                            <option value="NOTAT">Notat</option>
                        </Select>
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
                    <Button onClick={splitDocs}>Splitt ut dokumenter til ny journalpost</Button> {/* Her må vi setIsModalOpen(false) */}
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>{
                            /*
                            setIsModalOpen(!isModal)
                            
                            console.log("Nå er modal: " + isModal)*/
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