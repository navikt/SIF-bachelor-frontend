import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { IDocument } from "./types";
import { PDFDocument } from "pdf-lib";

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
                    console.error(`URL not found for document with ID ${document.dokumentInfoId}`);
                    break;
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

        if (documentUrls && documents) {
          mergePdfs();
        }
      }, [documents]);

    const onDocumentLoadSuccess = ({numPages}: {numPages: number}) => {
        setNumPages(numPages)
    }

    return (
        <div style={{backgroundColor: "red", width: "fit-content", padding: "1rem", maxHeight:"calc(100vh - 75px)", overflowY: "scroll"}}>
          {mergedPdfUrl ? (
            <Document
              file={mergedPdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              {Array.from({ length: numPages || 0 }, (_, index) => (
                <>
                    <Page key={index + 1} pageNumber={index + 1} />
                    <p>Page {index + 1} of {numPages}</p>
                </>
              ))}
            </Document>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        
      );
};

export default PDFViewer;