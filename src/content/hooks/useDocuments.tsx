import { useEffect, useState } from "react";
import { IDocument, UseDocumentsProps } from "../../assets/types/export";
import { useNotification } from "./export";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";


const useDocuments = ({ initialDocuments }: UseDocumentsProps) => {
    const [documents, setDocuments] = useState<IDocument[]>(initialDocuments);
    const [documentUrls, setDocumentUrls] = useState<Map<string, string>>(new Map());
    const { setNotificationMessage } = useNotification()
    const { getToken, isAuthenticated } = useKindeAuth()

    useEffect(() => {
        const fetchDocuments = async () => {
            const fetchedUrls = new Map<string, string>();

            if(!isAuthenticated){
                setNotificationMessage({message: "Du må logge inn for tilgang til disse ressursene.", variant: "warning"})
                setDocumentUrls(new Map())
            }
            const token = await getToken()
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
                            setNotificationMessage({message:"Logg inn for tilgang til denne ressursen", variant:"warning"})
                            return
                        }else{
                            setNotificationMessage({message: "Kunne ikke hente dokumenter. Prøv igjen senere.", variant:"error"})
                            return
                        }   
                    }
                    setNotificationMessage(null)
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