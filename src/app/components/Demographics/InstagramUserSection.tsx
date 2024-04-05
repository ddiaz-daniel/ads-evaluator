import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useQuestionnaire } from '@/app/context/QuestionnaireContext';
import { AgeRange } from '@/app/types/types';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

const theme = createTheme({
    palette: {
        primary: {
            main: '#544cc9',
        },
    },
});

const InstagramUserSection: React.FC = () => {
    const { isInstagramUser, setIsInstagramUser } = useQuestionnaire();
    const t = useTranslations('demographics');

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        value: boolean
    ) => {
        setIsInstagramUser(value);
    };

    return (
        <ThemeProvider theme={theme}>
            <ToggleButtonGroup
                color="primary"
                value={isInstagramUser}
                exclusive
                onChange={handleChange}
                aria-label="Instagram User"
                fullWidth
            >
                <Grid container spacing={1}>
                    <Grid item xs={6} sm={6}>
                        <ToggleButton
                            value={true}
                            sx={{
                                border: 1,
                                borderColor: 'white',
                                color: 'white',
                                textTransform: 'capitalize',
                                flex: 1,
                                flexDirection: 'column',
                                height: '5rem',
                                width: '100%',
                            }}
                        >
                            {t('yes')}
                        </ToggleButton>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <ToggleButton
                            value={false}
                            sx={{
                                border: 1,
                                borderColor: 'white',
                                color: 'white',
                                textTransform: 'capitalize',
                                flex: 1,
                                flexDirection: 'column',
                                height: '5rem',
                                width: '100%',
                            }}
                        >
                            {t('no')}
                        </ToggleButton>
                    </Grid>
                </Grid>
            </ToggleButtonGroup>
        </ThemeProvider>
    );
};

export default InstagramUserSection;
