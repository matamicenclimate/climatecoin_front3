import { createContext, useContext, useEffect, useState } from 'react';

const maxItemsPerPage = 8;
const maxPagesToDisplay = 5;

interface Context {
  currentPage: number,
  firstIndex: number,
  totalItems: number,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
  setFirstIndex: React.Dispatch<React.SetStateAction<number>>,
  setTotalItems: React.Dispatch<React.SetStateAction<number>>,
}

const PaginationContext = createContext<Context | null>(null);

interface ProviderProps {
  children: React.ReactNode;
}

export const PaginationProvider = ({ children }: ProviderProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [firstIndex, setFirstIndex] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);

  useEffect(() => {
    const newFirstIndex = ((currentPage - 1) * maxItemsPerPage);
    setFirstIndex(newFirstIndex);
  }, [currentPage]);

  return (
    <PaginationContext.Provider value={{ currentPage, setCurrentPage, firstIndex, setFirstIndex, totalItems, setTotalItems }}>
      {children}
    </PaginationContext.Provider>
  );
};

export const usePaginationContext = () => {
  const ctx = useContext(PaginationContext);
  if (!ctx) {
    throw new Error('usePaginationContext must be used within a PaginationContextProvider');
  }

  const { currentPage, setCurrentPage, firstIndex, totalItems, setTotalItems } = ctx;

  return { currentPage, setCurrentPage, firstIndex, maxItemsPerPage, maxPagesToDisplay, totalItems, setTotalItems };
};
