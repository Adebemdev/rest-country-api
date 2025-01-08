import { useCountriesContext } from './countriesContext';

interface CountryProps {
  dark: boolean;
  code: string;
  name: string;
  capital?: string;
  population: number;
  flag: string;
  region: string;
  showDetails: (code: string) => void;
}

const Country = ({
  dark,
  code,
  name,
  capital,
  population,
  flag,
  region,
  showDetails,
}: CountryProps) => {
  const { dark: contextDark } = useCountriesContext();
  const isDark = dark || contextDark;

  const showDetailsHandler = () => {
    showDetails(code);
  };

  return (
    <div
      className={`${isDark ? 'dark' : ''} h-full w-full flex-1 transform rounded-lg shadow-md transition-transform hover:scale-105`}
      onClick={showDetailsHandler}
    >
      <img
        src={flag}
        alt={`Flag of ${name}`}
        className="h-1/2 w-full object-cover"
      />
      <div
        className={`${dark ? 'dark' : ''} dark:bg-dark-element text-dark-element dark:text-White bg-White h-1/2 w-full p-6`}
      >
        <h2 className="mb-4 text-2xl font-bold capitalize">{name}</h2>
        <div className="flex flex-col gap-1">
          <p>
            <strong>Population:</strong> {population.toLocaleString()}
          </p>
          <p>
            <strong>Region:</strong> {region}
          </p>
          {capital && (
            <p>
              <strong>Capital:</strong> {capital}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Country;
