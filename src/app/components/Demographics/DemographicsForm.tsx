'use client';
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
import {
  addDataToProile,
  createNewProfile,
  getProfileById,
} from '@/app/utils/firebase/functions';
import { useRouter } from '@/app/utils/navigation/navigation';
import InstagramUserSection from './InstagramUserSection';
import { CgNametag } from 'react-icons/cg';

const DemographicsForm = () => {
  const [page, setPage] = useState(0);
  const { ageRange, gender, country, occupation, hobbies, isInstagramUser, id, setId } =
    useQuestionnaire();
  const t = useTranslations('demographics');
  const route = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await addDataToProile(id, { isInstagramUser: isInstagramUser }).then(() => {
      route.push('/get-started');
    });
  };

  const handleBack = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = async () => {

    if (page === 0 && gender !== '') {
      await addDataProgressively("gender", gender).then(async () => {
        await addDataProgressively("id", id);
      });
    }
    if (page === 1 && ageRange !== '') {
      await addDataProgressively("ageRange", ageRange);
    }
    if (page === 2 && country !== '') {
      await addDataProgressively("country", country);
    }
    if (page === 3 && occupation !== '') {
      await addDataProgressively("occupation", occupation);
    }
    if (page === 4 && hobbies.length !== 0) {
      await addDataProgressively("hobbies", hobbies);
    }
    if (page === 5 && isInstagramUser !== null) {
      await addDataProgressively("isInstagramUser", isInstagramUser);
    }
    setPage(page + 1);
  };

  const addDataProgressively = async (field: string, value: string | string[] | boolean) => {
    await addDataToProile(id, { [field]: value });
  };

  const checkIdValidity = () => {
    const id = sessionStorage.getItem('questionnaire-id');
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
    sessionStorage.setItem('questionnaire-id', newId);
    setId(newId);
  };

  const disableValidation = (page: number) => {
    if (page === 0 && gender === '') {
      return true;
    }
    if (page === 1 && ageRange === '') {
      return true;
    }
    if (page === 2 && (country === '')) {
      return true;
    }
    if (page === 3 && occupation === '') {
      return true;
    }
    if (page === 4 && hobbies.length === 0) {
      return true;
    }
    if (page === 5 && isInstagramUser === null) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (!checkIdValidity()) {
      createId();
    } else {
      const oldId = sessionStorage.getItem('questionnaire-id');
      if (oldId === null) {
        createId();
        return;
      }
      setId(oldId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="relative mx-auto max-w-md "
    >
      {page !== 0 && (
        <button
          type="button"
          className="absolute top-6 text-2xl"
          onClick={handleBack}
        >
          {'<-'}
        </button>
      )}
      {page === 0 && (
        <div className=" h-dvh ">
          <h1 className="mb-4 pt-4 w-full border-b-2 border-dashed border-white/50 pb-4 text-4xl justify-end px-4 flex items-end text-white">
            <span className="text-4xl text-secondary">{page + 1}</span>
            <span className="text-2xl text-white">/6</span>
          </h1>
          <label htmlFor="gender" className="mb-1 block pb-8 text-2xl text-white">
            {t('gender')}
          </label>

          <GenderSection />
        </div>
      )}

      {page === 1 && (
        <div className=" h-dvh ">
          <h1 className="mb-4 pt-4 w-full border-b-2 border-dashed border-white/50 pb-4 text-4xl justify-end px-4 flex items-end text-white">
            <span className="text-4xl text-secondary">{page + 1}</span>
            <span className="text-2xl text-white">/6</span>
          </h1>
          <label htmlFor="age" className="mb-1 block pb-8 text-2xl text-white">
            {t('age')}
          </label>
          <AgeSection />
        </div>
      )}

      {page === 2 && (
        <div className="h-dvh ">
          <h1 className="mb-4 pt-4 w-full border-b-2 border-dashed border-white/50 pb-4 text-4xl justify-end px-4 flex items-end text-white">
            <span className="text-4xl text-secondary">{page + 1}</span>
            <span className="text-2xl text-white">/6</span>
          </h1>
          <label htmlFor="country" className="mb-1 block pb-8 text-2xl text-white">
            {t('country')}
          </label>
          <CountriesSection />
        </div>
      )}

      {page === 3 && (
        <div className="h-dvh ">
          <h1 className="mb-4 pt-4 w-full border-b-2 border-dashed border-white/50 pb-4 text-4xl justify-end px-4 flex items-end text-white">
            <span className="text-4xl text-secondary">{page + 1}</span>
            <span className="text-2xl text-white">/6</span>
          </h1>
          <label htmlFor="occupation" className="mb-1 block pb-8 text-2xl text-white">
            {t('occupation')}
          </label>
          <OccupationsSection />
        </div>
      )}

      {page === 4 && (
        <div className="">
          <h1 className="mb-4 pt-4 w-full border-b-2 border-dashed border-white/50 pb-4 text-4xl justify-end px-4 flex items-end text-white">
            <span className="text-4xl text-secondary">{page + 1}</span>
            <span className="text-2xl text-white">/6</span>
          </h1>
          <label htmlFor="hobbies" className="mb-1 block pb-8 text-2xl text-white">
            {t('hobbies')}
          </label>
          <div className="pb-28">
            <HobbiesSection />
          </div>
        </div>
      )}

      {page === 5 && (
        <div className="h-dvh ">
          <h1 className="mb-4 pt-4 w-full border-b-2 border-dashed border-white/50 pb-4 text-4xl justify-end px-4 flex items-end text-white">
            <span className="text-4xl text-secondary">{page + 1}</span>
            <span className="text-2xl text-white">/6</span>
          </h1>
          <label htmlFor="insta" className="mb-1 block pb-8 text-2xl text-white">
            {t('instagramUser')}
          </label>

          <InstagramUserSection />

        </div>
      )}

      <div className="absolute bottom-8 flex w-full justify-center">
        {page < 5 && (
          <button
            disabled={disableValidation(page)}
            type="button"
            onClick={handleNextPage}
            className="mx-8 w-full rounded bg-secondary p-3 text-center disabled:bg-slate-500 disabled:opacity-50"
          >
            {t('continue')}
          </button>
        )}
        {page === 5 && (
          <button
            disabled={disableValidation(page)}
            type="submit"
            onClick={handleSubmit}
            className="mx-8 w-full rounded bg-secondary p-3 text-center disabled:bg-slate-500 disabled:opacity-50"
          >
            {t('continue')}
          </button>
        )}
      </div>
    </form>
  );
};

export default DemographicsForm;
