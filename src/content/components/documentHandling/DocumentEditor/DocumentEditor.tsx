import {useRef, useState, useEffect } from "react"
import {Button, Modal, TextField, Alert } from "@navikt/ds-react"
import { PencilIcon } from "@navikt/aksel-icons";
import { IDocument, Journalpost, DocumentEditorProps } from "../../../../assets/types/export";
import { DocumentEditorInput } from "../../../../assets/types/export";
import {DocumentViewer} from "../DocumentViewer/DocumentViewer";
import { convertStatus, displayType, metadataTemplate } from "../../../../assets/utils/FormatUtils";
import "./DocumentEditor.css";
import { useValidation } from "../../../hooks/useValidation";

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

    const [tittBrev, setTittBrev] = useState("");

    const ref = useRef<HTMLDialogElement>(null);

    const topRef = useRef<HTMLDivElement>(null);

    // Input validation custom hook
    const { 
        validateBrukerId, validateBrukerType, validateAvsenderMottaker, validateTittel, validateTema,
        brukerIdError, brukerTypeError, avsenderMottakerIdError, avsenderMottakerNameError, 
        avsenderMottakerLandError, avsenderMottakerTypeError, tittelError, temaError 
    } = useValidation();

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

    const handleInputChange = <T extends keyof DocumentEditorInput>(
        field: T
      ) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setNewMetadata((prevMetadata) => ({
          ...prevMetadata,
          [field]: value,
        }));

        // Validate input
      switch (field) {
        case "tittel":
          validateTittel(value);
          break;
        case "tema":
          validateTema(value);
          break;
        default:
          break;
      }
    };

    const handleNestedInputChangeBruker =
    <T extends keyof DocumentEditorInput["bruker"]>(
      parentField: "bruker",
      field: T
    ) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setNewMetadata((prevMetadata) => ({
        ...prevMetadata,
        [parentField]: {
          ...prevMetadata[parentField],
          [field]: value,
        },
      }));

      // Validate Bruker fields
      switch (field) {
        case "id":
          validateBrukerId(value);
          break;
        case "type":
          validateBrukerType(value);
          break;
        default:
          break;
      }
    };

    const handleNestedInputChangeAM =
    <T extends keyof DocumentEditorInput["avsenderMottaker"]>(
      parentField: "avsenderMottaker",
      field: T
    ) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setNewMetadata((prevMetadata) => ({
        ...prevMetadata,
        [parentField]: {
          ...prevMetadata[parentField],
          [field]: value,
        },
      }));

      // Validate Avsender/Mottaker fields
      validateAvsenderMottaker(
        (field === "id" ? value : newMetadata.avsenderMottaker.id).toString(),
        (field === "navn" ? value : newMetadata.avsenderMottaker.navn).toString(),
        (field === "land" ? value : newMetadata.avsenderMottaker.land).toString(),
        (field === "type" ? value : newMetadata.avsenderMottaker.type).toString()
      );
    };

    const validateInputs = () => {
        // Validate all relevant fields
        validateBrukerId(newMetadata.bruker.id);
        validateBrukerType(newMetadata.bruker.type);
        // Got a weird error with the id so I had to toString() it
        validateAvsenderMottaker(
            newMetadata.avsenderMottaker.id.toString(),
            newMetadata.avsenderMottaker.navn,
            newMetadata.avsenderMottaker.land,
            newMetadata.avsenderMottaker.type
        );
        validateTittel(newMetadata.tittel);
        validateTema(newMetadata.tema);
    
        console.log("Bruker ID Error: " + brukerIdError);
        console.log("Bruker Type Error: " + brukerTypeError);
        console.log("Avsender/Mottaker ID Error: " + avsenderMottakerIdError);
        console.log("Avsender/Mottaker Name Error: " + avsenderMottakerNameError);
        console.log("Avsender/Mottaker Land Error: " + avsenderMottakerLandError);
        console.log("Avsender/Mottaker Type Error: " + avsenderMottakerTypeError);
        console.log("Tittel Error: " + tittelError);
        console.log("Tema Error: " + temaError);
        console.log("Brevkode Error: " + tittBrev);
        // Check if any validation errors exist
        return !(
            brukerIdError || brukerTypeError ||
            avsenderMottakerIdError || avsenderMottakerNameError ||
            avsenderMottakerLandError || avsenderMottakerTypeError ||
            tittelError || temaError || tittBrev
        );
    };
      
    const mottaTittBrev = (tittBrev: string) => {
        setTittBrev(tittBrev);
      };

    const splitDocs = async () => {
        const token = sessionStorage.getItem("token");

        if(!token) {
            setErrorMessage("Du må logge inn for å søke!");
            return;
        }

        // Opprett JSON body med userId
        const requestBody = {
            journalpostID : journalpostId,
            oldMetadata: oldMetadata,
            newMetadata: newMetadata,       
          };

        console.log(oldMetadata)
        console.log(newMetadata)

        if (!validateInputs()) {
            console.log("Inputs IKKE VALIDATED")
            setErrorMessage("Vennligst fyll ut alle feltene riktig før du splitter.");
            topRef.current?.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        console.log("Validation passed");

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
                <div ref={topRef} />
                    {errorMessage && <Alert variant="error">{errorMessage}</Alert>}
                    <div className="submit-body">
                        <TextField      
                            label="Journalpost ID"      
                            value={journalpostId}
                            className="inputBox"
                            readOnly
                        />
                        <h3>Bruker</h3>
                        <div className="input-group bordered">
                            <TextField 
                                label="Bruker-ID" 
                                value={newMetadata.bruker.id} 
                                onChange={handleNestedInputChangeBruker("bruker", "id")}
                                error={brukerIdError} />
                            <TextField 
                                label="ID-Type" 
                                value={newMetadata.bruker.type}  
                                onChange={handleNestedInputChangeBruker("bruker","type")}
                                error={brukerTypeError} />
                        </div>
                        <h3>Avsender / Mottaker</h3>
                            <div className="input-group bordered">
                                <TextField 
                                    label="ID" 
                                    value={newMetadata.avsenderMottaker.id}
                                    onChange={handleNestedInputChangeAM("avsenderMottaker", "id")}
                                    error={avsenderMottakerIdError} />
                                <TextField 
                                    label="ID-Type" 
                                    value={newMetadata.avsenderMottaker.type} 
                                    onChange={handleNestedInputChangeAM("avsenderMottaker", "type")}
                                    error={avsenderMottakerTypeError} />
                                <TextField 
                                    label="Navn" 
                                    value={newMetadata.avsenderMottaker.navn} 
                                    onChange={handleNestedInputChangeAM("avsenderMottaker", "navn")}
                                    error={avsenderMottakerNameError} />
                                <TextField 
                                    label="Land" 
                                    value={newMetadata.avsenderMottaker.land} 
                                    onChange={handleNestedInputChangeAM("avsenderMottaker", "land")}
                                    error={avsenderMottakerLandError} />
                            </div>         
                        <TextField      
                            label="Tittel"      
                            value={newMetadata.tittel}
                            onChange={handleInputChange("tittel")}
                            className="inputBox"
                            error={tittelError}
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
                        <TextField      
                            label="Status"      
                            value={journalstatus}
                            className="inputBox"
                            readOnly
                        />
                        <TextField      
                            label="Tema"      
                            value={newMetadata.tema}
                            onChange={handleInputChange("tema")}
                            className="inputBox"
                            error={temaError}
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
                            handleInputValidation={mottaTittBrev}
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