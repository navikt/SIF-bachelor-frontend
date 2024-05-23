import { useState } from 'react';

interface SortState {
    orderBy: string;
    direction: 'ascending' | 'descending';
}

const useSort = <T,>() => {
    const [sort, setSort] = useState<SortState | undefined>(undefined);

    const handleSort = (sortKey: string | undefined) => {
        setSort(prevSort =>
            sortKey === undefined ? undefined :
            prevSort && sortKey === prevSort.orderBy && prevSort.direction === "descending"
            ? undefined
            : {
                orderBy: sortKey,
                direction: prevSort && sortKey === prevSort.orderBy && prevSort.direction === "ascending" ? "descending" : "ascending",
            }
        );
    };

    const sortedData = (data: T[], comparator: (a: T, b: T, orderBy: keyof T) => number) => {
        return Array.isArray(data) ? data.slice().sort((a, b) => {
            if (!sort) return 0;
            return sort.direction === "descending"
                ? comparator(b, a, sort.orderBy as keyof T)
                : comparator(a, b, sort.orderBy as keyof T);
        }) : [];
    };

    return { sort, handleSort, sortedData };
};

export default useSort;
