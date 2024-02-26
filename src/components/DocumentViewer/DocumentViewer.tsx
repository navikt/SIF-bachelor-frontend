import { useEffect, useState } from "react";
import { FilePdfIcon } from '@navikt/aksel-icons';
import { IDocument } from "../types";
import "./DocumentViewer.css";

interface DocumentItemProps {
    document: IDocument;
    addDocument: (document: IDocument) => void;
    isSelected: boolean;
}

const DocumentItem = ({ document, addDocument, isSelected }: DocumentItemProps) => {

    const select = () => {
        addDocument(document);
    };

    return (
    <div
        key={document.dokumentInfoId}
        onClick={select}
        className={`document-preview ${isSelected ? "selected" : ""}`}
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
    addDocument: (document: IDocument) => void;
    documents: IDocument[];
}

export const DocumentViewer = ({ documentsToView, addDocument, documents }: DocumentViewerProps) => {
    const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])

    useEffect(()=>{
        const selecteIds = documents.map(document => document.dokumentInfoId)
        setSelectedDocuments(selecteIds)
    }, [documents])

    return (
    <div className="documents-wrapper">
        {documentsToView.map((document) => (
        <div className="document-data" key={document.dokumentInfoId}>
            <DocumentItem 
                document={document} 
                addDocument={addDocument} 
                isSelected={selectedDocuments.includes(document.dokumentInfoId)}
            />
            <p>{document.tittel}.pdf</p>
        </div>  
       
        ))} 
    </div>
    );
};

export default DocumentViewer;