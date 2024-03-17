'use client';
import { getAllGeneratedAds } from '@/app/utils/firebase/funtions';
import { useEffect, useState } from 'react';

import { CircularProgress } from '@mui/material';
import DisplayAd from './DisplayAd';
import { Ad, AdComponents } from '@/app/types/types';

const AiOrRealComponent = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [page, setPage] = useState(0);
  const [setups, setSetups] = useState<AdComponents[]>([]);
  const [images, setImages] = useState<string[]>([]);

  const handleFakeClick = () => {
    const id = ads[page].id;
    console.log(id);
    setPage(page + 1);
  };

  const handleAiClick = () => {
    const id = ads[page].id;
    console.log(id);
    setPage(page + 1);
  };

  useEffect(() => {
    const getAds = async () => {
      const ads = await getAllGeneratedAds();
      setAds(ads);
    };
    getAds();
  }, []);

  useEffect(() => {
    let listOfSetups: AdComponents[] = [];
    let listOfImages: string[] = [];
    ads.map((ad) => {
      listOfSetups.push(ad.setup.ads[0].data);
      listOfImages.push(ad.images[0]);
    });
    setSetups(listOfSetups);
    setImages(listOfImages);
  }, [ads]);

  if (!ads || !setups.length || !images.length) {
    return (
      <div className="flex h-screen w-screen place-content-center items-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <section className="relative mx-auto h-full min-h-screen max-w-md px-8 pt-4">
      {ads.map((ad, index) => (
        <div key={index}>
          {page === index && (
            <>
              <div className="mb-4 h-full">
                <h1 className="w-full border-b-2 border-dashed border-white/50 pb-4 pt-8 text-4xl">
                  <span className="text-4xl text-secondary">{page}</span>
                  <span className="text-2xl">/10</span>
                </h1>
              </div>
              <DisplayAd setup={setups[index]} images={images[index]} />
            </>
          )}
        </div>
      ))}

      <div className=" absolute bottom-0 left-0 flex w-full max-w-md flex-row px-8 py-8">
        <button
          type="button"
          onClick={handleFakeClick}
          className="mx-2 w-full rounded bg-secondary p-3 text-center text-xl"
        >
          {'Real'}
        </button>
        <button
          type="button"
          onClick={handleAiClick}
          className="mx-2 w-full rounded bg-secondary p-3 text-center text-xl"
        >
          {'Ai'}
        </button>
      </div>
    </section>
  );
};

export default AiOrRealComponent;
