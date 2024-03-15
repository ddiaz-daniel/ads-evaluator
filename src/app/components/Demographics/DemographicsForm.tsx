"use client";
import { useTranslations } from 'next-intl';
import AgeSection from './AgeSection';
import GenderSection from './GenderSection';
import CountriesSection from './ContriesSection';
import OccupationsSection from './OccupationsSection';
import { useEffect, useState } from 'react';
import HobbiesSection from './HobbiesSection';
import { useQuestionnaire } from '@/app/context/QuestionnaireContext';
import { v1 as uuidv1 } from 'uuid';
import { QuestionnaireData } from '@/app/types/types';
import { createNewProfile, getProfileById } from '@/app/utils/firebase/funtions';
import { useRouter } from '@/app/utils/navigation/navigation';


const DemographicsForm = () => {
    const [page, setPage] = useState(0);
    const { ageRange, gender, country, occupation, hobbies, id, setId } = useQuestionnaire();
    const t = useTranslations('demographics');
    const route = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const profile: QuestionnaireData = {
            id,
            ageRange,
            gender,
            country,
            occupation,
            hobbies,
        };
        await createNewProfile(id, profile).then(() => {
            route.push('/ai-or-real');
        });
    };

    const handleBack = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        setPage(page + 1);
    };

    const checkIdValidity = () => {
        const id = localStorage.getItem('questionnaire-id');
        if (!id) {
            return false;
        }
        if (id === 'undefined') {
            return false;
        }
        if (id === '') {
            return false;
        }
        return true;
    };

    const createId = () => {
        const newId = uuidv1();
        localStorage.setItem('questionnaire-id', newId);
        setId(newId);
    };

    useEffect(() => {
        if (!checkIdValidity()) {
            createId();
        }
        else {
            const oldId = localStorage.getItem('questionnaire-id');
            if (oldId === null) {
                createId();
                return;
            }
            setId(oldId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto relative h-full min-h-screen pt-8">
            {page !== 0 &&
                <button type="button" className="absolute top-3 text-2xl" onClick={handleBack}>
                    {"<-"}
                </button>
            }
            {page === 0 && (
                <div className="mb-4 h-full">
                    <h1 className="text-4xl w-full my-8 pb-4 border-b-2 border-white/50 border-dashed">
                        <span className="text-4xl text-secondary">{page}</span>
                        <span className="text-2xl">/4</span>
                    </h1>
                    <label htmlFor="gender" className="block mb-1 pb-8 text-2xl">{t("gender")}</label>

                    <GenderSection />
                </div>
            )}

            {page === 1 && (
                <div className="mb-4">
                    <h1 className="text-4xl w-full my-8 pb-4 border-b-2 border-white/50 border-dashed">
                        <span className="text-4xl text-secondary">{page}</span>
                        <span className="text-2xl">/4</span>
                    </h1>
                    <label htmlFor="age" className="block mb-1 pb-8 text-2xl">{t("age")}</label>
                    <AgeSection />
                </div>
            )}

            {page === 2 && (
                <div className="mb-4">
                    <h1 className="text-4xl w-full my-8 pb-4 border-b-2 border-white/50 border-dashed">
                        <span className="text-4xl text-secondary">{page}</span>
                        <span className="text-2xl">/4</span>
                    </h1>
                    <label htmlFor="country" className="block mb-1 pb-8 text-2xl">{t("country")}</label>
                    <CountriesSection />
                </div>
            )}

            {page === 3 && (
                <div className="">
                    <h1 className="text-4xl w-full my-8 pb-4 border-b-2 border-white/50 border-dashed">
                        <span className="text-4xl text-secondary">{page}</span>
                        <span className="text-2xl">/4</span>
                    </h1>
                    <label htmlFor="occupation" className="block mb-1 pb-8 text-2xl">{t("occupation")}</label>
                    <OccupationsSection />
                </div>
            )}

            {page === 4 && (
                <div className="h-full">
                    <h1 className="text-4xl w-full my-8 pb-4 border-b-2 border-white/50 border-dashed">
                        <span className="text-4xl text-secondary">{page}</span>
                        <span className="text-2xl">/4</span>
                    </h1>
                    <label htmlFor="hobbies" className="block mb-1 pb-8 text-2xl">{t("hobbies")}</label>
                    <div className="pb-28">
                        <HobbiesSection />
                    </div>
                </div>
            )}

            <div className="flex justify-center absolute bottom-8 w-full">
                {page < 4 && (
                    <button type="button" onClick={handleNextPage} className='p-3 bg-secondary rounded w-full text-center mx-8'>
                        {t('continue')}
                    </button>
                )}
                {page === 4 && (
                    <button type="submit" onClick={handleSubmit} className='p-3 bg-secondary rounded w-full text-center mx-8'>
                        {t('continue')}
                    </button>
                )}
            </div>
        </form>
    );
};

export default DemographicsForm;
