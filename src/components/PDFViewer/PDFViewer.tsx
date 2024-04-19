import React, { useState, useEffect, useRef } from "react";
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
    const [scale, setScale] = useState(1); // Start with no zoom
    const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
    
    const handleScroll = () => {
        // Iterate through page refs to check intersection with viewport
        pageRefs.current.forEach((pageRef, index) => {
            if (pageRef) {
                const rect = pageRef.getBoundingClientRect();
                const isInView = rect.top < window.innerHeight && rect.bottom >= 0;
                if (isInView) {
                    console.log("din side: " + currentPage)
                    setCurrentPage(index + 1); // Update current page state
                }
            }
        });
    };

    useEffect(() => {

        const mergePdfs = async () => {
            try{
                const mergedPdf = await PDFDocument.create();
                for (const document of documents) {
                    const url = documentUrls.get(document.dokumentInfoId);
                    if (!url) {
                        console.log("URL DOESNT EXIST")
                        setExceptionError("URL not found for document with ID: " + document.dokumentInfoId);
                        return;
                    }
                    console.log("tranforming " + document.dokumentInfoId + " to buffer")
                    const pdfBytes = await fetch(url).then(async response => {
                        if (!response.ok) {
                            console.log("ikke ok")
                            const errorResponse = await response.json(); 
                            throw new Error(errorResponse.errorMessage || `Failed to fetch document with ID ${document.dokumentInfoId}: ${response.statusText}`);
                        }
                        console.log("returnerer buffer")
                        const buffer = await response.arrayBuffer()
                        console.log(buffer)
                        return buffer;
                    });
                    // Takes the raw binary data from pdfBytes and stores it into the PDFDocument object'
                    console.log("turning")
                    console.log(pdfBytes)
                    console.log("back into a pdf")
                    const pdf = await PDFDocument.load(pdfBytes);
                    console.log("pdf created successfully")
                    // copiedPages will be an array object of the pages in the PDF with page 1 and page 2 being [0, 1]
                    // and each object has a LOT of low level info about each page
                    // So TLDR, copyPages maps each page to its own object in an array where each object has the page number and lots of low level metadata
                    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                    document.pageCount= copiedPages.length
                    console.log(copiedPages)
                    /* This will add all of the page objects of a document to mergedPdf, so that in the pdf reader on the
                       right, it will display ALL the PDFs in a single journalpost one after the other. */
                    copiedPages.forEach((page, pageIndex) => {
                        mergedPdf.addPage(page); // Add the copied page to the merged PDF
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
                    console.error("There was an error merging the PDFs: ", errorData.errorMessage);
                    setExceptionError(errorData.errorMessage || "An unexpected error occurred while merging documents.");
                } else {
                    // The error is a JavaScript error
                    console.error("There was an error merging the PDFs: ", error);
                    setExceptionError((error as ErrorResponse).errorMessage || "An unexpected error occurred while merging documents.");
                }
            }
        };

        if (documentUrls && documents.length > 0) {
            mergePdfs();
        }
    }, [documents]);

    
    useEffect(() => {
        document.getElementById("pdf-content")?.addEventListener('scroll', handleScroll);
        
        return () => {
            document.getElementById("pdf-content")?.removeEventListener('scroll', handleScroll);
        };
    });

    const onDocumentLoadSuccess = ({numPages}: {numPages: number}) => {
        setNumPages(numPages)
        console.log(numPages)
    }

    const handleRotate = (direction: string) => {
        // Find the document containing the current page
        let cumulativePageCount = 0;
        let currentDocumentId = null;
    
        for (const document of documents) {
            if (currentPage <= cumulativePageCount + (document.pageCount || 0)) {
                currentDocumentId = document.dokumentInfoId;
                break;
            }
    
            cumulativePageCount += document.pageCount || 0;
        }
    
        if (currentDocumentId !== null) {
            // Adjust the current page number to be within the current document
            const pageWithinDocument = currentPage - cumulativePageCount;
            console.log(`Rotating page ${pageWithinDocument} of document ${currentDocumentId}`);
        } else {
            console.log("No document found for the current page");
        }
    
        // Perform rotation
        //setRotation(prevRotation => (direction === 'clockwise' ? prevRotation + 90 : prevRotation - 90) % 360);
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
                    
                <div className="pdf-content" id="pdf-content">
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
                            <div key={`page_${index + 1}`} className="pdf-document">
                                <Page 
                                    pageNumber={index + 1}
                                    inputRef={ref => pageRefs.current[index] = ref}
                                    scale={scale}
                                    rotate={rotation}
                                />
                                <p>
                                    Page {index + 1} of {numPages} {currentPage === index + 1 && "(in focus)"}
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
