import { useQuestionnaire } from '@/app/context/QuestionnaireContext';
import { useTranslations } from 'next-intl';
import { useState, useEffect, Suspense } from 'react';
import { Autocomplete, Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { OccupationsInfo } from '@/app/types/types';
import { generateOccupationsInfo } from '@/app/types/occupations';
import { list } from 'firebase/storage';

interface OptionProps extends React.HTMLAttributes<HTMLLIElement> {
  key?: string;
}

const OccupationsSection = () => {
  const t = useTranslations('demographics');
  const { getLanguage, setOccupation, occupation } = useQuestionnaire();
  const [listOfOccupations, setListOfOccupations] = useState<OccupationsInfo[]>(
    []
  );

  const handleOccupationChange = (value: string) => {
    setOccupation(value);
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
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label" className='bg-white'></InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={occupation}
          sx={{ backgroundColor: 'white' }}
          onChange={(event) => handleOccupationChange(event.target.value as string)}
        >
          {listOfOccupations.map((occupation) => (
            <MenuItem key={occupation.code} value={occupation.code}>
              {occupation.name}
            </MenuItem>
          ))}

        </Select>
      </FormControl>
    </Suspense>
  );
};

export default OccupationsSection;
