import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Table, Tag, Chips, Loader } from "@navikt/ds-react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

import { DocumentViewer, DocumentEditor, PDFViewer } from "../../content/components/documentHandling/export"
import { FeilRegistrer, MottattDato } from "../../content/components/dataIO/export"

import { IDocument, Journalpost, RelevantDato } from "../../assets/types/export";

import './SearchResults.css';
import { formatDate, transformFilterOptionsToList, formatStatus, selectTagVariant, shouldShowFeilRegistrer,  } from "../../assets/utils/FormatUtils";

import { useDocuments, useSearchHandler, useSort, useTitle, useNotification } from "../../content/hooks/export";
  // Manage state for the filterData object that we receive in the dropdown to use in handleSearch
  
export const SearchResults = () => {

    const location = useLocation()
    const [isDataLoading, setIsDataLoading] = useState<boolean>(false)
    const { isAuthenticated, getToken, isLoading } = useKindeAuth()
    const [filterList, setFilterList] = useState<string[]>([])
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const { setNotificationMessage } = useNotification()

    const { fetchData, userkey, selectedRows, selectRow, journalpostList, setJournalpostList} = useSearchHandler({isAuthenticated, getToken })
    const { documents, setDocuments, documentUrls } = useDocuments();

    useTitle("Vju - Resultat")

    const comparator = (a: Journalpost, b: Journalpost, orderBy: keyof Journalpost) => {
        if (b[orderBy] < a[orderBy] || b[orderBy] === undefined) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    };

    const { sort, handleSort, sortedData } = useSort<Journalpost>();

    useEffect(()=>{
        if(!isLoading){
            if(isAuthenticated){
                fetchData({ setDocuments, setIsLoading: setIsDataLoading })
                setJournalpostList(jp => ({ ...jp, brukerId: userkey }));
            }else{
                setNotificationMessage({message: "Du må logge inn for å kunne hente data!", variant: "warning"})
            }
        }else{
            console.log("laster...")
        }
        
    }, [location.state, isLoading])



    const handleRowClick = (id: string) => {
        selectRow(prevSelectedRows => {
            if (prevSelectedRows.includes(id)) {
                // Row already selected, remove it
                return prevSelectedRows.filter(rowId => rowId !== id);
            } else {
                // Row not selected, add it
                return [...prevSelectedRows, id];
            }
        });
    }

    //For border og shading
    const isRowClicked = (id: string) => selectedRows.includes(id)


    const addRowDocuments = (journalId: string) => {
        const journal = journalpostList.find(journal => journal.journalpostId === journalId);

        if (journal) {
            if (isRowClicked(journalId)) {
                // If the row is clicked, remove every document in the journal from the documents state
                setDocuments(prevDocuments => {
                    // Filter out documents that are present in the journal
                    return prevDocuments.filter(document =>
                        !journal.dokumenter.some(newDocument => newDocument.dokumentInfoId === document.dokumentInfoId)
                    );
                });
            } else {
                // If the row is not clicked, add every document to the documents state
                setDocuments(prevDocuments => {
                    // Filter out documents that are already present
                    const updatedDocuments = prevDocuments.filter(document =>
                        !journal.dokumenter.some(newDocument => newDocument.dokumentInfoId === document.dokumentInfoId)
                    );

                    // Concatenate new documents from the journal
                    return [...updatedDocuments, ...journal.dokumenter];
                });
            }
        }

        handleRowClick(journalId);
    };

    const isVisible = (document: IDocument) => {
        return documents.some(doc => doc.dokumentInfoId === document.dokumentInfoId);
    }

    const addDocument = (documentToAdd: IDocument) => {
        // Find the document to add based on its ID
        if (documentToAdd) {
            setDocuments(prevDocuments => {
                // Check if the document already exists in the documents state
                const isDocumentExist = prevDocuments.some(document => document.dokumentInfoId === documentToAdd.dokumentInfoId);
    
                // If the document doesn't exist, add it to the documents state
                if (!isDocumentExist) {
                    return [...prevDocuments, documentToAdd];
                } else {
                    // If the document already exists, filter it out from the documents state
                    return prevDocuments.filter(document => document.dokumentInfoId !== documentToAdd.dokumentInfoId);
                }
            });
        }
    };

    const changeStatus = (newStatus: string, sameJournalpostId: string) => {

        console.log(newStatus)
        setJournalpostList(prevJournalpostList => 
            prevJournalpostList.map(journalpost =>
                journalpost.journalpostId === sameJournalpostId
                ? { ...journalpost, journalstatus: newStatus }
                : journalpost
            )
        );
    }

    const addNewJournalPosts = (newJournalPost: Journalpost, oldJournalPost: Journalpost) => {
        // Here, handle the state update or any other operations with these objects
        console.log(newJournalPost)
        console.log(oldJournalPost)
        console.log("datoen til nye JP er: " + newJournalPost.datoOpprettet)
        console.log("datoen til den gamle JP er: " + oldJournalPost.datoOpprettet)

        setJournalpostList(prevJournalpostList => [
            ...prevJournalpostList,
            newJournalPost,
            oldJournalPost
        ]);
    };

    const showMottattDato = (journalposttype: string, journalstatus: string, relevanteDatoer: RelevantDato[]) => {
        console.log(relevanteDatoer)
        if(journalposttype === "I"){
            const relevantDato = relevanteDatoer.find((dato) => dato.datotype === "DATO_REGISTRERT");
            if (relevantDato) {
                return formatDate(new Date(relevantDato.dato));
            } else {
                return "Show Button";
            }
        }
        return null;
    } 

    const setMottattDato = (journalpostIdEndre: string) => {
        console.log("We in da setMottattDato method")
        setJournalpostList(prevJournalpostList => 
            prevJournalpostList.map(journalpost =>
                journalpost.journalpostId === journalpostIdEndre
                ? { ...journalpost, relevanteDatoer: [...journalpost.relevanteDatoer, {dato: new Date().toISOString(), datotype: "DATO_REGISTRERT"}]}
                : journalpost
            )
        );
    }

    if(isDataLoading || isLoading){
        return (
            <div className="search-result-loading">
                            <Loader size="3xlarge" title="Venter..." variant="interaction" />
            </div>
        )
    }

    return (
            <div className="searchResultsWrapper">
                <div className="searchResultsLeft">
                    <div className="searchResultsShelf">
                        <h1>Navn: John / Jane Doe</h1>
                        <h2>{journalpostList.length} treff for "{userkey}"</h2>
                    </div>
                    {filterList.length>0 &&(
                        <div className="filterList">
                            <h4 style={{padding: 0, margin: 0, marginBottom: "0.75rem"}}>Aktive filtere</h4>
                            <Chips>
                                {filterList.map((c, y) => (
                                    <Chips.Toggle
                                        key={c}
                                        checkmark={false}
                                        style={{ backgroundColor: "var(--a-blue-700)", color: "var(--a-white)", cursor: "default" }}
                                    >
                                    {c}
                                    </Chips.Toggle>
                                ))}
                            </Chips>
                        </div>
                    )}
                    
                    
                    <Table sort={sort} onSortChange={(sortKey) => handleSort(sortKey)}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Utvid</Table.HeaderCell>
                                <Table.ColumnHeader sortKey="journalpostId" sortable>ID</Table.ColumnHeader>
                                <Table.ColumnHeader sortKey="tittel" sortable>Tittel</Table.ColumnHeader>
                                <Table.ColumnHeader sortKey="journalposttype" sortable>Inn/Ut</Table.ColumnHeader>
                                <Table.ColumnHeader sortKey="datoOpprettet" sortable>Dato</Table.ColumnHeader>
                                <Table.ColumnHeader sortKey="journalstatus" sortable>Status</Table.ColumnHeader>
                                <Table.ColumnHeader sortKey="tema" sortable>Tema</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {sortedData(journalpostList, comparator).map(({ journalpostId, brukerid, tittel, journalposttype, datoOpprettet, journalstatus, tema, avsenderMottaker, relevanteDatoer }, i) => (
                                <Table.ExpandableRow 
                                    key={i + journalpostId}
                                    onClick={() => addRowDocuments(journalpostId)}
                                    selected={selectedRows.includes(journalpostId)}
                                    className={`tableRow ${isRowClicked(journalpostId) ? "selectedRowOutline" : ""}`}
                                    content={
                                        <div className="jp-content">
                                            <div className="jp-info-section">
                                                <h4 className="jp-title">
                                                    {journalposttype === "I" ? "Avsender:" : "Mottaker:"}
                                                </h4>
                                                <div className="avsendermottaker-info">
                                                    <p>FNR: {avsenderMottaker.id}</p>
                                                    <p>Navn: {avsenderMottaker.navn}</p>
                                                    <p>Land: {avsenderMottaker.land ? avsenderMottaker.land : "Ikke relevant"}</p>
                                                    {journalposttype === "I" && (
                                                        showMottattDato(journalposttype, journalstatus, relevanteDatoer) === "Show Button" ?
                                                        <MottattDato 
                                                            journalpostId = {journalpostId}
                                                            handleMottattDato={setMottattDato}
                                                        /> :
                                                        <p>Dato Mottatt: {showMottattDato(journalposttype, journalstatus, relevanteDatoer)}</p>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="jp-info-section">
                                                <h4 className="jp-title">Dokumenter:</h4>
                                                <DocumentViewer 
                                                    documentsToView={journalpostList.find(entry => entry.journalpostId === journalpostId)?.dokumenter || []}
                                                    addGlobalDocument={addDocument}
                                                    documents={documents}
                                                    isModal={isModalOpen}
                                                    handleSelectedIdandTitle={() => {}}
                                                    handleUnselectedIdandTitle={() => {}}
                                                    handleIsVisible={isVisible}
                                                    handleInputValidation={() => {}}
                                                />
                                            </div>
                                            
                                           
                                            <div className="row-buttons">
                                                <DocumentEditor
                                                        brukerId={brukerid || userkey}
                                                        journalpostId={journalpostId}
                                                        tittel={tittel}
                                                        journalposttype={journalposttype}
                                                        datoOpprettet={formatDate(new Date(datoOpprettet))}
                                                        journalstatus={journalstatus}
                                                        tema={tema}
                                                        avsenderMottaker={avsenderMottaker}
                                                        documentsToView={journalpostList.find(entry => entry.journalpostId === journalpostId)?.dokumenter || []}
                                                        addGlobalDocument={addDocument}
                                                        documents={documents}
                                                        setIsModalOpen={setIsModalOpen}
                                                        appendNewJournalpost={addNewJournalPosts}
                                                        handleIsVisible={isVisible}
                                                        onStatusChange={changeStatus}
                                                />
                                                    {shouldShowFeilRegistrer(journalposttype, journalstatus) && 
                                                        <FeilRegistrer
                                                            journalposttype={journalposttype}
                                                            journalpostId={journalpostId}
                                                            onStatusChange={changeStatus}
                                                            formatStatus={formatStatus}
                                                        />
                                                    }
                                                </div> 
                                                
                                        
                                        </div>
                                    }
                                >
                                    <Table.DataCell>{journalpostId}</Table.DataCell>
                                    <Table.DataCell>{tittel}</Table.DataCell>
                                    <Table.DataCell>{journalposttype}</Table.DataCell>
                                    <Table.DataCell>{formatDate(new Date(datoOpprettet))}</Table.DataCell>
                                    <Table.DataCell>
                                        <Tag variant={selectTagVariant(journalstatus)}>{formatStatus(journalstatus)}</Tag> 
                                    </Table.DataCell>
                                    <Table.DataCell>{tema}</Table.DataCell>
                                </Table.ExpandableRow>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
                    
                {documentUrls.size > 0 && (
                    <div className="searchResultsRight">
                        <PDFViewer key={documentUrls.size} documentUrls={documentUrls} documents={documents} />
                    </div>
                )}
            </div>
    )
}

export default SearchResults;