import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MdOutlineLightMode, MdOutlineDarkMode } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';

import Country from './Country';
import CountryDetails from './components/countryDetails/CountryDetails';
import ScrollButton from './components/scrollButton/scrollButton';
import {
  CountriesProvider,
  useCountriesContext,
  Country as CountryType,
} from './countriesContext'; // Adjust path as needed

const App = () => {
  return (
    <Router>
      <CountriesProvider>
        <AppContent />
      </CountriesProvider>
    </Router>
  );
};

const AppContent = () => {
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
      className={`${dark ? 'dark' : ''} min-h-screen w-full overflow-hidden bg-very-light-gray dark:bg-dark-blue-bg`}
    >
      <header className="sticky top-0 z-50 w-full bg-very-light-gray shadow-md dark:bg-dark-blue-bg dark:text-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-6">
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
              <div
                className={`${dark ? 'dark absolute inset-0 flex items-center justify-center bg-slate-200/20 text-3xl backdrop-blur-sm' : 'absolute inset-0 flex items-center justify-center bg-slate-200/20 text-3xl backdrop-blur-sm'}`}
              >
                Loading . . .
              </div>
            ) : (
              <>
                <div className="">
                  <section className="mx-auto mb-8 w-full max-w-7xl items-center justify-between px-4 md:flex">
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
                      <div className="">
                        <select
                          name="region"
                          onChange={handleRegion}
                          className={`${dark ? 'dark' : ''} w-2/3 rounded-md border-r-[16px] border-r-transparent bg-white px-8 py-4 pl-3 pr-9 shadow-md dark:bg-dark-blue-bg dark:text-white md:w-full`}
                        >
                          <option value="Fiter by Region">
                            Fiter by Region
                          </option>
                          <option value="All">All</option>
                          <option value="Africa">Africa</option>
                          <option value="America">America</option>
                          <option value="Asia">Asia</option>
                          <option value="Europe">Europe</option>
                          <option value="Oceania">Oceania</option>
                        </select>
                      </div>
                    </form>
                  </section>
                  <section
                    className={`${dark ? 'dark' : ''} mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 bg-very-light-gray px-4 dark:bg-dark-blue-bg sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8`}
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
        <Route path="/:countryName" element={<CountryDetails dark={dark} />} />
      </Routes>
      <div>
        <ScrollButton />
      </div>
    </div>
  );
};

export default App;
