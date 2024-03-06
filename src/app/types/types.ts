export type LocaleType = {
    reason?: string | null;
    status?: string | null;
    value?: string | null;
    _response?: unknown;
};

export type CountryInfo = {
    code: string;
    name: string;
};

export type OccupationsInfo = {
    code: string;
    name: string;
};

export type HobbiesInfo = {
    code: string;
    name: string;
};

export enum GenderOptions {
    male = "male",
    female = "female",
    other = "other",
    preferNotToSay = "preferNotToSay",
}

export enum AgeRange {
    '0-18' = '0-18',
    '19-30' = '19-30',
    '31-50' = '31-50',
    '51-65' = '51-65',
    '66+' = '66+',
}

export type QuestionnaireData = {
    ageRange: string;
    gender: string;
    country: string;
    occupation: string;
    hobbies: string[];
};


