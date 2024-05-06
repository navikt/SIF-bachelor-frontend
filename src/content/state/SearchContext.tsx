import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Journalpost } from '../components/types'; // Adjust the import path as needed

interface SearchContextType {
    journalpostList: Journalpost[];
    setJournalpostList: React.Dispatch<React.SetStateAction<Journalpost[]>>;
    selectedJournalpostId: string | null;
    setSelectedJournalpostId: React.Dispatch<React.SetStateAction<string | null>>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface ProviderProps {
    children: ReactNode;
}

export const SearchProvider = ({ children }: ProviderProps) => {
    const [journalpostList, setJournalpostList] = useState<Journalpost[]>([]);
    const [selectedJournalpostId, setSelectedJournalpostId] = useState<string | null>(null);

    const value = {
        journalpostList,
        setJournalpostList,
        selectedJournalpostId,
        setSelectedJournalpostId
    };

    return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};
