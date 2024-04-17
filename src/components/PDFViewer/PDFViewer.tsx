import { useState, useEffect, useRef } from "react";
import { pdfjs } from "react-pdf"
import "react-pdf/dist/esm/Page/TextLayer.css";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { IDocument } from "../types";
import { PDFDocument } from "pdf-lib";
import "./PDFViewer.css"
import { ErrorResponse } from "../types";
import { Alert } from "@navikt/ds-react";
import { Page, Document, Outline } from 'react-pdf';
import Toolbar from "../Pdf-Reader/Toolbar";


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

export const PDFViewer = ({ documentUrls, documents }: { documentUrls: Map<string, string>; documents: IDocument[] }) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [numPages, setNumPages] = useState<number | null >(null);
    const [mergedPdfUrl, setMergedPdfUrl] = useState<string | undefined>(undefined);
    const [ExceptionError, setExceptionError] = useState("");
    const [rotation, setRotation] = useState(0);
    const [scale, setScale] = useState(1.217); // Start with no zoom
    const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

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
                    // Takes the raw binary data from pdfBytes and stores it into the PDFDocument object
                    const pdf = await PDFDocument.load(pdfBytes);
                    // copiedPages will be an array object of the pages in the PDF with page 1 and page 2 being [0, 1]
                    // and each object has a LOT of low level info about each page
                    // So TLDR, copyPages maps each page to its own object in an array where each object has the page number and lots of low level metadata
                    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                    console.log(copiedPages)
                    /* This will add all of the page objects of a document to mergedPdf, so that in the pdf reader on the
                       right, it will display ALL the PDFs in a single journalpost one after the other. */
                    copiedPages.forEach((page) => {
                        mergedPdf.addPage(page);
                    });
                }
                /* After we have collected ALL of the PDFs and stored them together in the mergedPDF object, we can then
                convert it back to the arrayBuffer with the .save() method and then  */
                const mergedPdfBytes = await mergedPdf.save();
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

    // Initialize pageRefs array
    useEffect(() => {
        pageRefs.current = pageRefs.current.slice(0, numPages || 0);
    }, [numPages]);

    useEffect(() => {
        const container = document.querySelector('.pdf-viewer-container');
        if(container){
            container.addEventListener('scroll', handleScroll);
            console.log("container is: " + container)

            return () => {
                container.removeEventListener('scroll', handleScroll);
            };
        }
    }, [currentPage]);

    const handleScroll = () => {
        const scrollY = window.pageYOffset;
        let visiblePage: HTMLDivElement | null = null;
        let visiblePageIndex = currentPage;

        console.log(visiblePageIndex)
        
        for (let i = 0; i < pageRefs.current.length; i++) {
            const ref = pageRefs.current[i];
            console.log(ref);
            if (ref) {
                const pageTop = ref.offsetTop;
                const pageBottom = pageTop + ref.clientHeight;
                if (scrollY >= pageTop && scrollY < pageBottom) {
                    visiblePage = ref;
                    visiblePageIndex = i + 1;
                    console.log("visiblePageIndex is: " + visiblePageIndex)
                    break;
                }
            }
        }
        if (currentPage !== visiblePageIndex) {
            setCurrentPage(visiblePageIndex);
        }
    };
    

    const onDocumentLoadSuccess = ({numPages}: {numPages: number}) => {
        setNumPages(numPages)
        console.log(numPages)
    }

    const handleRotate = (direction: string) => {
        setRotation(prevRotation => (direction === 'clockwise' ? prevRotation + 90 : prevRotation - 90) % 360);
    };

    const handleZoomIn = () => {
        setScale(scale => scale + 0.25); // Increase zoom by 10%
    };

    const handleZoomOut = () => {
        setScale(scale => scale - 0.25); // Decrease zoom by 10%
    };

    
    if(ExceptionError){
        return <Alert variant="error">{ExceptionError}</Alert>
    }

    return (
        <div className="pdf-viewer-container">
            
            {(mergedPdfUrl && documents.length > 0) ? (          
                    
                <div className="pdf-content">
                    <Toolbar 
                        onRotate={handleRotate}
                        onZoomIn={handleZoomIn}
                        onZoomOut={handleZoomOut}
                        currentPage={currentPage || 0}
                        numPages={numPages || 0}
                    />
                    <Document 
                        file={mergedPdfUrl} 
                        onLoadSuccess={onDocumentLoadSuccess}
                    >
                    {Array.from(
                        new Array(numPages),
                        (el, index) => (
                        <div key={`page_${index + 1}`} ref={el => pageRefs.current[index] = el} className="pdf-document">
                            <Page 
                                pageNumber={index + 1}
                                rotate={rotation}
                                scale={scale}
                            />
                            <p >
                                Page {index + 1} of {numPages}
                            </p>
                        </div>
                        ),
                )}
                    </Document>
                </div>
            ) : (
              <p>
                    No documents chosen.
              </p>
            )}
        </div>
    );
};

export default PDFViewer;
