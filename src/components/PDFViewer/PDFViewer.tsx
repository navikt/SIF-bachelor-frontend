import { useState, useEffect } from "react";
import { pdfjs } from "react-pdf"
import "react-pdf/dist/esm/Page/TextLayer.css";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { IDocument } from "../types";
import { PDFDocument } from "pdf-lib";
import "./PDFViewer.css"

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
                    const pdfBytes = await fetch(url).then(response => {
                        if (!response.ok) {
                            throw new Error(`Failed to fetch document with ID ${document.dokumentInfoId}: ${response.statusText}`);
                        }
                        return response.arrayBuffer();
                    });
                    const pdf = await PDFDocument.load(pdfBytes);
                    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                    copiedPages.forEach((page) => {
                        mergedPdf.addPage(page);
                    });
                }
                const mergedPdfBytes = await mergedPdf.save();
                const mergedPdfUrl = URL.createObjectURL(new Blob([mergedPdfBytes], { type: "application/pdf" }));
                setMergedPdfUrl(mergedPdfUrl);
            } catch (error) {
                console.error("There was an error merging the PDFs", error);
                setExceptionError((error as Error).message || "An unexpected error occurred while merging documents.");
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
        return <h1>{ExceptionError}</h1>
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
