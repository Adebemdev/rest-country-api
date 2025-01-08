import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MdOutlineLightMode, MdOutlineDarkMode } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';

import Country from './Country';
import CountryDetails from './components/countryDetails/CountryDetails';
// import ScrollButton from './components/ScrollButton/ScrollButton';
import {
  CountriesProvider,
  useCountriesContext,
  Country as CountryType,
} from './countriesContext'; // Adjust path as needed

const App: React.FC = () => {
  return (
    <Router>
      <CountriesProvider>
        <AppContent />
      </CountriesProvider>
    </Router>
  );
};

const AppContent: React.FC = () => {
  const {
    countries,
    dark,
    loading,
    handleSearch,
    handleRegion,
    toggleDarkMode,
    showDetails,
  } = useCountriesContext();

  const noCountries = countries.length === 0;

  return (
    <div
      className={`min-h-screen ${dark ? 'dark' : ''} bg-very-light-gray dark:bg-dark-blue-bg`}
    >
      <header className="sticky top-0 z-50 bg-very-light-gray shadow-md dark:bg-dark-blue-bg dark:text-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-6">
          <h1 className="text-2xl font-bold">Where in the world?</h1>
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center space-x-2 text-dark-element dark:text-white"
          >
            {dark ? (
              <>
                <MdOutlineLightMode />
                <h2 className="font-bold">Light Mode</h2>
              </>
            ) : (
              <>
                <MdOutlineDarkMode />
                <h2 className="font-bold">Dark Mode</h2>
              </>
            )}
          </button>
        </div>
      </header>
      <Routes>
        <Route
          path="/"
          element={
            loading ? (
              <div className={`${dark ? 'dark' : ''}`}>Loading . . .</div>
            ) : (
              <>
                <div className="">
                  <section className="container mx-auto px-4">
                    <section
                      className={`relative flex items-center py-6 md:w-1/3`}
                    >
                      <input
                        onChange={handleSearch}
                        type="text"
                        placeholder="Search for a country..."
                        className="w-full rounded-md py-2.5 pl-20 pr-4 text-xl shadow-md dark:bg-dark-blue-bg"
                      />
                      <AiOutlineSearch className="absolute left-10 top-1/2 h-8 w-8 -translate-y-1/2 transform p-1 text-gray-400" />
                    </section>
                    <form
                      onSubmit={(e) => e.preventDefault()}
                      className={`${dark ? 'dark' : ''} `}
                    >
                      <select
                        name="region"
                        onChange={handleRegion}
                        className={`${dark ? 'dark' : ''} m-4 mb-8 w-2/3 rounded-md bg-white p-1 px-4 py-4 shadow-md dark:bg-dark-blue-bg dark:text-white`}
                      >
                        <option value="">Fiter by Region</option>
                        <option value="All">All</option>
                        <option value="Asia">Asia</option>
                        <option value="Africa">Africa</option>
                        <option value="America">America</option>
                        <option value="Europe">Europe</option>
                        <option value="Oceania">Oceania</option>
                      </select>
                    </form>
                  </section>
                  <section
                    className={`${dark ? 'dark' : ''}bg-very-light-gray container mx-auto grid grid-cols-1 gap-8 px-8 dark:bg-dark-blue-bg md:grid-cols-2 lg:grid-cols-4`}
                  >
                    {!noCountries ? (
                      countries.map((country: CountryType, index: number) => (
                        <Country
                          dark={dark}
                          key={index}
                          code={country.name.common}
                          name={country.name.common}
                          capital={country.capital?.[0]}
                          population={country.population}
                          flag={country.flags.png}
                          region={country.region}
                          showDetails={showDetails}
                        />
                      ))
                    ) : (
                      <p>No Countries Found</p>
                    )}
                  </section>
                </div>
              </>
            )
          }
        />
        <Route path="/:countryName" element={<CountryDetails />} />
      </Routes>
      {/* <ScrollButton /> */}
    </div>
  );
};

export default App;
