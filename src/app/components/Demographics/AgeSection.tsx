import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useQuestionnaire } from '@/app/context/QuestionnaireContext';
import { AgeRange } from '@/app/types/types';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { useState } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#544cc9',
    },
  },
});

const AgeSection: React.FC = () => {
  const { ageRange, setAgeRange } = useQuestionnaire();
  const [selectedAgeRange, setSelectedAgeRange] = useState(ageRange);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAge: string | null
  ) => {
    if (newAge !== null) {
      setAgeRange(newAge);
      setSelectedAgeRange(newAge);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <ToggleButtonGroup
        color="primary"
        value={selectedAgeRange}
        exclusive
        onChange={handleChange}
        aria-label="Age Range"
        fullWidth
      >
        <Grid container spacing={1}>
          {Object.values(AgeRange).map((ageRangeOption) => (
            <Grid item xs={12} sm={12} key={ageRangeOption}>
              <ToggleButton
                value={ageRangeOption}
                sx={{
                  border: 1,
                  borderColor: 'white',
                  color: 'white',
                  textTransform: 'capitalize',
                  flex: 1,
                  flexDirection: 'column',
                  height: '4rem',
                  width: '100%',
                }}
              >
                {ageRangeOption}
              </ToggleButton>
            </Grid>
          ))}
        </Grid>
      </ToggleButtonGroup>
    </ThemeProvider>
  );
};

export default AgeSection;
