import React, { Dispatch, SetStateAction } from 'react';
import { IDocument, AvsenderMottaker } from "./models";

export interface FilterPopoverContentProps {
    onClose: () => void;
    onFilterSubmit: (filterData: {
        startDate?: Date,
        endDate?: Date,
        filter: string[],
        selectedStatus: string[],
        selectedType: string[],
    }) => void; 
    showSuccessAlert: (isShown: boolean) => void;
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
    showSuccessAlert: (isShown: boolean) => void;
    onFilterSubmit: (filterData: {
      startDate?: Date,
      endDate?: Date,
      filter: string[],
      selectedStatus: string[],
      selectedType: string[],
  }) => void;
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

export interface PDFViewerProps {
    documentUrls: Map<string, string>;
    documents: IDocument[]
}