'use client';
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  use,
} from 'react';

interface QuestionnaireData {
  // Define your data structure here
}

type ContextProps = {
  questionnaireData: QuestionnaireData[];
  addData: (data: QuestionnaireData) => void;
  changeLanguage: (language: string) => void;
  getLanguage: () => string;
  ageRange: string;
  setAgeRange: (ageRange: string) => void;
  gender: string;
  setGender: (gender: string) => void;
  country: string;
  setCountry: (country: string) => void;
  occupation: string;
  setOccupation: (occupation: string) => void;
  hobbies: string[];
  setHobbies: (hobbies: string[]) => void;
  id: string;
  setId: (id: string) => void;
};

const QuestionnaireContext = createContext<ContextProps | undefined>(undefined);

export const useQuestionnaire = () => {
  const context = useContext(QuestionnaireContext);
  if (context === undefined) {
    throw new Error(
      'useQuestionnaire must be used within a QuestionnaireProvider'
    );
  }
  return context;
};

interface Props {
  children: ReactNode;
}

const QuestionnaireProvider = ({ children }: Props) => {
  const [questionnaireData, setQuestionnaireData] = useState<
    QuestionnaireData[]
  >([]);
  const [ageRange, setAgeRange] = useState<string>('0-18');
  const [gender, setGender] = useState<string>('male');
  const [country, setCountry] = useState<string>('');
  const [occupation, setOccupation] = useState<string>('');
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [id, setId] = useState<string>('');

  const changeLanguage = (language: string) => {
    //save in lcoal storage
    localStorage.setItem('language', language);
  };

  const getLanguage = () => {
    if (localStorage) return localStorage.getItem('language') || 'en';
    else return 'en';
  };

  useEffect(() => {
    const savedData = JSON.parse(
      localStorage.getItem('questionnaireData') || '[]'
    );
    if (savedData) {
      setQuestionnaireData(savedData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'questionnaireData',
      JSON.stringify(questionnaireData)
    );
  }, [questionnaireData]);

  const addData = (data: QuestionnaireData) => {
    setQuestionnaireData((prevData) => [...prevData, data]);
  };

  const contextValue = {
    questionnaireData,
    addData,
    changeLanguage,
    getLanguage,
    ageRange,
    setAgeRange,
    gender,
    setGender,
    country,
    setCountry,
    occupation,
    setOccupation,
    hobbies,
    setHobbies,
    id,
    setId,
  };

  return (
    <QuestionnaireContext.Provider value={contextValue}>
      {children}
    </QuestionnaireContext.Provider>
  );
};

export { QuestionnaireProvider, QuestionnaireContext };
