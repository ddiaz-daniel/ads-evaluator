import { Ad, TargetedAds } from '@/app/types/types';
import React from 'react';
import QuestionnaireDisplayAd from './QuestionnaireDisplayAd';

type QuestionComponentProps = {
    page: number;
    question: string;
    pageNumber: number;
    selectedAd: Ad;
};

const QuestionComponent = ({
    page,
    question,
    pageNumber,
    selectedAd,
}: QuestionComponentProps) => {

    const locale = localStorage.getItem('language') || 'en';

    return (
        <div className="my-4 h-full px-4">

            <QuestionnaireDisplayAd
                setup={selectedAd.setup.ads[0].data}
                images={selectedAd.images[0]}
                locale={locale as "en" | "es" | "fr" | "de" | "it" | "pt"}
            />

            <label htmlFor={`question${page}`} className="mb-1 block text-wrap text-justify px-4">
                {question}
            </label>
        </div>
    );
};

export default QuestionComponent;
