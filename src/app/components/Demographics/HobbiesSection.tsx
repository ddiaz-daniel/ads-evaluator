import { useQuestionnaire } from "@/app/context/QuestionnaireContext";
import { generateOccupationsInfo } from "@/app/types/occupations";
import { HobbiesInfo } from "@/app/types/types";
import { Autocomplete, Box, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface OptionProps extends React.HTMLAttributes<HTMLLIElement> {
    key?: string;
}

const HobbiesSection = () => {
    const t = useTranslations('hobbies');
    const { getLanguage, setHobbies } = useQuestionnaire();
    const [listOfOccupations, setListOfOccupations] = useState<HobbiesInfo[]>([]);

    const handleHobbiesChange = (newValue: HobbiesInfo) => {
        console.log(newValue);
        //setHobbies(newValue.code);
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
        <Autocomplete
            id='occupation-select-demo'
            className='m-0 p-0 b-0 w-full rounded'
            options={listOfOccupations}
            autoHighlight
            getOptionLabel={option => option.name}
            onChange={(event, newValue) => handleHobbiesChange(newValue as HobbiesInfo)}
            renderOption={(props, option) => {
                const { key, ...rest } = props as OptionProps;
                return (
                    <Box
                        key={'key-' + option.code}
                        component='li'
                        sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                        {...rest}
                        value={option.code}
                    >
                        {option.name}
                    </Box>

                );
            }}
            renderInput={params => (
                <TextField
                    className='m-0 mb-1 mt-0 bg-white w-full rounded'
                    {...params}
                    variant='outlined'
                    margin='normal'
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password',
                    }}

                />
            )}
        />
    );
};
export default HobbiesSection;