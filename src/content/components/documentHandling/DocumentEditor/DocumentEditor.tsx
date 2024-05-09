import {useRef, useState, useEffect } from "react"
import {Button, Modal, TextField, Alert } from "@navikt/ds-react"
import { PencilIcon } from "@navikt/aksel-icons";
import { IDocument, Journalpost, DocumentEditorProps, Metadata } from "../../../../assets/types/export";
import { DocumentEditorInput } from "../../../../assets/types/export";
import {DocumentViewer} from "../DocumentViewer/DocumentViewer";
import { convertStatus, displayType, metadataTemplate, isReadOnly, Status } from "../../../../assets/utils/FormatUtils";
import "./DocumentEditor.css";
import { useError, useValidation, useSplitDocs } from "../../../hooks/export";

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
    const [oldMetadata, setOldMetadata] = useState<Metadata>(metadataTemplate(brukerId, tittel, journalposttype, datoOpprettet, tema, avsenderMottaker));

    // For the updated metadata in the journalpost
    const [newMetadata, setNewMetadata] = useState<Metadata>(metadataTemplate(brukerId, tittel, journalposttype, datoOpprettet, tema, avsenderMottaker));

    // Error message
    const { errorMessage, setErrorMessage } = useError()

    const [tittBrev, setTittBrev] = useState("");

    const ref = useRef<HTMLDialogElement>(null);

    const topRef = useRef<HTMLDivElement>(null);

    // Input validation custom hook
    const { 
        validateBrukerId, validateBrukerType, validateAvsenderMottaker, validateTittel, validateTema,
        brukerIdError, brukerTypeError, avsenderMottakerIdError, avsenderMottakerNameError, 
        avsenderMottakerLandError, avsenderMottakerTypeError, tittelError, temaError 
    } = useValidation();

    const { splitDocs } = useSplitDocs({
        journalpostId: journalpostId,
        oldMetadata: oldMetadata,
        newMetadata: newMetadata,
        journalstatus: journalstatus,
        journalposttype: journalposttype,
        appendNewJournalpost: appendNewJournalpost,
        onStatusChange: onStatusChange,
        selectedDocuments: selectedDocuments,
        unselectedDocuments: unselectedDocuments
    });

    const splitDocuments = () => {
        ref.current?.close()
        splitDocs()
    }
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
        setNewMetadata((prevMetadata: Metadata) => ({
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
                                readOnly={isReadOnly(journalstatus as Status, "bruker.id")}
                                error={brukerIdError} />
                            <TextField 
                                label="ID-Type" 
                                value={newMetadata.bruker.type}  
                                onChange={handleNestedInputChangeBruker("bruker","type")}
                                readOnly={isReadOnly(journalstatus as Status, "bruker.type")}
                                error={brukerTypeError} />
                        </div>
                        <h3>Avsender / Mottaker</h3>
                            <div className="input-group bordered">
                                <TextField 
                                    label="ID" 
                                    value={newMetadata.avsenderMottaker.id}
                                    onChange={handleNestedInputChangeAM("avsenderMottaker", "id")}
                                    readOnly={isReadOnly(journalstatus as Status, "avsenderMottaker.id")}
                                    error={avsenderMottakerIdError} />
                                <TextField 
                                    label="ID-Type" 
                                    value={newMetadata.avsenderMottaker.type} 
                                    onChange={handleNestedInputChangeAM("avsenderMottaker", "type")}
                                    readOnly={isReadOnly(journalstatus as Status, "avsenderMottaker.type")}
                                    error={avsenderMottakerTypeError} />
                                <TextField 
                                    label="Navn" 
                                    value={newMetadata.avsenderMottaker.navn} 
                                    onChange={handleNestedInputChangeAM("avsenderMottaker", "navn")}
                                    readOnly={isReadOnly(journalstatus as Status, "avsenderMottaker.navn")}
                                    error={avsenderMottakerNameError} />
                                <TextField 
                                    label="Land" 
                                    value={newMetadata.avsenderMottaker.land} 
                                    onChange={handleNestedInputChangeAM("avsenderMottaker", "land")}
                                    readOnly={isReadOnly(journalstatus as Status, "avsenderMottaker.land")}
                                    error={avsenderMottakerLandError} />
                            </div>         
                        <TextField      
                            label="Tittel"      
                            value={newMetadata.tittel}
                            onChange={handleInputChange("tittel")}
                            readOnly={isReadOnly(journalstatus as Status, "tittel")}
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
                            readOnly={isReadOnly(journalstatus as Status, "tema")}
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
                    <Button onClick={()=>splitDocuments()}>Splitt ut dokumenter til ny journalpost</Button>
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