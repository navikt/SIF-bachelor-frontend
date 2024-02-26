import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf"
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

    useEffect(() => {
        const mergePdfs = async () => {
            const mergedPdf = await PDFDocument.create();
            for (const document of documents) {
                const url = documentUrls.get(document.dokumentInfoId);
                if (!url) {
                    return <p>URL not found for document with ID ${document.dokumentInfoId}</p>;
                }
                const pdfBytes = await fetch(url).then(response => response.arrayBuffer());
                const pdf = await PDFDocument.load(pdfBytes);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => {
                    mergedPdf.addPage(page);
                });
            }
            const mergedPdfBytes = await mergedPdf.save();
            const mergedPdfUrl = URL.createObjectURL(new Blob([mergedPdfBytes], { type: "application/pdf" }));
            setMergedPdfUrl(mergedPdfUrl);
        };

        if (documentUrls && documents.length > 0) {
            mergePdfs();
        }
    }, [documents]);

    const onDocumentLoadSuccess = ({numPages}: {numPages: number}) => {
        setNumPages(numPages)
    }
    
    return (
        <div className="pdf-viewer-container">
            {(mergedPdfUrl && documents.length > 0) ? (
              /*<iframe src={mergedPdfUrl} title="pdf-viewer" style={{width: "100%"}}></iframe>*/ 
              <Document
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
                </Document>
            ) : (
              <p>
                    No documents chosen.
              </p>
            )}
        </div>
    );
};

export default PDFViewer;
