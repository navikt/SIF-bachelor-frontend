import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Table, Tag, Chips, Alert, Button, Modal, TextField } from "@navikt/ds-react";
import { PencilIcon } from "@navikt/aksel-icons";
import { PDFViewer } from "../../components/PDFViewer/PDFViewer";
import { DocumentViewer } from "../../components/DocumentViewer/DocumentViewer";
import { DocumentEditor } from "../../components/DocumentEditor/DocumentEditor";
import { IDocument, Journalpost, FilterOptions } from "../../components/types";
import './SearchResults.css';

/* formatDate to get DD.MM.YYYY */
const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
     const year = date.getFullYear().toString();
    return `${day}.${month}.${year}`
}  ;  

const transformFilterOptionsToList = (options: FilterOptions): any[] => {
    const list: any[] = [];
    if(options.startDate) {list.push(formatDate(options.startDate));}
    if(options.endDate) {list.push(formatDate(options.endDate));}
    

    options.filter.forEach((item, index) => {
        list.push(item);
    });

    options.selectedStatus.forEach((item, index) => {
        list.push(item);
    });

    options.selectedType.forEach((item, index) => { 
        list.push(item);
    });

    return list;
};
interface SortState {
    orderBy: string;
    direction: "ascending" | "descending";
}

  // Manage state for the filterData object that we receive in the dropdown to use in handleSearch
  
