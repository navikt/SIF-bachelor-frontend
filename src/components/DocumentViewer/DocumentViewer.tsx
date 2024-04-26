import { useEffect, useState } from "react";
import { Table } from "@navikt/ds-react";
import { FilePdfIcon, EyeSlashIcon, EyeIcon } from '@navikt/aksel-icons';
import { IDocument } from "../types";
import "./DocumentViewer.css";

interface DocumentViewerProps {
    documentsToView: IDocument[];
    addGlobalDocument: (document: IDocument) => void;
    documents: IDocument[];
    isModal: boolean;
    handleSelectedIdandTitle: (selectedDocs: IDocument[]) => void;
    handleUnselectedIdandTitle: (unselectedDocs: IDocument[]) => void;
    handleIsVisible: (document: IDocument) => boolean;
}

export const DocumentViewer = ({ documentsToView, addGlobalDocument, documents, isModal: isModal, handleSelectedIdandTitle, handleUnselectedIdandTitle, handleIsVisible }: DocumentViewerProps) => {
    const [selectedDocuments, setSelectedDocuments] = useState<IDocument[]>([])
    const [stateDocuments, setStateDocuments] = useState<IDocument[]>([])
    const [unselectedDocuments, setUnselectedDocuments] = useState<IDocument[]>(
        documentsToView // Initialize with all documents as unselected
    );
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
   
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

    useEffect(()=>{ 
        if(!isModal){
            setSelectedDocuments(documents)
        }
    }, [documents])

    useEffect(() => {
        handleSelectedIdandTitle(selectedDocuments);
        handleUnselectedIdandTitle(unselectedDocuments);
    }, [selectedDocuments, handleSelectedIdandTitle, unselectedDocuments, handleUnselectedIdandTitle]);

    const toggleSelectedRow = (value: string) =>
        setSelectedRows((list) =>
          list.includes(value)
            ? list.filter((id) => id !== value)
            : [...list, value],
    );
    
    const isRowClicked = (id: string) => selectedRows.includes(id)
    
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
                    {documentsToView.map((document: IDocument, i) => (
                        
                        <Table.Row
                        key={i + document.dokumentInfoId}
                        onClick={() => select(document)}
                        selected={selectedRows.includes(document.dokumentInfoId)}
                        className={`${isModal ? "tableRow" : ""} ${isRowClicked(document.dokumentInfoId) ? "selectedRowOutline" : ""}`}
                        >   
                            <Table.DataCell>{document.dokumentInfoId}</Table.DataCell>
                            <Table.DataCell>{document.tittel}</Table.DataCell>
                            <Table.DataCell>{document.brevkode}</Table.DataCell>
                            {!isModal && (
                                <Table.DataCell className="btn-holder">
                                    {handleIsVisible(document) ? (
                                        <EyeIcon className="toggle-doc-btn" title="Hide document" fontSize="2rem" onClick={() => addGlobalDocument(document)}/>
                                    ) : (
                                        <EyeSlashIcon className="toggle-doc-btn" title="Show document" fontSize="2rem" onClick={() => addGlobalDocument(document)}/>
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