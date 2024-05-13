import React, { useState, useEffect, useRef } from "react";
import { pdfjs } from "react-pdf"
import "react-pdf/dist/esm/Page/TextLayer.css";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { IDocument, LogiskVedlegg, RotationInfo, ErrorResponse, PDFViewerProps } from "../../../../assets/types/export";
import { PDFDocument, Rotation, RotationTypes } from "pdf-lib";
import "./PDFViewer.css"
import { Alert } from "@navikt/ds-react";
import { RotateLeftIcon, RotateRightIcon, ZoomPlusIcon, ZoomMinusIcon } from '@navikt/aksel-icons';
import { Page, Document, Outline } from 'react-pdf';
import { useNotification } from "../../../hooks/export"


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

export const PDFViewer = ({ documentUrls, documents }: PDFViewerProps) => {
    
    const [currentPage, setCurrentPage] = useState(1);
    const [numPages, setNumPages] = useState<number | null >(null);
    const [mergedPdfUrl, setMergedPdfUrl] = useState<string | undefined>(undefined);
    const [scale, setScale] = useState(1); // Start with no zoom
    const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [mergeTrigger, setMergeTrigger] = useState<number>(Math.random)

    const { setNotificationMessage } = useNotification()

    const handleScroll = () => {
        // Iterate through page refs to check intersection with viewport
        pageRefs.current.forEach((pageRef, index) => {
            if (pageRef) {
                const rect = pageRef.getBoundingClientRect();
                const pageHeight = rect.bottom - rect.top;
                const isInView = rect.top < window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
                if (isInView) {
                    console.log("din side: " + currentPage)
                    setCurrentPage(index + 1); // Update current page state
                }
            }
        });
    };

    
    const parseRotationLib = () => {
        for(const document of documents){
            if(document.logiskeVedlegg.length){
                const libString = document.logiskeVedlegg[0].tittel
                // Parse the JSON string to a JavaScript object
                if(libString){
                    const rotationLib: RotationInfo[] = JSON.parse(libString);

                    document.rotationLib=rotationLib
                }
            }else{
                document.rotationLib=[]
            }
            
        }
    }

    const mergePdfs = async () => {
        try{
            const mergedPdf = await PDFDocument.create();
            for (const document of documents) {
                const url = documentUrls.get(document.dokumentInfoId);
                if (!url) {
                    //setErrorMessage("URL not found for document with ID: " + document.dokumentInfoId);
                    return;
                }
                const pdfBytes = await fetch(url).then(async response => {
                    if (!response.ok) {
                        const errorResponse = await response.json(); 
                        setNotificationMessage({message: "Kunne ikke hente dokument med ID: " + document.dokumentInfoId, variant: "error"})
                        throw new Error(errorResponse.errorMessage || `Failed to fetch document with ID ${document.dokumentInfoId}: ${response.statusText}`);
                    }
                    const buffer = await response.arrayBuffer()
                    return buffer;
                });
                // Takes the raw binary data from pdfBytes and stores it into the PDFDocument object'
                const pdf = await PDFDocument.load(pdfBytes);
                // copiedPages will be an array object of the pages in the PDF with page 1 and page 2 being [0, 1]
                // and each object has a LOT of low level info about each page
                // So TLDR, copyPages maps each page to its own object in an array where each object has the page number and lots of low level metadata

                if (document.rotationLib) {
                    document.rotationLib.forEach(rotationInfo => {
                        const pageIndex = rotationInfo.page - 1; // Pages are 0-indexed
                        const page = pdf.getPages()[pageIndex];
                        const rotationDegrees = rotationInfo.rotation;
                        let rotation: Rotation = {angle: rotationDegrees, type: RotationTypes.Degrees};
                        page.setRotation(rotation);
                    });
                }

                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                document.pageCount= copiedPages.length
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
                setNotificationMessage({message: "Kunne ikke laste inn dokumentene. Prøv igjen senere", variant: "error"} );
            } else {
                // The error is a JavaScript error
                console.error("There was an error merging the PDFs: ", error);
                setNotificationMessage({message:"Kunne ikke laste inn dokumentene. Prøv igjen senere", variant:"error"});
            }
        }
    }

    useEffect(() => {
        if (documentUrls && documents.length > 0) {
            parseRotationLib()
            mergePdfs();
        }
    }, [documents, mergeTrigger]);

    
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
        let currentDocumentIndex = -1;
        let currentDocument: IDocument | null = null;

        for (let i = 0; i < documents.length; i++) {
            const document = documents[i];
            if (currentPage <= cumulativePageCount + (document.pageCount || 0)) {
                currentDocumentIndex = i;
                currentDocument = document;
                break;
            }

            cumulativePageCount += document.pageCount || 0;
        }

        if (currentDocument !== null && currentDocumentIndex !== -1) {
            // Adjust the current page number to be within the current document
            const pageWithinDocument = currentPage - cumulativePageCount;

            // Check if the current document has rotationLib
            if (currentDocument.rotationLib) {
                // Find the rotation information for the current page within rotationLib
                const rotationInfoIndex = currentDocument.rotationLib.findIndex(info => info.page === pageWithinDocument);
                const rotationDegrees = direction === 'left' ? -90 : 90;
                const normalizedRotation = (rotationDegrees % 360 + 360) % 360;

                if (rotationInfoIndex !== -1) {
                    // Update the rotation for the page
                    
                    currentDocument.rotationLib[rotationInfoIndex].rotation += normalizedRotation;
                    
                    const logiskVedlegg: LogiskVedlegg = {tittel: JSON.stringify(currentDocument.rotationLib)}
                    currentDocument.logiskeVedlegg = [logiskVedlegg]
                    
                    // Log the rotation update
                    console.log(`Rotated page ${pageWithinDocument} of document ${currentDocument.dokumentInfoId} by ${normalizedRotation} degrees`);
                } else {
                    // The page does not exist in rotationLib, you can handle this case accordingly
                    const rotationInfo: RotationInfo = {page: pageWithinDocument, rotation: normalizedRotation}
                    currentDocument.rotationLib.push(rotationInfo)

                    const logiskVedlegg: LogiskVedlegg = {tittel: JSON.stringify(currentDocument.rotationLib)}
                    currentDocument.logiskeVedlegg = [logiskVedlegg]
                }

                // Optionally, you may want to update the document in the documents array
                documents[currentDocumentIndex] = currentDocument;
            } else {
                // rotationLib does not exist for the current document, you can handle this case accordingly
                console.log(`Rotation information not available for document ${currentDocument.dokumentInfoId}`);
            }
        } else {
            setNotificationMessage({message: "Fant ingen dokument relatert til denne siden.", variant:"error"})
            console.log("No document found for the current page");
        }
        setNotificationMessage(null)
        setMergeTrigger(Math.random)
        console.log(documents)
    };

    const handleZoomIn = () => {
        setScale(scale => scale + 0.10); // Increase zoom by 10%
    };

    const handleZoomOut = () => {
        setScale(scale => scale - 0.10); // Decrease zoom by 10%
    };

   
    let lastDocumentIndexDisplayed = -1;
    return (
        <div className="pdf-viewer-container">
            <RotateRightIcon onClick={() => handleRotate('right')} className="toolbar-btns rotate-right" />
            <RotateLeftIcon onClick={() => handleRotate('left')} className="toolbar-btns rotate-left" />
            <ZoomPlusIcon onClick={()=>handleZoomIn()} className="toolbar-btns zoom-in"/>
            <ZoomMinusIcon onClick={()=>handleZoomOut()} className="toolbar-btns zoom-out"/>
            {currentPage && numPages && documents.length>0 &&(
                <p className="toolbar-btns page-index">{`Side ${currentPage} av ${numPages}`}</p>
            )}
            {(mergedPdfUrl && documents.length > 0) ? (          
                    
                <div className="pdf-content" id="pdf-content">
                    <Document 
                        file={mergedPdfUrl} 
                        onLoadSuccess={onDocumentLoadSuccess}
                    >

                    {Array.from(
                        new Array(numPages),
                        (el, index) => {
                            
                            const cumulativePageCount = documents
                            .slice(0, index)
                            .reduce((acc, doc) => acc + (doc.pageCount || 0), 0);
                            const pageWithinDocument = currentPage - cumulativePageCount;
                            const currentDocumentIndex = documents.findIndex(doc => currentPage <= (cumulativePageCount + (doc.pageCount || 0)));
                    
                            // Check if we have scrolled to a new document
                            const isNewDocument = currentDocumentIndex !== lastDocumentIndexDisplayed;
                            lastDocumentIndexDisplayed = currentDocumentIndex; // Update last displayed index
                            
                            return (
                            <div key={`page_${index + 1}`} className={currentPage === index+1 ? "pdf-document active-wrapper" : "pdf-document"}>
                                <Page 
                                    pageNumber={index + 1}
                                    inputRef={ref => pageRefs.current[index] = ref}
                                    scale={scale}
                                    className={currentPage === index+1 ? "active-doc" : ""}
                                />
                            </div>
                        )}
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
