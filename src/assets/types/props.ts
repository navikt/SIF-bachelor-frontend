import React, { Dispatch, ReactNode, SetStateAction } from 'react';
import { IDocument, AvsenderMottaker, Metadata } from "./models";
import { FilterOptions, SetErrorProp } from './misc';

export interface FilterPopoverContentProps {
    onClose: () => void;
    onFilterSubmit: (filterData: {
        startDate?: Date,
        endDate?: Date,
        filter: string[],
        selectedStatus: string[],
        selectedType: string[],
    }) => void; 
    onSuccess: (errorProp: SetErrorProp) => void;
};

export interface DocumentViewerProps {
    documentsToView: IDocument[];
    addGlobalDocument: (document: IDocument) => void;
    documents: IDocument[];
    isModal: boolean;
    handleSelectedIdandTitle: (selectedDocs: IDocument[]) => void;
    handleUnselectedIdandTitle: (unselectedDocs: IDocument[]) => void;
    handleIsVisible: (document: IDocument) => boolean;
    handleBrevkodeChange?: (nyBrevkode: string) => void;
}

export interface FilterPopoverProps {
    anchorEl: React.RefObject<HTMLElement>;
    openState: boolean;
    setOpenState: Dispatch<SetStateAction<boolean>>;
    onClose: () => void;
    onSuccess: (errorProp: SetErrorProp) => void;
    onFilterSubmit: (filterData: {
      startDate?: Date,
      endDate?: Date,
      filter: string[],
      selectedStatus: string[],
      selectedType: string[],
  }) => void;
}

export interface SearchHandlerProps {
    brukerId: string;
    brukerIdError: string;
    filterData: FilterOptions;
}

export interface DocumentEditorProps {
    brukerId: string;
    journalpostId: string;
    tittel: string;
    journalposttype: string;
    datoOpprettet: string;
    journalstatus: string;
    tema: string;
    avsenderMottaker: AvsenderMottaker;
    documentsToView: IDocument[];
    addGlobalDocument: (document: IDocument) => void;
    documents: IDocument[];
    setIsModalOpen: (isModalOpen: boolean) => void;
    appendNewJournalpost: (newJournalPost: any, oldJournalPost: any) => void;
    handleIsVisible: (document: IDocument) => boolean;
    onStatusChange: (newStatus: string, journalpostId: string) => void;
}

export interface UseSplitDocsProps {
    journalpostId: string;
    oldMetadata: Metadata;
    newMetadata: Metadata;
    journalstatus: string;
    journalposttype: string;
    appendNewJournalpost: (newPost: any, oldPost: any) => void;
    onStatusChange: (newStatus: string, journalpostId: string) => void;
    selectedDocuments: IDocument[]
    unselectedDocuments: IDocument[]
}

export interface PDFViewerProps {
    documentUrls: Map<string, string>;
    documents: IDocument[]
}

export interface ErrorProviderProps{
    children: ReactNode;
}