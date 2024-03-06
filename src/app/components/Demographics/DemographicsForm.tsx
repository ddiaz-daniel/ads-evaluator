"use client";
import { useTranslations } from 'next-intl';
import AgeSection from './AgeSection';
import GenderSection from './GenderSection';
import CountriesSection from './ContriesSection';
import OccupationsSection from './OccupationsSection';
import { useState } from 'react';
import HobbiesSection from './HobbiesSection';

const DemographicsForm = () => {
    const [page, setPage] = useState(1);
    const t = useTranslations('demographics');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const handleBack = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        setPage(page + 1);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto relative h-full pt-8">
            {page !== 0 &&
                <button className="absolute top-3 text-lg" onClick={handleBack}>
                    {"<-"}
                </button>
            }
            {page === 0 && (
                <div className="mb-4">
                    <label htmlFor="gender" className="block mb-1 py-16 text-4xl">{t("gender")}</label>
                    <GenderSection />
                </div>
            )}

            {page === 1 && (
                <div className="mb-4">
                    <label htmlFor="ageRange" className="block mb-1 py-16 text-4xl">{t("age")}</label>
                    <AgeSection />
                </div>
            )}

            {page === 2 && (
                <div className="mb-4">
                    <label htmlFor="country" className="block mb-1 py-16 text-4xl">{t("country")}</label>
                    <CountriesSection />
                </div>
            )}

            {page === 3 && (
                <div className="mb-4">
                    <label htmlFor="occupation" className="block mb-1 py-16 text-4xl">{t("occupation")}</label>
                    <OccupationsSection />
                </div>
            )}

            {page === 4 && (
                <div className="mb-4">
                    <label htmlFor="hobbies" className="block mb-1 py-16 text-2xl">{t("hobbies")}</label>
                    <HobbiesSection />
                </div>
            )}

            <div className="flex justify-center absolute bottom-8 w-full">
                {page < 4 && (
                    <button onClick={handleNextPage} className='p-3 bg-secondary rounded w-full text-center mx-8'>
                        {t('continue')}
                    </button>
                )}
                {page === 4 && (
                    <button type="submit" className='p-3 bg-secondary rounded w-full text-center mx-8'>
                        {t('submit')}
                    </button>
                )}
            </div>
        </form>
    );
};

export default DemographicsForm;
