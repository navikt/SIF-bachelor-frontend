import React, { Dispatch, SetStateAction } from 'react';

export interface IDocument {
    dokumentInfoId: string;
    tittel: string;
    originalJournalpostId: string;
    brevkode: string;
    logiskeVedlegg: LogiskVedlegg[];
    pageCount?: number;
    rotationLib?: RotationInfo[];
}
export interface RotationInfo{
    page: number;
    rotation: number;
}
export interface LogiskVedlegg{
    tittel: string
}
/* Needed the type here because if not, we could get never[] arrays, which means that we wouldn't be able
     to add strings to these later which we don't want */
export interface filteredData {
    startDate?: Date,
    endDate?: Date,
    filter: string[],
    selectedStatus: string[],
    selectedType: string[],
}

export interface Journalpost {
    journalpostId: string;
    tittel: string;
    journalposttype: string;
    datoOpprettet: string;
    journalstatus: string;
    tema: string;
    avsenderMottakerNavn: string;
    dokumenter: IDocument[];
}

export interface FilterOptions {
    startDate?: Date;
    endDate?: Date;
    filter: string[];
    selectedStatus: string[]
    selectedType: string[]
}

export interface ErrorResponse {
    errorMessage: string;
}

export interface ToolbarInterface {
    onRotate: (direction: string) => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    currentPage: number;
    numPages: number;
}

export interface FilterPopoverContentProps {
    onClose: () => void;
    onFilterSubmit: (filterData: {
        startDate?: Date,
        endDate?: Date,
        filter: string[],
        selectedStatus: string[],
        selectedType: string[],
    }) => void; 
};

export interface DocumentViewerProps {
    documentsToView: IDocument[];
    addGlobalDocument: (document: IDocument) => void;
    documents: IDocument[];
    isModal: boolean;
    handleSelectedIdandTitle: (selectedDocs: IDocument[]) => void;
    handleUnselectedIdandTitle: (unselectedDocs: IDocument[]) => void;
    handleIsVisible: (document: IDocument) => boolean;
}

export interface FilterPopoverProps {
    anchorEl: React.RefObject<HTMLElement>;
    openState: boolean;
    setOpenState: Dispatch<SetStateAction<boolean>>;
    onClose: () => void;
    onFilterSubmit: (filterData: {
      startDate?: Date,
      endDate?: Date,
      filter: string[],
      selectedStatus: string[],
      selectedType: string[],
  }) => void;
  };

export interface SortState {
    orderBy: string;
    direction: "ascending" | "descending";
}