import { useEffect, useState } from "react";
import { Table, TextField } from "@navikt/ds-react";
import { EyeSlashIcon, EyeIcon } from '@navikt/aksel-icons';
import { IDocument, DocumentViewerProps } from "../../../../assets/types/export";
import "./DocumentViewer.css";
import { useValidation } from "../../../hooks/useValidation";

export const DocumentViewer = ({ documentsToView, addGlobalDocument, documents, isModal, handleSelectedIdandTitle, handleUnselectedIdandTitle, handleIsVisible, handleInputValidation}: DocumentViewerProps) => {
    const [selectedDocuments, setSelectedDocuments] = useState<IDocument[]>([])
    const [stateDocuments, setStateDocuments] = useState<IDocument[]>([])
    const [unselectedDocuments, setUnselectedDocuments] = useState<IDocument[]>(
        documentsToView // Initialize with all documents as unselected
    );
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [localDocumentsToView, setLocalDocumentsToView] = useState<IDocument[]>(documentsToView)
   
    const { validateTittel, tittelError, brevkodeError, validateBrevkode } = useValidation();

    const addDocument = (documentToAdd: IDocument) => {
        // Find the document to add based on its ID
        if (documentToAdd) {
            setStateDocuments(prevStateDocuments => {
                // Check if the document already exists in the documents state
                const isDocumentExist = prevStateDocuments.some(document => document.dokumentInfoId === documentToAdd.dokumentInfoId);
    
                // If the document doesn't exist, add it to the documents state
                if (!isDocumentExist) {
                    return [...prevStateDocuments, documentToAdd];
                } else {
                    // If the document already exists, filter it out from the documents state
                    return prevStateDocuments.filter(document => document.dokumentInfoId !== documentToAdd.dokumentInfoId);
                }
            });
        }
        console.log(stateDocuments)
    };

    const select = (document: IDocument) => {
        
        if(isModal){
            addDocument(document)
            addDocumentIdandTitle(document)
            handleRowClick(document.dokumentInfoId)
        }
        console.log(selectedRows)
    };
    const handleRowClick = (id: string) => {
        setSelectedRows(prevSelectedRows => {
            if (prevSelectedRows.includes(id)) {
                // Row already selected, remove it
                return prevSelectedRows.filter(rowId => rowId !== id);
            } else {
                // Row not selected, add it
                return [...prevSelectedRows, id];
            }
        });
    }

    const addDocumentIdandTitle = (documentToToggle: IDocument) => {
        // Find the document to add based on its ID
        console.log("Documents before toggle:");
        console.log(documents);

        if (documentToToggle) {
            setSelectedDocuments(prevSelected => {
                const isDocumentSelected = prevSelected.some(doc => doc.dokumentInfoId === documentToToggle.dokumentInfoId);

                // Update the selected and unselected documents lists accordingly
                const newSelectedDocuments = isDocumentSelected
                    ? prevSelected.filter(doc => doc.dokumentInfoId !== documentToToggle.dokumentInfoId)
                    : [...prevSelected, documentToToggle];

                setUnselectedDocuments(prevUnselected => {
                    return isDocumentSelected
                        ? [...prevUnselected, documentToToggle]
                        : prevUnselected.filter(doc => doc.dokumentInfoId !== documentToToggle.dokumentInfoId);
                });

                return newSelectedDocuments;
            });
        }
    };

    useEffect(() => {
        if(tittelError === "" && brevkodeError === ""){
            handleInputValidation("");
        }
        else{
            handleInputValidation("Dokument-metainfo er ikke fylt ut riktig.");
        }
    },[tittelError, brevkodeError])

    useEffect(()=>{ 
        if(!isModal){
            setSelectedDocuments(documents)
        }
    }, [documents])

    useEffect(() => {
        handleSelectedIdandTitle(selectedDocuments);
        handleUnselectedIdandTitle(unselectedDocuments);
    }, [selectedDocuments, handleSelectedIdandTitle, unselectedDocuments, handleUnselectedIdandTitle]);


    const isRowClicked = (id: string) => selectedRows.includes(id)
    

    const handleBrevkodeInput = (documentId: string, newBrevkode: string) => {
        const updatedDocuments = localDocumentsToView.map(doc => {
            if (doc.dokumentInfoId === documentId) {
                return { ...doc, brevkode: newBrevkode };
            }
            return doc;
        });
        setLocalDocumentsToView(updatedDocuments); // Update local state
        const updateDocumentBrevkode = (docs: IDocument[]) =>
            docs.map(doc => {
                if (doc.dokumentInfoId === documentId) {
                    return { ...doc, brevkode: newBrevkode };
                }
                return doc;
        });
        setSelectedDocuments(prevDocs => updateDocumentBrevkode(prevDocs));
        setUnselectedDocuments(prevDocs => updateDocumentBrevkode(prevDocs));

        validateBrevkode(newBrevkode);

        console.log(localDocumentsToView)
        console.log(selectedDocuments)
        console.log(unselectedDocuments)
    }
    const handleTittelInput = (documentId: string, newTittel: string) => {
        const updatedDocuments = localDocumentsToView.map(doc => {
            if (doc.dokumentInfoId === documentId) {
                return { ...doc, tittel: newTittel };
            }
            return doc;
        });
        setLocalDocumentsToView(updatedDocuments); // Update local state

        const updateDocumentTittel = (docs: IDocument[]) =>
            docs.map(doc => {
                if (doc.dokumentInfoId === documentId) {
                    return { ...doc, tittel: newTittel };
                }
                return doc;
        });

        setSelectedDocuments(prevDocs => updateDocumentTittel(prevDocs));
        setUnselectedDocuments(prevDocs => updateDocumentTittel(prevDocs));

        validateTittel(newTittel);

        console.log(localDocumentsToView)
        console.log(selectedDocuments)
        console.log(unselectedDocuments)
    };


    return (
        <div className="documents-wrapper">
            <Table size="small" zebraStripes>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col">ID</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Title</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Brevkode</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {localDocumentsToView.map((document: IDocument, i) => (
                        
                        <Table.Row
                        key={i + document.dokumentInfoId}
                        onClick={() => select(document)}
                        selected={selectedRows.includes(document.dokumentInfoId)}
                        className={`${isModal ? "tableRow" : ""} ${isRowClicked(document.dokumentInfoId) ? "selectedRowOutline" : ""}`}
                        >   
                            <Table.DataCell>{document.dokumentInfoId}</Table.DataCell>
                            <Table.DataCell>{isModal ? (
                                <TextField
                                    label="Tittel."
                                    hideLabel
                                    defaultValue={document.tittel}
                                    size="small"
                                    htmlSize={14}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => handleTittelInput(document.dokumentInfoId, e.target.value)}
                                    error={tittelError}
                                />
                                ) : (
                                    document.tittel
                                )}
                            </Table.DataCell>
                            <Table.DataCell>{isModal ? (
                                <TextField
                                    label="Brevkode."
                                    hideLabel
                                    defaultValue={document.brevkode}
                                    size="small"
                                    htmlSize={14}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => handleBrevkodeInput(document.dokumentInfoId, e.target.value)}
                                    error={brevkodeError}
                                />
                                ) : (
                                    document.brevkode
                                )}
                            </Table.DataCell>
                            {!isModal && (
                                <Table.DataCell className="btn-holder">
                                    {handleIsVisible(document) ? (
                                        <EyeIcon className="toggle-doc-btn" title="Gjem dokument" fontSize="2rem" onClick={() => addGlobalDocument(document)}/>
                                    ) : (
                                        <EyeSlashIcon className="toggle-doc-btn" title="Vis dokument" fontSize="2rem" onClick={() => addGlobalDocument(document)}/>
                                    )}
                                    
                                </Table.DataCell>
                            )}
                            
                        </Table.Row>
                    ))}
                </Table.Body>
        </Table>
        
    </div>
    );
};

export default DocumentViewer;