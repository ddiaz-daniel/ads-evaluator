import { HobbiesInfo } from "./types";

export const generateHobbiesInfo = (language: string): HobbiesInfo[] => {
    // Map of country names in different languages
    const hobbiesNames: Record<string, Record<string, string>> = {
        en: {

        },
        es: {

        },
        de: {

        },
        fr: {

        },
        it: {

        },
        pt: {

        },
    };


    const hobbies: HobbiesInfo[] = [];

    Object.keys(hobbiesNames.en).forEach(code => {
        const name = hobbiesNames[language]?.[code] || "Unknown";
        hobbies.push({ code, name });
    });

    return hobbies;
};