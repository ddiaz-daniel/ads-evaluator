'use client';
import {
  addDataToProile,
  getAllGeneratedAds,
  getLocalAds,
} from '@/app/utils/firebase/functions';
import { useEffect, useState } from 'react';

import { CircularProgress } from '@mui/material';
import DisplayAd from './DisplayAd';
import { Ad, AdComponents, RealAd } from '@/app/types/types';
import DisplayRealAd from './DisplayRealAd';
import { useRouter } from '@/app/utils/navigation/navigation';

type CustomAd = {
  id: string;
  image: string;
  setup: AdComponents;
  origin: 'ai';
};

type AiOrRealAnswers = {
  id: string;
  answer: string;
};

const AiOrRealComponent = () => {
  const [aiAds, setAiAds] = useState<Ad[]>([]);
  const [realAds, setRealAds] = useState<RealAd[]>([]);
  const [customAds, setCustomAds] = useState<CustomAd[]>([]);
  const [allAds, setAllAds] = useState<(RealAd | CustomAd)[]>([]);
  const [page, setPage] = useState(0);
  const [locale, setLocale] = useState<'en' | 'fr' | 'de' | 'es' | 'pt' | 'it'>(
    'en'
  );
  const [answers, setAnswers] = useState<AiOrRealAnswers[]>([]);
  const router = useRouter();

  const handleRealClick = () => {
    const id = allAds[page].id;
    setPage(page + 1);
    setAnswers((prevAnswers) => [...prevAnswers, { id, answer: 'real' }]);
  };

  const handleAiClick = () => {
    const id = allAds[page].id;
    setPage(page + 1);
    setAnswers((prevAnswers) => [...prevAnswers, { id, answer: 'ai' }]);
  };

  useEffect(() => {
    if (allAds.length === 0) return;
    if (page === allAds.length) {
      const addAnswersToProfile = async () => {
        const id = localStorage.getItem('questionnaire-id') as string;
        await addDataToProile(id, { aiOrReal: answers }).then(() => {
          router.push('/introduction-questionnaire');
        });
      };
      addAnswersToProfile();
    }
  }, [page]);

  useEffect(() => {
    const getAds = async () => {
      const ads: Ad[] = await getAllGeneratedAds();
      setAiAds(ads);

      const realAds: RealAd[] = await getLocalAds();
      const locale = (await localStorage.getItem('language') as "en" | "de" | "it" | "es" | "pt" | "fr");

      //locale validation, otherwise, english:
      if (!locale) {
        const validLocale = "en";
        localStorage.setItem('language', validLocale);
        setLocale(validLocale);
      }
      else {
        setLocale(locale);
      }
      setRealAds(realAds);
    };
    getAds();
  }, []);

  useEffect(() => {
    const customAd = aiAds.map((ad) => ({
      id: ad.id,
      image: ad.images[0],
      setup: ad.setup.ads[0].data,
      origin: 'ai' as 'ai',
    }));
    setCustomAds(customAd);
  }, [aiAds]);

  useEffect(() => {
    //put all ads in one array and shuffle them
    const ads = [...customAds, ...realAds];
    ads.sort(() => Math.random() - 0.5);
    setAllAds(ads);
  }, [customAds, realAds]);

  if (allAds.length < 5) {
    return (
      <div className="flex h-screen w-screen place-content-center items-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <section className="relative mx-auto h-dvh max-w-md pt-2 scale-95">
      {allAds.map((ad, index) => (
        <div key={index}>
          {page === index && (
            <>
              {ad.origin == 'ai' && (
                <DisplayAd setup={ad.setup} images={ad.image} locale={locale} />
              )}
              {ad.origin == 'real' && (
                <DisplayRealAd
                  locale={locale}
                  setup={ad.setup}
                  images={ad.image}
                />
              )}
            </>
          )}
        </div>
      ))}
      {page <= 11 && (
        <div className=" relative flex w-full max-w-md flex-row pb-4 pt-2 px-4">
          <button
            type="button"
            onClick={handleRealClick}
            className="mx-2 w-full rounded bg-secondary p-3 text-center text-xl"
          >
            {'Real'}
          </button>
          <h1 className="w-[100px] h-10 justify-center flex bg-white rounded-full text-black items-center self-center">
            <span className="text-lg">{page + 1}</span>
            <span className=" text-base">|{allAds.length}</span>
          </h1>
          <button
            type="button"
            onClick={handleAiClick}
            className="mx-2 w-full rounded bg-secondary p-3 text-center text-xl"
          >
            {'AI'}
          </button>
        </div>
      )}
    </section>
  );
};

export default AiOrRealComponent;
