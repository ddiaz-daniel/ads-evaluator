"use client";
import React, { createContext, useState, useEffect, ReactNode, useContext, use } from 'react';

interface QuestionnaireData {
    // Define your data structure here
}

interface ContextProps {
    questionnaireData: QuestionnaireData[];
    addData: (data: QuestionnaireData) => void;
}

const QuestionnaireContext = createContext<ContextProps>({
    questionnaireData: [],
    addData: () => { },
});

export const useQuestionnaire = () => {
    const context = useContext(QuestionnaireContext);
    if (context === undefined) {
        throw new Error('useQuestionnaire must be used within a QuestionnaireProvider');
    }
    return context;
};

interface Props {
    children: ReactNode;
}

const QuestionnaireProvider = ({ children }: Props) => {
    const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData[]>([]);

    useEffect(() => {
        // Load data from local storage on component mount
        const savedData = JSON.parse(localStorage.getItem('questionnaireData') || '[]');
        if (savedData) {
            setQuestionnaireData(savedData);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('questionnaireData', JSON.stringify(questionnaireData));
    }, [questionnaireData]);

    const addData = (data: QuestionnaireData) => {
        setQuestionnaireData(prevData => [...prevData, data]);
    };

    const contextValue = {
        questionnaireData,
        addData,
    };

    return (
        <QuestionnaireContext.Provider value={contextValue}>
            {children}
        </QuestionnaireContext.Provider>
    );
};

export { QuestionnaireProvider, QuestionnaireContext };
