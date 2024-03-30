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
        <div className="mb-4 h-full px-4">
            <h1 className="my-4 w-full border-b-2 border-dashed border-white/50 pb-4 text-4xl justify-end flex items-end">
                <span className="text-4xl text-secondary">{pageNumber + 1}</span>
                <span className="text-2xl">/12</span>
            </h1>
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
