import React, { useState, useEffect } from "react";
//todo: 
export const PDFViewer = ({ journalId }: { journalId: string}) => {
    
    const [pdfReferences, setPdfReferences] = useState<{[key: string]: string}>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchPdf = async() => {
            try{
                if (pdfReferences[journalId]) {
                    setLoading(false);
                    return;
                }
                const token = sessionStorage.getItem("token")
                const response = await fetch("http://localhost:8080/get-simple-pdf?id="+journalId, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if(!response.ok){
                    throw new Error('Failed to fetch PDF');
                }
                
                const blob = await response.blob();
                const objectReference = URL.createObjectURL(blob);
                setPdfReferences((prevReferences) => ({
                    ...prevReferences,
                    [journalId]: objectReference
                  }));
                console.log(JSON.stringify(pdfReferences))
                setLoading(false);
            }catch(err){
                console.error("Internal server error: ", err)   
            }
        }
        
        fetchPdf()

    }, [journalId])

    if(loading ) return <p>Loading...</p>
    if(error) return <p>{error}</p>

    return (
        <>
            <div className="pdfDoc" style={{ height: "80%"}}>
                <iframe src={pdfReferences[journalId]} style={{ width: '100%', height: "100%"}} title="PDF Viewer"></iframe>
            </div>
        </>
    )
}

export default PDFViewer;