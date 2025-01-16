import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';

interface CountryData {
  name: string;
  official: string;
  flagImg: string;
  population: number;
  region: string;
  subregion: string;
  capital: string[];
  currencies: Record<string, Currency>;
  languages: Record<string, string>;
  borders?: string[];
}

interface Currency {
  name: string;
  symbol?: string;
}

interface CountryDetailsProps {
  dark?: boolean;
}

const initialCountryData: CountryData = {
  name: '',
  official: '',
  flagImg: '',
  population: 0,
  region: '',
  subregion: '',
  capital: [],
  currencies: {},
  languages: {},
  borders: [],
};

const useCountryData = (countryName: string) => {
  const [country, setCountry] = useState<CountryData>(initialCountryData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [borderCountries, setBorderCountries] = React.useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://restcountries.com/v3.1/name/${countryName}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch country data');
        }

        const [data] = await response.json();

        setCountry({
          name: data.name.common,
          official: data.name.official,
          flagImg: data.flags.png,
          population: data.population,
          region: data.region,
          subregion: data.subregion,
          capital: data.capital || [],
          currencies: data.currencies,
          languages: data.languages,
          borders: data.borders,
        });

        // Fetch border countries if they exist
        if (data.borders && data.borders.length > 0) {
          const borderPromises = data.borders.map(async (border: string) => {
            const borderResponse = await fetch(
              `https://restcountries.com/v3.1/alpha/${border}`
            );
            const [borderData] = await borderResponse.json();
            return { code: border, name: borderData.name.common };
          });
          const borderResults = await Promise.all(borderPromises);
          const borderMapping: Record<string, string> = {};
          borderResults.forEach(({ code, name }) => {
            borderMapping[code] = name;
          });
          setBorderCountries(borderMapping);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (countryName) {
      void fetchData();
    }
  }, [countryName]);

  return { country, loading, error, borderCountries };
};

const CountryDetails = ({ dark }: CountryDetailsProps) => {
  const navigate = useNavigate();
  const { countryName } = useParams<{ countryName: string }>();
  const { country, loading, error, borderCountries } = useCountryData(
    countryName ?? ''
  );

  const currencies = Object.values(country.currencies);
  const languages = Object.values(country.languages);

  const handleBorderClick = async (borderCode: string) => {
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/alpha/${borderCode}`
      );
      const [data] = await response.json();
      const borderCountryName = data.name.common;
      navigate(`/${encodeURIComponent(borderCountryName.toLowerCase())}`);
    } catch (error) {
      console.error('Error fetching border country:', error);
    }
  };

  if (loading) {
    return (
      <div
        className={`loading ${dark ? 'dark absolute inset-0 flex items-center justify-center bg-slate-200/20 text-3xl backdrop-blur-sm' : 'absolute inset-0 flex items-center justify-center bg-slate-200/20 text-3xl backdrop-blur-sm'}`}
      >
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className={`error ${dark ? 'dark' : ''}`}>{error}</div>;
  }

  return (
    <div
      className={`${
        dark ? 'bg-dark-blue-bg text-white' : 'bg-white text-gray-800'
      } container mx-auto flex max-h-screen flex-col gap-8 p-4 text-white`}
    >
      <div className="p-6">
        <button
          className={`${dark ? 'dark' : ''} flex items-center gap-2 rounded-md bg-very-light-gray px-8 py-2 text-black shadow-lg dark:text-very-light-gray`}
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <BsArrowLeft className="text-2xl" />
          Back
        </button>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 lg:flex-row lg:gap-12">
        <div className="md:w-full lg:w-3/4">
          <img
            src={country.flagImg}
            className="w-full"
            alt={`Flag of ${country.name}`}
          />
        </div>

        <div
          className={`${dark ? 'dark' : ''} w-full bg-very-light-gray p-4 dark:bg-dark-blue-bg`}
        >
          <div className="mb-4">
            <h1 className="text-2xl font-bold capitalize">{country.name}</h1>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
            <section className="flex flex-col gap-1 text-xl font-bold">
              <p className="">
                Official Name:{' '}
                <span className="text-lg font-normal">{country.official}</span>
              </p>
              <p>
                Population:{' '}
                <span className="text-lg font-normal">
                  {country.population.toLocaleString()}
                </span>
              </p>
              <p>
                Region:{' '}
                <span className="text-lg font-normal">{country.region}</span>
              </p>
              <p>
                Sub Region:{' '}
                <span className="text-lg font-normal">{country.subregion}</span>
              </p>
              <p>
                Capital:{' '}
                <span className="text-lg font-normal">
                  {country.capital.join(', ')}
                </span>
              </p>
            </section>

            <section className="flex flex-col gap-1 text-xl font-bold">
              <p>
                Currencies:{' '}
                <span className="text-lg font-normal">
                  {currencies.map((currency, index) => (
                    <React.Fragment key={currency.name}>
                      {currency.name}
                      {index < currencies.length - 1 ? ', ' : ''}
                    </React.Fragment>
                  ))}
                </span>
              </p>
              <p>
                Languages:{' '}
                <span className="text-lg font-normal">
                  {languages.map((language, index) => (
                    <React.Fragment key={language}>
                      {language}
                      {index < languages.length - 1 ? ', ' : ''}
                    </React.Fragment>
                  ))}
                </span>
              </p>
            </section>
          </div>

          {country.borders && country.borders.length > 0 && (
            <div className="mt-4">
              <p className="text-2xl font-bold">
                Border Countries:{' '}
                <div className="mt-2.5 flex flex-wrap gap-2.5 text-xl font-normal">
                  {country.borders.map((border) => (
                    <button
                      key={border}
                      className={`cursor-pointer rounded px-5 py-1.5 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-md ${
                        dark
                          ? 'bg-gray-700 text-white hover:shadow-gray-700/30'
                          : 'bg-white text-gray-800 hover:shadow-gray-200'
                      }`}
                      onClick={() => handleBorderClick(border)}
                    >
                      {borderCountries[border] || border}
                    </button>
                  ))}
                </div>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryDetails;
