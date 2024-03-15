import { useQuestionnaire } from '@/app/context/QuestionnaireContext';
import { generateHobbiesInfo } from '@/app/types/hobbies';
import { HobbiesInfo } from '@/app/types/types';
import { Grid, IconButton } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import { useState, useEffect } from 'react';

const theme = createTheme({
    palette: {
        primary: {
            main: "#544cc9",
        },
    },
});

const HobbiesSection: React.FC = () => {
    const { getLanguage, setHobbies } = useQuestionnaire();
    const [listOfHobbies, setListOfHobbies] = useState<HobbiesInfo[]>([]);
    const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);

    useEffect(() => {
        const getListOfHobbies = async () => {
            const language = await getLanguage();
            const hobbies = await generateHobbiesInfo(language);
            setListOfHobbies(hobbies);
        };
        getListOfHobbies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleHobbyToggle = (hobbyCode: string) => {
        setSelectedHobbies(prevSelected => {
            if (prevSelected.includes(hobbyCode)) {
                return prevSelected.filter(code => code !== hobbyCode);
            } else {
                return [...prevSelected, hobbyCode];
            }
        });
    };

    useEffect(() => {
        setHobbies(selectedHobbies);
    }, [selectedHobbies, setHobbies]);

    return (
        <ThemeProvider theme={theme}>
            <Grid container spacing={1}>
                {listOfHobbies.map(hobby => (
                    <Grid item xs={false} sm={false} key={hobby.code}>
                        <ToggleButton
                            value={hobby.code}
                            onClick={() => handleHobbyToggle(hobby.code)}
                            selected={selectedHobbies.includes(hobby.code)}
                            color='primary'
                            sx={{
                                border: 1,
                                borderColor: 'white',
                                color: 'white',
                                textTransform: 'capitalize',
                                flex: 1,
                                flexDirection: 'column',
                                width: '100%',
                                height: '2.5rem',
                                justifySelf: 'center',
                            }}
                        >
                            {hobby.name}
                        </ToggleButton>
                    </Grid>
                ))}
            </Grid>
        </ThemeProvider>
    );
};

export default HobbiesSection;
