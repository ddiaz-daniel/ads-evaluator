'use client';
import { addDataToProile, getAllGeneratedAds, getLocalAds, getProfileById } from '@/app/utils/firebase/functions';
import { useEffect, useState } from 'react';

import { CircularProgress } from '@mui/material';
import DisplayAd from './DisplayAd';
import { Ad, AdComponents, RealAd } from '@/app/types/types';
import DisplayRealAd from './DisplayRealAd';

type CustomAd = {
  id: string;
  image: string;
  setup: AdComponents;
  origin: "ai";
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
  const [locale, setLocale] = useState<('en' | 'fr' | 'de' | 'es' | 'pt' | 'it')>('en');
  const [answers, setAnswers] = useState<AiOrRealAnswers[]>([]);

  const handleRealClick = () => {
    const id = allAds[page].id;
    setPage(page + 1);
    setAnswers(prevAnswers => [...prevAnswers, { id, answer: 'real' }]);

  };

  const handleAiClick = () => {
    const id = allAds[page].id;
    console.log(id);
    setPage(page + 1);
    setAnswers(prevAnswers => [...prevAnswers, { id, answer: 'ai' }]);

  };

  useEffect(() => {
    //on page change check if last page
    if (page === allAds.length) {
      console.log(answers);
      //get a profile from firebase
      //send answers to firebase
      //redirect to profile page
      const addAnswersToProfile = async () => {
        const id = localStorage.getItem('questionnaire-id') as string;
        await addDataToProile(id, { aiOrReal: answers }).then(() => {
          console.log('answers added to profile');
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
      const locale = await localStorage.getItem('language') as 'en' | 'fr' | 'de' | 'es' | 'pt' | 'it';
      setLocale(locale);
      setRealAds(realAds);

    };
    getAds();
  }, []);

  useEffect(() => {

    const customAd = aiAds.map((ad) => ({
      id: ad.id,
      image: ad.images[0],
      setup: ad.setup.ads[0].data,
      origin: "ai" as "ai"
    }));
    setCustomAds(customAd);

  }, [aiAds]);

  useEffect(() => {
    //put all ads in one array and shuffle them
    const ads = [...customAds, ...realAds];
    ads.sort(() => Math.random() - 0.5);
    setAllAds(ads);
    console.log(ads);
  }, [customAds, realAds]);

  if (allAds.length < 5) {
    return (
      <div className="flex h-screen w-screen place-content-center items-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <section className="relative mx-auto h-full min-h-screen max-w-md px-8 pt-4">
      {allAds.map((ad, index) => (
        <div key={index}>
          {page === index && (
            <>
              <div className="mb-4 h-full">
                <h1 className="w-full border-b-2 border-dashed border-white/50 pb-4 pt-8 text-4xl">
                  <span className="text-4xl text-secondary">{page + 1}</span>
                  <span className="text-2xl">/{allAds.length}</span>
                </h1>
              </div>
              {ad.origin == "ai" && (

                <DisplayAd setup={ad.setup} images={ad.image} locale={locale} />)
              }
              {ad.origin == "real" && (

                <DisplayRealAd locale={locale} setup={ad.setup} images={ad.image} />)
              }
            </>
          )}
        </div>
      ))}

      <div className=" relative flex w-full max-w-md flex-row pt-2 pb-4">
        <button
          type="button"
          onClick={handleRealClick}
          className="mx-2 w-full rounded bg-secondary p-3 text-center text-xl"
        >
          {'Real'}
        </button>
        <button
          type="button"
          onClick={handleAiClick}
          className="mx-2 w-full rounded bg-secondary p-3 text-center text-xl"
        >
          {'AI'}
        </button>
      </div>
    </section>
  );
};

export default AiOrRealComponent;
