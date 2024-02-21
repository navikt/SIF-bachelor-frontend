import React, { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { Table, Button, Tag, Chips } from "@navikt/ds-react"
import { PDFViewer } from "../../components/PDFViewer"

import './SearchResults.css';

interface SearchResult {
    journalpostId: string;
    tittel: string;
    journalposttype: string;
    journalstatus: string;
    tema: string;
}

interface FilterOptions {
    startDate?: Date;
    endDate?: Date;
    filter: string[];
    selectedStatus: string[]
    selectedType: string[]
}
/* formatDate to get DD.MM.YYYY */
const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}.${month}.${year}`;
};

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

  // Manage state for the filterData object that we receive in the dropdown to use in handleSearch
  
export const SearchResults = () => {

    const location = useLocation()
    console.log(location.state)
    const [userkey, setUserkey] = useState<string>(location.state.userkey)
    const [searchData, setSearchData] = useState<SearchResult[]>(location.state.data.dokumentoversiktBruker.journalposter as SearchResult[]) || []
    const [filterOptions, setFilterOptions] = useState<FilterOptions>(location.state.filterOptions);
    const [filterList, setFilterList] = useState<string[]>([])
    const [clickedJournalId, setClickedJournalId] = useState<string>(searchData[0].journalpostId);
    const [clickedRow, setClickedRow] = useState<string>(searchData[0].journalpostId);

    const [selectedRows, selectRow] = useState<string[]>([])

    useEffect(() => {
        // Transform filterOptions into filterList
        setFilterList(transformFilterOptionsToList(filterOptions));
    }, [filterOptions]);



    const toggleRowSelection = (id: string) => {
        if(selectedRows.includes(id)){
            selectRow(selectedRows.filter(rowId => rowId !== id))
        }else{
            selectRow([...selectedRows, id])
            console.log(id + " ble lagt til!")
        }
    }

    const handleRowClick = (id: string) => {
        setClickedRow(id)
    }
    const isRowClicked = (id: string) => clickedRow === id;

    const updatePdfViewer = (journalId: string) => {
        setClickedJournalId(journalId)
        handleRowClick(journalId)
        console.log("initiating updating the pdf viewer. Here is the clicked id: " + journalId)
    }

    

    //setFilterList(transformFilterOptionsToList(filterOptions))
    console.log("FILTERLIST: " + JSON.stringify(filterList))
    console.log("OPTIONLIST: " +  JSON.stringify(filterOptions))

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
    
    if(!sessionStorage.getItem("token")){
        return <p style={{color: "red"}}>401 Forbidden!</p>
    }

    return (
        <>
            <div className="searchResultsWrapper">
                <div className="searchResultsLeft">
                    <div className="searchResultsShelf">
                        <h2>{searchData.length} treff for "{userkey}"</h2>
                        <Button variant="secondary">Hent {selectedRows.length} dokumenter</Button>
                    </div>
                    {filterList.length>0 &&(
                        <div className="filterList">
                            <h4 style={{padding: 0, margin: 0, marginBottom: "0.75rem"}}>Aktive filtere</h4>
                            <Chips>
                                {filterList.map((c) => (
                                    <Chips.Removable
                                        key={c}
                                        variant="action"
                                        onClick={() =>
                                            setFilterList((x) =>
                                            x.length === 1 ? filterList : x.filter((y) => y !== c),
                                            )
                                        }
                                    >
                                    {c}
                                    </Chips.Removable>
                                ))}
                            </Chips>
                        </div>
                    )}
                    
                    
                    <Table zebraStripes size="large">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Select</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Journal Post ID</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Title</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Tema</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {searchData.map(({ journalpostId, tittel, journalposttype, journalstatus, tema }) => (
                                // ! Denne kan legges på table.row for å enable onclick for quickview !
                                //onClick={() => toggleRowSelection(journalpostId)} selected={selectedRows.includes(journalpostId)}
                                <Table.Row 
                                    key={journalpostId}
                                    onClick={() => updatePdfViewer(journalpostId)}
                                    selected={selectedRows.includes(journalpostId)}
                                    className={isRowClicked(journalpostId) ? "selectedRowOutline" : ""}
                                >
                                    <Table.DataCell>
                                        <input
                                        type="checkbox"
                                        checked={selectedRows.includes(journalpostId)}
                                        onChange={() => toggleRowSelection(journalpostId)}
                                        />
                                    </Table.DataCell>
                                    <Table.DataCell>{journalpostId}</Table.DataCell>
                                    <Table.DataCell>{tittel}</Table.DataCell>
                                    <Table.DataCell>{journalposttype}</Table.DataCell>
                                    <Table.DataCell>
                                        <Tag variant={selectTagVariant(journalstatus)}>{journalstatus}</Tag>
                                        
                                    </Table.DataCell>
                                    <Table.DataCell>{tema}</Table.DataCell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
                    
                <div className="searchResultsRight">
                    <PDFViewer journalId={clickedJournalId} />
                </div>
            </div>
        </>
    )
}

export default SearchResults;