import {useRef, useState, useEffect } from "react"
import {Button, Modal, TextField, Select } from "@navikt/ds-react"
import { PencilIcon } from "@navikt/aksel-icons";
import { IDocument, Journalpost } from "../types";
import {DocumentViewer} from "../DocumentViewer/DocumentViewer";

export const DocumentEditor = ({ brukerId, journalpostId, tittel, journalposttype, datoOpprettet, journalstatus, tema, documentsToView, addGlobalDocument, documents, setIsModalOpen, appendNewJournalpost}: { 
    brukerId: string,
    journalpostId: string, 
    tittel: string, 
    journalposttype: string, 
    datoOpprettet: string, 
    journalstatus: string, 
    tema: string,
    documentsToView: IDocument[],
    addGlobalDocument: (document: IDocument) => void,
    documents: IDocument[],
    setIsModalOpen: (isModalOpen: boolean) => void,
    appendNewJournalpost: (newJournalPost: any, oldJournalPost: any) => void
}) => {
    
    const baseUrl = process.env.REACT_APP_BASE_URL

    // State to keep track of selected document IDs
    const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);

    // State to keep track of selected document IDs
    const [unselectedDocumentIds, setUnselectedDocumentIds] = useState<string[]>([]);

    // Callback to be called from DocumentViewer when the selection changes
    const handleUnselectedDocumentsChange = (unselectedDocs: string[]) => {
        setUnselectedDocumentIds(unselectedDocs);
    };

    // Callback to be called from DocumentViewer when the selection changes
    const handleSelectedDocumentsChange = (selectedDocs: string[]) => {
        setSelectedDocumentIds(selectedDocs);
    };

    // oldMetadata which is originally in the journalpost
    const [oldMetadata, setOldMetadata] = useState<{
        bruker: {
            brukerId: string,
            idType: string,
        },
        dokumenter: {
            brevkode: string;
            dokumentvarianter: [{
                filtype: string;
                fysiskDokument: string;
                variantformat: string;
            }];
            tittel: string;
        }[],
        datoDokument: string,
        tittel: string,
        journalposttype: string,
        tema: string,
    }>({
        bruker: {
            brukerId: brukerId,
            idType: "FNR",
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
    });

    // For the updated metadata in the journalpost
    const [newMetadata, setNewMetadata] = useState<{
        bruker: {
            brukerId: string,
            idType: string,
        },
        dokumenter: {
            brevkode: string;
            dokumentvarianter: [{
                filtype: string;
                fysiskDokument: string;
                variantformat: string;
            }];
            tittel: string;
        }[],
        datoDokument: string,
        tittel: string,
        journalposttype: string,
        tema: string,
    }>({
        bruker: {
            brukerId: brukerId,
            idType: "FNR",
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
    });

    // Error message
    const [errorMessage, setErrorMessage] = useState('');

    const ref = useRef<HTMLDialogElement>(null);

    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        return `${day}.${month}.${year}`
    };

    useEffect(() => {
        // Map each selectedDocumentId to a new entry in dokumentvarianter
        setNewMetadata(prev => ({
            ...prev,
            dokumenter: selectedDocumentIds.map(id => ({
                brevkode: "placeholder",
                dokumentvarianter: [
                    {
                        filtype: "PDFA",
                        fysiskDokument: id,
                        variantformat: "ARKIV"
                    }
                ],
                tittel: "placeholder",
            }))
        }));

        setOldMetadata(prev => ({
            ...prev,
            dokumenter: unselectedDocumentIds.map(id => ({
                brevkode: "placeholder",
                dokumentvarianter: [
                    {
                        filtype: "PDFA",
                        fysiskDokument: id,
                        variantformat: "ARKIV"
                    }
                ],
                tittel: "placeholder",
            }))
        }));

        // As soon as selectedDocumentIds updates, update newMetadata
        // setNewMetadata({...newMetadata, dokumentVarianter: newDokumentvarianter})
        // As soon as unselectedDocumentIds updates, update oldMetadata
        // setOldMetadata({...oldMetadata, dokumentID: unselectedDocumentIds});
    }, [selectedDocumentIds, unselectedDocumentIds]);

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

    const splitDocs = async () => {
        console.log("Dokument ID-ene som er valgt er: " + selectedDocumentIds);
        console.log("Dokument-Idene som IKKE er valgt er: " + unselectedDocumentIds)
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
        /*    const newJournalPost: Journalpost = {
                journalpostId: newJournalpostIds[1], // This is the new ID from the response
                tittel: newMetadata.tittel, // Assuming you want to use the title from newMetadata
                journalposttype: newMetadata.journalposttype, // Assuming you want to use the journal post type from newMetadata
                datoOpprettet: formatDate(new Date()), // Assuming you want to set the creation date to now
                journalstatus: journalstatus, // You would need to define how to get this value
                tema: newMetadata.tema, // Assuming you want to use the theme from newMetadata
                avsenderMottakerNavn: "placeholder",
                dokumenter: newMetadata.dokumenter,
            };

            const oldJournalPost = {
                journalpostId: newJournalpostIds[0], // This is the new ID from the response
                tittel: oldMetadata.tittel, // Assuming you want to use the title from newMetadata
                journalposttype: oldMetadata.journalposttype, // Assuming you want to use the journal post type from newMetadata
                datoOpprettet: formatDate(new Date()), // Assuming you want to set the creation date to now
                journalstatus: journalstatus, // You would need to define how to get this value
                tema: oldMetadata.tema, // Assuming you want to use the theme from newMetadata
            }; 

            console.log(oldMetadata.bruker.brukerId + " " + newJournalpostIds[0] + " " +  oldMetadata.tittel + " " +  oldMetadata.journalposttype + " " + formatDate(new Date()) + " " + journalstatus + " " + oldMetadata.tema)
            console.log(newJournalPost)
            console.log(oldJournalPost)
            appendNewJournalpost(newJournalPost, oldJournalPost); */
            
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });

        console.log(requestBody)
        console.log(selectedDocumentIds)
        console.log("Modalen er nå lukket")
        ref.current?.close()
    }
    return(
        <div>
            <Button 
                onClick={() => {
                    /*
                    console.log("Modalen var: " + isModal)
                    setIsModalOpen(!isModal)
                    console.log("Nå er modal: " + isModal)
                    
                    */
                    ref.current?.showModal()
                    }
                }
                iconPosition="right" icon={<PencilIcon aria-hidden />} 
                style={{marginTop: "10px"}}>Splitt Docs
            </Button>

            <Modal ref={ref} header={{ heading: "Splitt Opp Dokumenter" }} width={600}>
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
                            handleSelectedId={handleSelectedDocumentsChange}
                            handleUnselectedId={handleUnselectedDocumentsChange}
                        />
                    </div>        
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={splitDocs}>Opprett Nytt JournalPost</Button> {/* Her må vi setIsModalOpen(false) */}
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