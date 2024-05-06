export interface Journalpost {
    journalpostId: string;
    tittel: string;
    journalposttype: string;
    datoOpprettet: string;
    journalstatus: string;
    tema: string;
    relevanteDatoer: RelevantDato[];
    avsenderMottaker: AvsenderMottaker;
    dokumenter: IDocument[];
}
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
export interface RelevantDato {
    dato: string;
    datotype: string;
}

export interface AvsenderMottaker {
    erLikBruker: boolean;
    id: number;
    navn: string;
    land?: string;
}

export interface Metadata {
    bruker: {
        id: string;
        type: string;
    };
    dokumenter: {
        brevkode: string;
        dokumentvarianter: [{
            filtype: string;
            fysiskDokument: string;
            variantformat: string;
        }];
        tittel: string;
    }[];
    datoDokument: string;
    tittel: string;
    journalposttype: string;
    tema: string;
    avsenderMottaker: AvsenderMottaker;
}