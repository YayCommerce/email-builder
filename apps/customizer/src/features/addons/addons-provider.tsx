import { createContext, useEffect, useMemo, useState } from 'react';
import useAddonQueries from './queries/useAddonQueries';

export interface IAddon {
  plugin_name: string;
  description: string;
  image: string;
  plugin_slug: string;
  link_upgrade: string;
  categories: string[];
  installation_status: {
    is_active: boolean;
    is_installed: boolean;
    plugin_file: string;
  };
}

export const AddonsContext = createContext<{
  filteredAddons: IAddon[];
  listingAddons: IAddon[];
  searchText: string;
  category: string;
  status: string;
  isFetching: boolean;
  setSearchText: (searchText: string) => void;
  setCategory: (category: string) => void;
  setStatus: (status: string) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  setCurrentPage: (currentPage: number) => void;
}>({
  filteredAddons: [],
  listingAddons: [],
  searchText: '',
  category: 'all',
  status: 'all',
  isFetching: false,
  setSearchText: (searchText: string) => {},
  setCategory: (category: string) => {},
  setStatus: (status: string) => {},
  currentPage: 1,
  totalPages: 0,
  totalItems: 0,
  setCurrentPage: (currentPage: number) => {},
});

const ITEMS_PER_PAGE = 18;

export default function AddonsProvider({ children }: { children: React.ReactNode }) {
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { isFetching, data } = useAddonQueries();

  const addons = useMemo(() => data ?? [], [data]);
  const filteredAddons = useMemo(() => {
    return (addons ?? []).filter((addon: IAddon) => {
      return (
        addon.plugin_name.toLowerCase().includes(searchText.toLowerCase().trim()) &&
        (category === 'all' || (addon?.categories ?? []).includes(category)) &&
        (status === 'all' || addon.installation_status.is_active === (status === 'active'))
      );
    });
  }, [addons, searchText, category, status]);

  const listingAddons = useMemo(() => {
    return filteredAddons.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }, [filteredAddons, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredAddons.length / ITEMS_PER_PAGE);
  }, [filteredAddons]);

  const totalItems = useMemo(() => {
    return filteredAddons.length;
  }, [filteredAddons]);

  const contextValue = useMemo(() => {
    return {
      filteredAddons,
      searchText,
      category,
      status,
      setSearchText,
      setCategory,
      setStatus,
      isFetching,
      currentPage,
      totalPages,
      totalItems,
      setCurrentPage,
      listingAddons,
    };
  }, [
    filteredAddons,
    searchText,
    category,
    status,
    isFetching,
    currentPage,
    totalPages,
    totalItems,
    listingAddons,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredAddons]);

  return <AddonsContext.Provider value={contextValue}>{children}</AddonsContext.Provider>;
}
