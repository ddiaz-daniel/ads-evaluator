"use client";
import { useTranslations } from 'next-intl';
import AgeSection from './AgeSection';
import SexSection from './GenderSection';
import CountriesSection from './ContriesSection';
import OccupationsSection from './OccupationsSection';



const DemographicsForm = () => {
    const t = useTranslations('demographics');



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission, e.g., send data to server

    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="mb-4">
                <label htmlFor="ageRange" className="block mb-1">{t("age")}</label>
                <AgeSection />
            </div>

            <div className="mb-4">
                <label htmlFor="ageRange" className="block mb-1">{t("gender")}</label>
                <SexSection />
            </div>

            <div className="mb-4">
                <label htmlFor="country" className="block mb-1">{t("country")}</label>
                <CountriesSection />

            </div>
            <div className="mb-4">
                <label htmlFor="occupation" className="block mb-1">{t("occupation")}</label>
                <OccupationsSection />

            </div>
            <div className="mb-4">
                <label htmlFor="hobbies" className="block mb-1">{t("hobbies")}</label>

            </div>
        </form>
    );
};

export default DemographicsForm;
