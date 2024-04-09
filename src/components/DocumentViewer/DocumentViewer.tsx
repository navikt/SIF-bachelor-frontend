import { useEffect, useState } from "react";
import { FilePdfIcon } from '@navikt/aksel-icons';
import { IDocument } from "../types";
import "./DocumentViewer.css";

interface DocumentItemProps {
    document: IDocument;
    addGlobalDocument: (document: IDocument) => void;
    isSelected: boolean;
    selectStateDocument: (documentToAdd: IDocument) => void
    isModal: boolean;
    isStateSelected: boolean;
    selectedId: (documentToAdd: string) => void
}

const DocumentItem = ({ document, addGlobalDocument, isSelected, selectStateDocument, isModal, isStateSelected, selectedId}: DocumentItemProps) => {

    const select = () => {
        const { dokumentInfoId } = document; // Destructure to extract dokumentInfoId
        console.log(dokumentInfoId); // Now you can use dokumentInfoId directl
        if(isModal){
            selectStateDocument(document)
            selectedId(dokumentInfoId)
            console.log(document)
        }else{
            addGlobalDocument(document);
        }
        
    };

    return (
    
    <div
        key={document.dokumentInfoId}
        onClick={select}
        className={`document-preview ${
            isModal ? (isStateSelected ? "selected" : "") : isSelected ? "selected" : ""
          }`}
    >
        <div className="document-id-wrapper">
            <FilePdfIcon title="Heyyy" fontSize="1.5rem"></FilePdfIcon>
            <p>#{document.dokumentInfoId}</p>
        </div>
       
    </div>
    );
};

interface DocumentViewerProps {
    documentsToView: IDocument[];
    addGlobalDocument: (document: IDocument) => void;
    documents: IDocument[];
    isModal: boolean;
    handleSelectedId: (selectedDocs: string[]) => void;
}

export const DocumentViewer = ({ documentsToView, addGlobalDocument, documents, isModal: isModal, handleSelectedId }: DocumentViewerProps) => {
    const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
    const [stateDocuments, setStateDocuments] = useState<IDocument[]>([])
    const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
   
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

    const addDocumentId = (documentIdToAdd: string) => {
        // Find the document to add based on its ID
        console.log("documents before:")
        console.log(documents)
        if (documentIdToAdd) {
            setSelectedDocumentIds(prevDocumentId => {
                // Check if the document already exists in the documents state
                const documentIdExists = prevDocumentId.includes(documentIdToAdd);

                // If the document doesn't exist, add it to the documents state
                if (!documentIdExists) {
                    return [...prevDocumentId, documentIdToAdd];
                } else {
                    // If the document already exists, filter it out from the documents state
                    return prevDocumentId.filter(documentId => documentId !== documentIdToAdd);
                }
            });
        }
        handleSelectedId(selectedDocumentIds);
    };

    useEffect(()=>{
        const selecteIds = documents.map(document => document.dokumentInfoId)
        if(!isModal){
            setSelectedDocuments(selecteIds)
        }
    }, [documents])

   /* useEffect(() => {
        handleSelectedDocumentIds(selectedDocumentIds)
    }, [selectedDocumentIds]) */

    return (
    <div className="documents-wrapper">
        {documentsToView.map((document) => (
        <div className="document-data" key={document.dokumentInfoId}>
            <DocumentItem 
                document={document} 
                addGlobalDocument={addGlobalDocument} 
                isSelected={selectedDocuments.includes(document.dokumentInfoId)}
                isStateSelected={stateDocuments.includes(document)}
                selectedId={addDocumentId}
                selectStateDocument={addDocument}
                isModal={isModal}
            />
            <p>{document.tittel}.pdf</p>
        </div>  
       
        ))} 
    </div>
    );
};

export default DocumentViewer;