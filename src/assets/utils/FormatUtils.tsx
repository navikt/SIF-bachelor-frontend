import { FilterOptions } from "../../content/components/types";

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