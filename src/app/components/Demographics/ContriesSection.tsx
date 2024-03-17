import { useQuestionnaire } from '@/app/context/QuestionnaireContext';
import { useTranslations } from 'next-intl';
import { useState, useEffect, Suspense } from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';
import Image from 'next/image';
import { CountryInfo } from '@/app/types/types';
import { generateCountryInfo } from '@/app/types/countries';

interface OptionProps extends React.HTMLAttributes<HTMLLIElement> {
  key?: string;
}

const CountriesSection = () => {
  const t = useTranslations('demographics');
  const { getLanguage, setCountry, country } = useQuestionnaire();
  const [listOfCountries, setListOfCountries] = useState<CountryInfo[]>([]);

  const handleCountryChange = (newValue: CountryInfo) => {
    if (newValue) {
      setCountry(newValue.code);
    } else {
      setCountry('');
    }
  };

  useEffect(() => {
    const getListOfCountries = async () => {
      const language = await getLanguage();
      const listOfCountries = await generateCountryInfo(language);
      setListOfCountries(listOfCountries);
    };
    getListOfCountries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Suspense fallback="Loading...">
      <Autocomplete
        id="country-select-demo"
        className="b-0 m-0 w-full rounded p-0"
        options={listOfCountries}
        autoHighlight
        getOptionLabel={(option) => option.name}
        onChange={(event, newValue) =>
          handleCountryChange(newValue as CountryInfo)
        }
        renderOption={(props, option) => {
          const { key, ...rest } = props as OptionProps;
          return (
            <Box
              key={'key-' + option.code}
              component="li"
              sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
              {...rest}
              value={option.code}
            >
              <Image
                className="h-auto w-[25px]"
                width={40}
                height={40}
                loading="lazy"
                src={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png`}
                alt={`${option.name} Flag`}
              />
              {option.name}
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            className="m-0 mb-1 mt-0 w-full rounded bg-white"
            {...params}
            variant="outlined"
            margin="normal"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password',
            }}
          />
        )}
      />
    </Suspense>
  );
};

export default CountriesSection;
