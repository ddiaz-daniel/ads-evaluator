'use client';

import { FC } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from '@/app/utils/navigation/navigation';
import { useQuestionnaire } from '@/app/context/QuestionnaireContext';
import { getLocale } from 'next-intl/server';

type SelectLanguagePageProps = {
    intl: {
        english: string;
        german: string;
        spanish: string;
        italian: string;
        french: string;
        portuguese: string;
    };
};

const SelectLanguagePage: FC<SelectLanguagePageProps> = ({ intl }) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleChange = async (lang: string) => {
        if (router) {
            await router.replace(pathname, { locale: lang });
        }
    };

    const buttonStyle = "col-span-1 flex w-full flex-col place-content-center items-center mb-8";
    const imageStyle = "flex h-20 w-32 place-self-center self-center rounded object-cover object-center";
    const textStyle = "text-center text-white pt-2";

    return (
        <div className="grid grid-cols-2 place-content-center">
            <button
                onClick={() => handleChange('en')}
                className={buttonStyle}
            >
                <Image
                    src="/uk-flag.svg"
                    alt="English"
                    width={500}
                    height={500}
                    className={imageStyle}
                />
                <h1 className={textStyle}>{intl.english}</h1>
            </button>
            <button
                onClick={() => handleChange('de')}
                className={buttonStyle}
            >
                <Image
                    src="/austria-flag.svg"
                    alt="German"
                    width={500}
                    height={500}
                    className={imageStyle}
                />
                <h1 className={textStyle}>{intl.german}</h1>
            </button>
            <button
                onClick={() => handleChange('es')}
                className={buttonStyle}
            >
                <Image
                    src="/spain-flag.svg"
                    alt="Spanish"
                    width={500}
                    height={500}
                    className={imageStyle}
                />
                <h1 className={textStyle}>{intl.spanish}</h1>
            </button>
            <button
                onClick={() => handleChange('it')}
                className={buttonStyle}
            >
                <Image
                    src="/italy-flag.svg"
                    alt="Italian"
                    width={500}
                    height={500}
                    className={imageStyle}
                />
                <h1 className={textStyle}>{intl.italian}</h1>
            </button>
            <button
                onClick={() => handleChange('fr')}
                className={buttonStyle}
            >
                <Image
                    src="/france-flag.svg"
                    alt="Frensh"
                    width={500}
                    height={500}
                    className={imageStyle}
                />
                <h1 className={textStyle}>{intl.french}</h1>
            </button>
            <button
                onClick={() => handleChange('pt')}
                className={buttonStyle}
            >
                <Image
                    src="/brazil-flag.svg"
                    alt="Portuguese"
                    width={100}
                    height={100}
                    className={imageStyle}
                />
                <h1 className={textStyle}>{intl.portuguese}</h1>
            </button>
        </div>
    );
};

export default SelectLanguagePage;
