import React from 'react';
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
  const [country, setCountry] = React.useState<CountryData>(initialCountryData);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
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

  return { country, loading, error };
};

const CountryDetails: React.FC<CountryDetailsProps> = ({ dark }) => {
  const navigate = useNavigate();
  const { countryName } = useParams<{ countryName: string }>();
  const { country, loading, error } = useCountryData(countryName ?? '');

  const currencies = Object.values(country.currencies);
  const languages = Object.values(country.languages);

  if (loading) {
    return <div className={`loading ${dark ? 'dark' : ''}`}>Loading...</div>;
  }

  if (error) {
    return <div className={`error ${dark ? 'dark' : ''}`}>{error}</div>;
  }

  return (
    <div className={`country-details ${dark ? 'dark' : ''}`}>
      <button
        className={`back-btn ${dark ? 'dark' : ''}`}
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        <BsArrowLeft />
        Back
      </button>

      <div className="country-details-body">
        <div className="img-container">
          <img src={country.flagImg} alt={`Flag of ${country.name}`} />
        </div>

        <div className="country-details-content">
          <div className="country-details-name">
            <h1>{country.name}</h1>
          </div>

          <div className="country-details-info">
            <section>
              <p>
                Official Name: <span>{country.official}</span>
              </p>
              <p>
                Population: <span>{country.population.toLocaleString()}</span>
              </p>
              <p>
                Region: <span>{country.region}</span>
              </p>
              <p>
                Sub Region: <span>{country.subregion}</span>
              </p>
              <p>
                Capital: <span>{country.capital.join(', ')}</span>
              </p>
            </section>

            <section>
              <p>
                Currencies:{' '}
                <span>
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
                <span>
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
            <div className="country-borders">
              <p>
                Borders:{' '}
                {country.borders.map((border) => (
                  <span key={border} className="border-tag">
                    {border}
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryDetails;
