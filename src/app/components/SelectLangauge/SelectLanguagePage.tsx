'use client';

import { FC } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from '@/app/utils/navigation/navigation';

type SelectLanguagePageProps = {
    intl: {
        english: string;
        german: string;
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

    return (
        <div className=" grid h-full grid-cols-2 place-content-center space-x-4">
            <button
                onClick={() => handleChange('en')}
                className="col-span-1 flex w-full flex-col place-content-center items-center space-y-2 py-1"
            >
                <Image
                    src="/uk-flag.svg"
                    alt="English"
                    width={500}
                    height={500}
                    className="flex h-20 w-32 place-self-center self-center rounded object-cover object-center"
                />
                <h1 className="text-center text-white">{intl.english}</h1>
            </button>
            <button
                onClick={() => handleChange('de')}
                className="col-span-1 flex w-full flex-col place-content-center items-center space-y-2 py-1"
            >
                <Image
                    src="/austria-flag.svg"
                    alt="German"
                    width={500}
                    height={500}
                    className="col-span-1 flex h-20 w-32 place-self-center self-center rounded object-cover object-center"
                />
                <h1 className="text-center text-white">{intl.german}</h1>
            </button>
        </div>
    );
};

export default SelectLanguagePage;
