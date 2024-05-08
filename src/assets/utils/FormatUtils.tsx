import { FilterOptions } from "../types/export";
import { AvsenderMottaker } from "../types/export";
/* formatDate to get DD.MM.YYYY */
export const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
   const year = date.getFullYear().toString();
  return `${day}.${month}.${year}`
};  

export const formatStatus = (status: string) => {
    switch(status){
        case("UTGAAR"):
            return "Utgår"
        case("UNDER_ARBEID"):
            return "Under arbeid"
        case("JOURNALFOERT"):
            return "JOURNALFØRT"
        default:
            return status
    }
}

export const transformFilterOptionsToList = (options: FilterOptions): any[] => {
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

export const selectTagVariant = (journalStatus: string) => {
    switch(journalStatus.toUpperCase()){
        case("UNDER_ARBEID"):
            return "alt1"
        case("JOURNALFOERT"):
            return "info"  
        case("FERDIGSTILT"):
            return "success"
        case("EKSPEDERT"):
            return "warning"
        case("UTGAAR"):
            return "error"
        case("AVBRUTT"):
            return "error"
        default:
            return "neutral"
    }
}

export const shouldShowFeilRegistrer = (journalposttype: string, journalstatus: string) => {
    return (journalposttype === "I" || journalposttype === "U") && 
           (journalstatus !== "FERDIGSTILT") && 
           (journalstatus !== "AVBRUTT") && 
           (journalstatus !== "UTGAAR");
}

export const convertStatus = (journaltype: string) => {
    if(journaltype === "I") {
        return "UTGÅR";
    } else {
        return "AVBRUTT";
    }
}

export const displayType = (type: string) => {
    if (type === "U") {
        return "Utgående";
    } else if (type === "I") {
        return "Inngående";
    } else if (type === "N") {
        return "Notat";
    }
}

export const metadataTemplate = (brukerId: string, tittel: string, journalposttype: string, datoOpprettet: string, tema: string, avsenderMottaker: AvsenderMottaker) => {
    return {
        bruker: {
            id: brukerId,
            type: "FNR",
        },
        dokumenter: [{
            brevkode: "NAV 04-01.03",
            dokumentvarianter: [{
                filtype: "PDFA",
                fysiskDokument: "Dokument",
                variantformat: "ARKIV"
            }],
            tittel: "placeholder",
        }],
        datoDokument: datoOpprettet,
        tittel: tittel,
        journalposttype: journalposttype,
        tema: tema,
        avsenderMottaker: avsenderMottaker
    };
}

export const tema = ["AAP", "AAR", "AGR", "ARP", "ARS", "BAR", "BID", "BIL", "DAG", "ENF", "ERS",
"EYB", "EYO", "FAR", "FEI", "FIP", "FOR", "FOS", "FRI", "FUL", "GEN", "GRA", "GRU", "HEL", "HJE",
"IAR", "IND", "KON", "KLL", "KTA", "KTR", "MED", "MOB", "OMS", "OPA", "OPP", "PEN", "PER", "REH",
"REK", "RPO", "RVE", "SAA", "SAK", "SAP", "SER", "STO", "SUP", "SYK", "SYM", "TIL", "TRK", "TRY",
"TSO", "TSR", "UFM", "UFO", "UKJ", "VEN", "YRA", "YRK"];