import { useState, useEffect } from "react";
import { pdfjs } from "react-pdf"
import "react-pdf/dist/esm/Page/TextLayer.css";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { IDocument } from "../types";
import { PDFDocument } from "pdf-lib";
import "./PDFViewer.css"
import { ErrorResponse } from "../types";
import { Alert } from "@navikt/ds-react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

export const PDFViewer = ({ documentUrls, documents }: { documentUrls: Map<string, string>; documents: IDocument[] }) => {

    const [numPages, setNumPages] = useState<number | null >(null);
    const [mergedPdfUrl, setMergedPdfUrl] = useState<string | undefined>(undefined);
    const [ExceptionError, setExceptionError] = useState("");

    useEffect(() => {

        const mergePdfs = async () => {
            try{
                const mergedPdf = await PDFDocument.create();
                for (const document of documents) {
                    const url = documentUrls.get(document.dokumentInfoId);
                    if (!url) {
                        setExceptionError("URL not found for document with ID: " + document.dokumentInfoId);
                        return;
                    }
                    const pdfBytes = await fetch(url).then(async response => {
                        if (!response.ok) {
                            const errorResponse = await response.json(); 
                            throw new Error(errorResponse.errorMessage || `Failed to fetch document with ID ${document.dokumentInfoId}: ${response.statusText}`);
                        }
                        return response.arrayBuffer();
                    });
                    const pdf = await PDFDocument.load(pdfBytes);
                    console.log(pdf);
                    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                    copiedPages.forEach((page) => {
                        mergedPdf.addPage(page);
                    });
                }
                const mergedPdfBytes = await mergedPdf.save();
            /*    const binaryString = mergedPdfBytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
                const base64String = btoa(binaryString);
                console.log(base64String); */ // This is the base64 string of the merged PDF 
                const mergedPdfUrl = URL.createObjectURL(new Blob([mergedPdfBytes], { type: "application/pdf" }));
                setMergedPdfUrl(mergedPdfUrl);
            } catch (error) {
                if (error instanceof Response) {
                    // The error is an HTTP response from the backend
                    const errorData: ErrorResponse = await error.json();
                    console.error("There was an error merging the PDFs", errorData.errorMessage);
                    setExceptionError(errorData.errorMessage || "An unexpected error occurred while merging documents.");
                } else {
                    // The error is a JavaScript error
                    console.error("There was an error merging the PDFs", error);
                    setExceptionError((error as ErrorResponse).errorMessage || "An unexpected error occurred while merging documents.");
                }
            }
        };

        if (documentUrls && documents.length > 0) {
            mergePdfs();
        }
    }, [documents]);

    const onDocumentLoadSuccess = ({numPages}: {numPages: number}) => {
        setNumPages(numPages)
    }
    
    if(ExceptionError){
        return <Alert variant="error">{ExceptionError}</Alert>
    }

    return (
        <div className="pdf-viewer-container">
            {(mergedPdfUrl && documents.length > 0) ? (
              <iframe src={`${mergedPdfUrl}#toolbar=0.5`} id="iframe" title="pdf-viewer" style={{width: "100%"}}></iframe>
              /*<Document
                    file={mergedPdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
              >
                    {documents.map((document, index) => (
                        <div key={document.dokumentInfoId} style={{width: "fit-content", height: "100%"}}>
                          <div className="pdf-title" id={document.dokumentInfoId}>
                            <p style={{ fontSize: 28, fontWeight: 'bold'}}>{document.tittel}</p>
                            <p style={{ fontSize: 12, color: 'gray', marginRight:"1rem"}}>#{document.dokumentInfoId}</p>
                          </div>
                            <Page pageNumber={index + 1} />
                            <p style={{ fontSize: 12 }} >Page {index + 1} of {numPages}</p>
                        </div>
                    ))}
                </Document>*/
            ) : (
              <p>
                    No documents chosen.
              </p>
            )}
        </div>
    );
};

export default PDFViewer;
