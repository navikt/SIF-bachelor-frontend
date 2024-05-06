import { useEffect, useState } from "react";
import { IDocument } from "../components/types";

interface UseDocumentsProps {
    initialDocuments: IDocument[];
}

const useDocuments = ({ initialDocuments }: UseDocumentsProps) => {
    const [documents, setDocuments] = useState<IDocument[]>(initialDocuments);
    const [documentUrls, setDocumentUrls] = useState<Map<string, string>>(new Map());
    const baseUrl = process.env.REACT_APP_BASE_URL

    useEffect(() => {
        const fetchDocuments = async () => {
            const fetchedUrls = new Map<string, string>();
            const token = sessionStorage.getItem("token");

            for (const document of documents) {
                const docId: string = document.dokumentInfoId;
                if (!documentUrls.has(docId)) {
                    const response = await fetch(`${baseUrl}/hentDokumenter?dokumentInfoId=${docId}&journalpostId=1`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (!response.ok) {
                        console.error("Failed to fetch document:", docId);
                        continue;
                    }
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