export const SearchResults = () => {
    const baseUrl = process.env.REACT_APP_BASE_URL
    const location = useLocation()
    const ref = useRef<HTMLDialogElement>(null);
    console.log(location.state)
    const [userkey, setUserkey] = useState<string>(location.state.userkey)
    const [journalpostList, setJournalpostList] = useState<Journalpost[]>(location.state.dokumentoversikt.journalposter as Journalpost[]) || []
    const [filterOptions, setFilterOptions] = useState<FilterOptions>(location.state.filterOptions);
    const [filterList, setFilterList] = useState<string[]>([])

    const [selectedRows, selectRow] = useState<string[]>([]);

    const [documentUrls, setDocumentUrls] = useState<Map<string, string>>(new Map());
    const [documents, setDocuments] = useState<IDocument[]>([]);

    const [sort, setSort] = useState<SortState | undefined>(undefined);

    const journalPostArrayLength = journalpostList.length - 1;

    const handleSort = (sortKey: string | undefined) => {
        if (sortKey) {
            setSort((prevSort) =>
            prevSort && sortKey === prevSort.orderBy && prevSort.direction === "descending"
                ? undefined
                : {
                    orderBy: sortKey,
                    direction:
                    prevSort && sortKey === prevSort.orderBy && prevSort.direction === "ascending"
                        ? "descending"
                        : "ascending",
                }
            );
        } else {
            // Handle case when sortKey is undefined (clear sorting)
            setSort(undefined);
        }
    };

    const comparator = (a: Journalpost, b: Journalpost, orderBy: keyof Journalpost) => {
        if (b[orderBy] < a[orderBy] || b[orderBy] === undefined) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    };

    const sortedData = journalpostList.slice().sort((a, b) => {
        if (sort) {
            return sort.direction === "descending"
                ? comparator(b, a, sort.orderBy as keyof Journalpost)
                : comparator(a, b, sort.orderBy as keyof Journalpost);
        }
        return 0; // Changed from 1 to 0
    });

    useEffect(() => {

        const fetchDocuments = async () => {
            
            const fetchedUrls = new Map<string, string>()
            const token = sessionStorage.getItem("token")
            for (const document of documents) {
                const docId: string = document.dokumentInfoId;

                if(documentUrls.has(docId) !== (undefined || true)){
                    //console.log(documentUrls.has(docId))
                    //console.log("Couldnt find saved document:", docId); // Add this line to check if documents are being fetched
                    const response = await fetch(baseUrl+"/hentDokumenter?dokumentInfoId=" + docId + "&journalpostId=1", { // ! VIKTIG ! HER MÅ document.originalJournalpostId BRUKES ISTEDET FOR 1
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    if (!response.ok) {
                        console.error("Failed to fetch document: " + docId)
                    }
    
                    const blob = await response.blob()
                    const objectReference = URL.createObjectURL(blob)
                    fetchedUrls.set(docId, objectReference)
                }else{
                    //console.log("Found saved document: " + documentUrls.get(docId))
                }
                
            }
    
            setDocumentUrls(prevUrls => {
                const newUrls = new Map([...prevUrls, ...fetchedUrls])
                return newUrls
            })
    
            console.log("Fetched documents:", fetchedUrls); // Add this line to check the fetched documents
        }
    
        if (documents.length > 0) {
            fetchDocuments()
        }
    
    }, [ documents ]);

    /* Kjempe mye redundant kode her, kanskje fjerne noen av disse og instansiere noen av de i selve useState()? */
    useEffect(()=>{
        setJournalpostList(location.state.dokumentoversikt.journalposter as Journalpost[])
        console.log("Hi " + location.state)
        setDocuments(location.state.dokumentoversikt.journalposter[0].dokumenter)
        setUserkey(location.state.userkey)
        setFilterOptions(location.state.filterOptions)
        console.log("LOGGER LOKAL FILTEROPTIONS")
        console.log(filterOptions)
        setFilterList(transformFilterOptionsToList(filterOptions))
        console.log(filterList)
        selectRow([location.state.dokumentoversikt.journalposter[0].journalpostId])
    }, [location.state, filterOptions])



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

    const addDocument = (documentToAdd: IDocument) => {
        // Find the document to add based on its ID
        console.log("documents before:")
        console.log(documents)
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
        console.log("documents after:")
        console.log(documents)
    };



    const selectTagVariant = (journalStatus: string) => {
        switch(journalStatus.toUpperCase()){
            case("JOURNALFOERT"):
                return "info"  
            case("FERDIGSTILT"):
                return "success"
            case("EKSPEDERT"):
                return "warning"
            default:
                return "neutral"
        }
    }
    if (!sessionStorage.getItem("token")) {
        return <Alert variant="error" style={{width: "5px"}}>Du har ikke tilgang til resurssen, vennligst prøv igjen senere.</Alert>;
    }



    return (
        <>
            <div className="searchResultsWrapper">
                <div className="searchResultsLeft">
                    <div className="searchResultsShelf">
                        <h2>{journalpostList.length} treff for "{userkey}"</h2>
                        {/*<Button variant="secondary" onClick={logDoc}>Hent {selectedRows.length} dokumenter</Button>*/}
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
                    
                    
                    <Table zebraStripes sort={sort} onSortChange={(sortKey) => handleSort(sortKey)}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Select</Table.HeaderCell>
                                <Table.ColumnHeader sortKey="journalpostId" sortable>ID</Table.ColumnHeader>
                                <Table.HeaderCell scope="col">Title</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                                <Table.ColumnHeader sortKey="datoOpprettet" sortable>Dato opprettet</Table.ColumnHeader>
                                {/*<Table.HeaderCell scope="col">Dato opprettet</Table.HeaderCell>*/}
                                <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Tema</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {sortedData.map(({ journalpostId, tittel, journalposttype, datoOpprettet, journalstatus, tema, avsenderMottakerNavn }, i) => (
                                <Table.ExpandableRow 
                                    key={i + journalpostId}
                                    onClick={() => addRowDocuments(journalpostId)}
                                    selected={selectedRows.includes(journalpostId)}
                                    className={`tableRow ${isRowClicked(journalpostId) ? "selectedRowOutline" : ""}`}
                                    content={
                                        <>
                                            <h4 style={{margin: "0", marginBottom: "0.75rem"}}>Dokumenter</h4>
                                            <p>Avsender: {avsenderMottakerNavn}</p>
                                            <DocumentViewer 
                                                documentsToView={journalpostList.find(entry => entry.journalpostId === journalpostId)?.dokumenter || []}
                                                addDocument={addDocument}
                                                documents={documents}
                                            />
                                           <DocumentEditor
                                                journalpostId={journalpostId}
                                                tittel={tittel}
                                                journalposttype={journalposttype}
                                                datoOpprettet={formatDate(new Date(datoOpprettet))}
                                                journalstatus={journalstatus}
                                                tema={tema}
                                                documentsToView={journalpostList.find(entry => entry.journalpostId === journalpostId)?.dokumenter || []}
                                                addDocument={addDocument}
                                                documents={documents}
                                            />

                                        </>
                                    }
                                >
                                    <Table.DataCell>{journalpostId}</Table.DataCell>
                                    <Table.DataCell>{tittel}</Table.DataCell>
                                    <Table.DataCell>{journalposttype}</Table.DataCell>
                                    <Table.DataCell>{formatDate(new Date(datoOpprettet))}</Table.DataCell>
                                    <Table.DataCell>
                                        <Tag variant={selectTagVariant(journalstatus)}>{journalstatus}</Tag>
                                        
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
        </>
    )
}

export default SearchResults;