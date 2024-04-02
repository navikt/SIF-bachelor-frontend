import {useRef } from "react"
import {Button, Modal, TextField } from "@navikt/ds-react"
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
    const ref = useRef<HTMLDialogElement>(null);

    return(
        <div>
            <Button 
                onClick={() => ref.current?.showModal()} 
                iconPosition="right" icon={<PencilIcon aria-hidden />} 
                style={{marginTop: "10px"}}>Splitt Docs
            </Button>

            <Modal ref={ref} header={{ heading: "Splitt Opp Dokumenter" }} width={600}>
                <Modal.Body>
                    <form method="dialog" id="skjema" onSubmit={() => alert("onSubmit")}>
                        <TextField      
                            label="ID"      
                            value={journalpostId}
                            className="inputBox"
                            readOnly
                        />
                        <TextField      
                            label="Tittel"      
                            value={tittel}
                            className="inputBox"
                        />
                        <TextField      
                            label="Type"      
                            value={journalposttype}
                            className="inputBox"
                        />
                        <TextField      
                            label="Dato"      
                            value={datoOpprettet}
                            className="inputBox"
                            readOnly
                        />
                        <TextField      
                            label="Status"      
                            value={journalstatus}
                            className="inputBox"
                        />
                        <TextField      
                            label="Tema"      
                            value={tema}
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