import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useQuestionnaire } from '@/app/context/QuestionnaireContext';
import { AgeRange } from '@/app/types/types';

const AgeSection: React.FC = () => {
    const { ageRange, setAgeRange } = useQuestionnaire();

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAge: string,
    ) => {
        if (newAge !== null) {
            setAgeRange(newAge);
        }
    };

    return (
        <ToggleButtonGroup
            value={ageRange}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
            className='w-full text-white'
        >
            {Object.values(AgeRange).map((range) => (
                <ToggleButton className='w-full text-white border-white' key={range} value={range}>{range}</ToggleButton>
            ))
            }

        </ToggleButtonGroup>
    );
};

export default AgeSection;