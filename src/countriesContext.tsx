import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Country Type Definition
export interface Country {
  name: {
    common: string;
    official: string;
  };
  capital?: string[];
  population: number;
  region: string;
  flags: {
    png: string;
    svg: string;
  };
  status: number;
}

interface CountriesContextType {
  countries: Country[];
  setCountries: React.Dispatch<React.SetStateAction<Country[]>>;
  dark: boolean;
  loading: boolean;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRegion: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  toggleDarkMode: () => void;
  showDetails: (code: string) => void;
}

interface CountriesProviderProps {
  children: React.ReactNode;
}

// Create the context with a more specific type
const CountriesContext = createContext<CountriesContextType | undefined>(
  undefined
);

// Context Provider Component
export const CountriesProvider = ({ children }: CountriesProviderProps) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [dark, setDark] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const url = 'https://restcountries.com/v3.1/all';

  // Fetch all countries
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url);
      const data: Country[] = await response.json();
      setCountries(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching countries:', error);
      setLoading(false);
    }
  };

  // Search countries by name
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let name = e.target.value.replace(/[^A-Za-z]/g, '');
    if (name) {
      try {
        const fetchData = await fetch(
          `https://restcountries.com/v3.1/name/${name}`
        );
        const response: Country[] = await fetchData.json();

        if (!response.some((item) => item.status === 404)) {
          setCountries(response);
        }
      } catch (error) {
        console.error('Error searching countries:', error);
      }
    }
  };

  // Filter countries by region
  const handleRegion = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLoading(true);
    const region = e.target.value;

    if (region !== 'All') {
      try {
        const fetchData = await fetch(
          `https://restcountries.com/v3.1/region/${region}`
        );
        const response: Country[] = await fetchData.json();

        if (!response.some((item) => item.status === 404)) {
          setCountries(response);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error filtering countries:', error);
        setLoading(false);
      }
    } else {
      fetchData();
    }
  };

  // Show country details
  const showDetails = (code: string) => {
    // return code;
    navigate(`/${code}`);
  };

  // Toggle dark mode
  useEffect(() => {
    // Check if user prefers dark mode
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    // Check for saved preference
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  const toggleDarkMode = () => {
    setDark(!dark);
    // Toggle dark class on html element
    document.documentElement.classList.toggle('dark');
    // Save preference
    localStorage.setItem('theme', !dark ? 'dark' : 'light');
  };

  // Context value
  const contextValue: CountriesContextType = {
    countries,
    setCountries,
    dark,
    loading,
    handleSearch,
    handleRegion,
    toggleDarkMode,
    showDetails,
  };

  return (
    <CountriesContext.Provider value={contextValue}>
      {children}
    </CountriesContext.Provider>
  );
};

// Custom hook to use the context
export const useCountriesContext = () => {
  const context = useContext(CountriesContext);
  if (!context) {
    throw new Error(
      'useCountriesContext must be used within a CountriesProvider'
    );
  }
  return context;
};
