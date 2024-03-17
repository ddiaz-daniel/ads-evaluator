import { useQuestionnaire } from '@/app/context/QuestionnaireContext';
import { useTranslations } from 'next-intl';
import { useState, useEffect, Suspense } from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';
import { OccupationsInfo } from '@/app/types/types';
import { generateOccupationsInfo } from '@/app/types/occupations';

interface OptionProps extends React.HTMLAttributes<HTMLLIElement> {
  key?: string;
}

const OccupationsSection = () => {
  const t = useTranslations('demographics');
  const { getLanguage, setOccupation } = useQuestionnaire();
  const [listOfOccupations, setListOfOccupations] = useState<OccupationsInfo[]>(
    []
  );

  const handleOccupationChange = (newValue: OccupationsInfo) => {
    setOccupation(newValue.code);
  };

  useEffect(() => {
    const getListOfOccupations = async () => {
      const language = await getLanguage();
      const listOfOccupations = await generateOccupationsInfo(language);
      setListOfOccupations(listOfOccupations);
    };
    getListOfOccupations();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Suspense fallback="Loading...">
      <Autocomplete
        id="occupation-select-demo"
        className="b-0 m-0 w-full rounded p-0"
        options={listOfOccupations}
        autoHighlight
        getOptionLabel={(option) => option.name}
        onChange={(event, newValue) =>
          handleOccupationChange(newValue as OccupationsInfo)
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

export default OccupationsSection;
