import {useRef, useState } from "react"
import {Button, Modal, TextField, Select } from "@navikt/ds-react"
import { PencilIcon } from "@navikt/aksel-icons";
import { IDocument } from "../types";
import {DocumentViewer} from "../DocumentViewer/DocumentViewer";

export const DocumentEditor = ({ journalpostId, tittel, journalposttype, datoOpprettet, journalstatus, tema, documentsToView, addDocument, documents}: { 
    journalpostId: string, 
    tittel: string, 
    journalposttype: string, 
    datoOpprettet: string, 
    journalstatus: string, 
    tema: string,
    documentsToView: IDocument[],
    addDocument: (document: IDocument) => void,
    documents: IDocument[],
}) => {
    
    // Manage state for the input fields
    const [brukerId, setBrukerId] = useState('');
    const [tittelen, setTittel] = useState(tittel);
    const [journalposttypen, setType] = useState(journalposttype);
    const [statusen, setStatus] = useState(journalstatus);
    const [temaet, setTema] = useState(tema);

    // Error message
    const [errorMessage, setErrorMessage] = useState('');

    const ref = useRef<HTMLDialogElement>(null);

    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        return `${day}.${month}.${year}`
    }  ;  

    const splitDocs = () => {
        console.log("testing" + tittelen + journalposttypen + statusen + temaet);

        const token = sessionStorage.getItem("token");

        if(!token) {
            setErrorMessage("Du må logge inn for å søke!");
            return;
        }
        const currentDate = formatDate(new Date());
        // Opprett JSON body med userId
        const requestBody = {
            brukerId: {
              id: brukerId,
              type: "FNR" 
            },
            
          };

    }
    return(
        <div>
            <Button 
                onClick={() => ref.current?.showModal()} 
                iconPosition="right" icon={<PencilIcon aria-hidden />} 
                style={{marginTop: "10px"}}>Splitt Docs
            </Button>

            <Modal ref={ref} header={{ heading: "Splitt Opp Dokumenter" }} width={600}>
                <Modal.Body>
                    <form method="dialog" id="skjema" onSubmit={splitDocs}>
                        <TextField      
                            label="ID"      
                            value={journalpostId}
                            className="inputBox"
                            readOnly
                        />
                        <TextField      
                            label="Tittel"      
                            value={tittelen}
                            onChange={(event) => setTittel(event.target.value)}
                            className="inputBox"
                        />
                        <Select label="Type">
                            <option value="I">Inngående</option>
                            <option value="U">Utgående</option>
                            <option value="N">Notat</option>
                        </Select>
                        <TextField      
                            label="Dato"      
                            value={datoOpprettet}
                            className="inputBox"
                            readOnly
                        />
                        <Select label="Status">
                            <option value="JOURNALFOERT">Journalført</option>
                            <option value="FERDIGSTILT">Utgående</option>
                            <option value="NOTAT">Notat</option>
                        </Select>
                        <TextField      
                            label="Tema"      
                            value={temaet}
                            onChange={(event) => setTema(event.target.value)}
                            className="inputBox"
                        />
                        <h2>Velg dokumenter</h2>
                        <DocumentViewer 
                            documentsToView={documentsToView}
                            addDocument={addDocument}
                            documents={documents}
                        />
                    </form>        
                </Modal.Body>
                <Modal.Footer>
                    <Button form="skjema">Opprett Nytt JournalPost</Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => ref.current?.close()}
                    >Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default DocumentEditor;