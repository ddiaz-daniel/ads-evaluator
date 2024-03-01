import { useQuestionnaire } from '@/app/context/QuestionnaireContext';
import { GenderOptions } from '@/app/types/types';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useTranslations } from 'next-intl';

const GenderSection: React.FC = () => {
    const { gender, setGender } = useQuestionnaire();
    const t = useTranslations('demographics');
    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newGender: string,
    ) => {
        if (newGender !== null) {
            setGender(newGender);
        }
    };

    return (
        <ToggleButtonGroup
            value={gender}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
            className='w-full text-white'
        >
            {Object.values(GenderOptions).map((gender) => (
                <ToggleButton className='w-full text-white border-white capitalize' key={gender} value={gender}>{t(gender)}</ToggleButton>
            ))
            }

        </ToggleButtonGroup>
    );
};

export default GenderSection;