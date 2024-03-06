import { useQuestionnaire } from '@/app/context/QuestionnaireContext';
import { GenderOptions } from '@/app/types/types';
import { useTranslations } from 'next-intl';
import { Grid, IconButton } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useState } from 'react';
import { FaMale, FaFemale, FaTransgender, FaGenderless } from 'react-icons/fa';

const theme = createTheme({
    palette: {
        primary: {
            main: "#544cc9",
        },

    },
});

const GenderSection: React.FC = () => {
    const { gender, setGender } = useQuestionnaire();
    const t = useTranslations('demographics');
    const [selectedGender, setSelectedGender] = useState(gender); // State to track selected gender

    const handleGenderChange = (event: React.MouseEvent<HTMLElement>, newGender: string) => {
        if (newGender !== null) {
            setSelectedGender(newGender);
            setGender(newGender);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <ToggleButtonGroup
                color='primary'
                value={selectedGender}
                exclusive
                onChange={handleGenderChange}
                aria-label="Gender"
            >
                <Grid container spacing={1}>
                    {Object.values(GenderOptions).map((genderOption) => (
                        <Grid item xs={6} sm={3} key={genderOption}>
                            <ToggleButton
                                value={genderOption}
                                sx={{
                                    border: 1, borderColor: 'white',
                                    color: 'white', textTransform: "capitalize",
                                    flex: 1, flexDirection: "column",
                                    width: "10rem", height: "10rem",
                                }}
                            >
                                {/* Render icon inside the button based on gender */}
                                {genderOption === 'male' && <FaMale size={30} />}
                                {genderOption === 'female' && <FaFemale size={30} />}
                                {genderOption === 'preferNotToSay' && <FaTransgender size={30} />}
                                {genderOption === 'other' && <FaGenderless size={30} />}
                                {t(genderOption)}
                            </ToggleButton>
                        </Grid>
                    ))}
                </Grid>
            </ToggleButtonGroup>
        </ThemeProvider>
    );
};

export default GenderSection;
