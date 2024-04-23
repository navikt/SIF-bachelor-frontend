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
    selectedIdandTitle: (documentIdtoAdd: string, tittel: string) => void
}

const DocumentItem = ({ document, addGlobalDocument, isSelected, selectStateDocument, isModal, isStateSelected, selectedIdandTitle}: DocumentItemProps) => {

    const select = () => {
        const { dokumentInfoId, tittel } = document; // Destructure to extract dokumentInfoId
        console.log(dokumentInfoId + " " + tittel); // Now you can use dokumentInfoId directl
        if(isModal){
            selectStateDocument(document)
            selectedIdandTitle(dokumentInfoId, tittel)
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
    handleSelectedIdandTitle: (selectedDocs: {id: string, title: string}[]) => void;
    handleUnselectedIdandTitle: (unselectedDocs: {id: string, title: string}[]) => void;
}

export const DocumentViewer = ({ documentsToView, addGlobalDocument, documents, isModal: isModal, handleSelectedIdandTitle, handleUnselectedIdandTitle }: DocumentViewerProps) => {
    const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
    const [stateDocuments, setStateDocuments] = useState<IDocument[]>([])
    const [selectedDocumentIdTitlePairs, setSelectedDocumentIdTitlePairs] = useState<{id: string, title: string}[]>([]);
    const [unselectedDocumentIdTitlePairs, setUnselectedDocumentIdTitlePairs] = useState<{id: string, title: string}[]>(
        documentsToView.map(document => ({ id: document.dokumentInfoId, title: document.tittel }))
    ); // Initialize with all IDs as unselected
   
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

    const addDocumentIdandTitle = (documentIdToAdd: string, title: string) => {
        // Find the document to add based on its ID
        console.log("documents before:")
        console.log(documents)

        if (documentIdToAdd && title) {
            setSelectedDocumentIdTitlePairs(prevDocument => {
                // Check if the document already exists in the documents state
                const documentExists = prevDocument.some(doc => doc.id === documentIdToAdd && doc.title === title);

                // If the document doesn't exist, add it to the documents state
                const newDocuments = documentExists
                ? prevDocument.filter((doc) => doc.id !== documentIdToAdd)
                : [...prevDocument, { id: documentIdToAdd, title }];

                // Update unselected IDs as well
                setUnselectedDocumentIdTitlePairs(prevUnselectedIds => {
                    return documentExists
                        ? [...prevUnselectedIds, { id: documentIdToAdd, title }]
                        : prevUnselectedIds.filter((doc) => doc.id !== documentIdToAdd);
                });

                return newDocuments;
            });
        }
    };

    useEffect(()=>{
        const selecteIds = documents.map(document => document.dokumentInfoId)
        if(!isModal){
            setSelectedDocuments(selecteIds)
        }
    }, [documents])

    useEffect(() => {
        handleSelectedIdandTitle(selectedDocumentIdTitlePairs);
        handleUnselectedIdandTitle(unselectedDocumentIdTitlePairs);
    }, [selectedDocumentIdTitlePairs, handleSelectedIdandTitle, unselectedDocumentIdTitlePairs, handleUnselectedIdandTitle]);

    return (
    <div className="documents-wrapper">
        {documentsToView.map((document) => (
        <div className="document-data" key={document.dokumentInfoId}>
            <DocumentItem 
                document={document} 
                addGlobalDocument={addGlobalDocument} 
                isSelected={selectedDocuments.includes(document.dokumentInfoId)}
                isStateSelected={stateDocuments.includes(document)}
                selectedIdandTitle={addDocumentIdandTitle}
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