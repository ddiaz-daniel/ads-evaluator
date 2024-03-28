export type DalleStyle = 'vivid' | 'natural' | null;

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
  male = 'male',
  female = 'female',
  other = 'other',
  preferNotToSay = 'preferNotToSay',
}

export enum AgeRange {
  '0-18' = '0-18',
  '19-30' = '19-30',
  '31-50' = '31-50',
  '51-65' = '51-65',
  '66+' = '66+',
}

export type QuestionnaireData = {
  id: string;
  ageRange: string;
  gender: string;
  country: string;
  occupation: string;
  hobbies: string[];
};

export type Ad = {
  id: string;
  persona: Persona;
  images: string[];
  setup: ListOfTargetedAds;
};

export type Persona = {
  name: string;
  age: number;
  gender: string;
  background: string;
  photo?: string;
  appearance: {
    style: string;
    hair: string;
    eyes: string;
  };
  occupation: string;
  social_media: {
    platform: string;
    handle: string;
    followers: number;
  };
  personality: {
    traits: string[];
    strengths: string[];
    interests: string[];
  };
  hobbies: string[];
  values: string[];
  background_story: string;
  colors?: Color[];
};

type Color = {
  name: string;
  hex: string;
};

export type ListOfTargetedAds = {
  ads: {
    name: string;
    size: size;
    data: AdComponents;
  }[];
};

type size = {
  width: number;
  height: number;
};

export type AdComponents = {
  logo: Logo;
  text: AdText[];
  image: Image;
  post_caption?: string;
  footer?: InstagramFooter;
};

type Logo = {
  position: string;
  size: size;
  angle: number;
  image: string;
  noLogo?: boolean;
};

export type AdText = {
  position: Position;
  fontSize: number;
  content: string;
  font: string;
  color: string;
  style: string;
  weight: string;
  align: string;
  lineHeight: number;
  letterSpacing: number;
  background_color: string;
  background_opacity: number;
  width?: number;
};

export type Position = {
  x: number;
  y: number;
};

export type Image = {
  position: Position;
  size?: size;
  objectPosition: string;
  isBackground?: boolean;
  dalle_description: string;
  style: DalleStyle;
  solid_color?: string;
};

export type InstagramFooter = {
  content: string;
  color: string;
  background_color: string;
};

export type RealAdLabels = {
  position: Position;
  fontSize: number;
  fontWeight?: number;
  text:
  {
    en: string;
    fr: string;
    de: string;
    es: string;
    pt: string;
    it: string;
  };
};

export type RealSetup = {
  description: {
    en: string;
    fr: string;
    de: string;
    es: string;
    pt: string;
    it: string;
  };
  labels: RealAdLabels[];
  footer: {
    en: string;
    fr: string;
    de: string;
    es: string;
    pt: string;
    it: string;
  };
};

export type RealAd = {
  id: string;
  image: string;
  origin: "real";
  setup: RealSetup;
};

