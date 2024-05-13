/* Needed the type here because if not, we could get never[] arrays, which means that we wouldn't be able
     to add strings to these later which we don't want */
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

export interface SortState {
    orderBy: string;
    direction: "ascending" | "descending";
}

