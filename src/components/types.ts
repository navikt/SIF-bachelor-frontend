export interface IDocument {
    dokumentInfoId: string;
    tittel: string;
    originalJournalpostId: string;
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