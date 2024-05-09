import { useEffect, useState } from "react";
import { IDocument } from "../../assets/types/export";
import useError from "./useError";

interface UseDocumentsProps {
    initialDocuments: IDocument[];
}

const useDocuments = ({ initialDocuments }: UseDocumentsProps) => {
    const [documents, setDocuments] = useState<IDocument[]>(initialDocuments);
    const [documentUrls, setDocumentUrls] = useState<Map<string, string>>(new Map());
    const { setErrorMessage } = useError()

    useEffect(() => {
        const fetchDocuments = async () => {
            const fetchedUrls = new Map<string, string>();
            const token = sessionStorage.getItem("token");

            if(!token){
                setErrorMessage({message: "Du må logge inn for tilgang til disse ressursene.", variant: "warning"})
                setDocumentUrls(new Map())
            }

            for (const document of documents) {
                const docId: string = document.dokumentInfoId;
                if (!documentUrls.has(docId)) {
                    const response = await fetch(`/hentDokumenter?dokumentInfoId=${docId}&journalpostId=1`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (!response.ok) {
                        if(response.status === 401){
                            setErrorMessage({message:"Logg inn for tilgang til denne ressursen", variant:"warning"})
                            return
                        }else{
                            setErrorMessage({message: "Kunne ikke hente dokumenter. Prøv igjen senere.", variant:"error"})
                            return
                        }   
                    }
                    setErrorMessage(null)
                    const blob = await response.blob();
                    fetchedUrls.set(docId, URL.createObjectURL(blob));
                }
            }

            setDocumentUrls(prevUrls => new Map([...prevUrls, ...fetchedUrls]));
        };

        if (documents.length > 0) {
            fetchDocuments();
        }
    }, [documents]);

    return { documents, setDocuments, documentUrls, setDocumentUrls };
};

export default useDocuments;