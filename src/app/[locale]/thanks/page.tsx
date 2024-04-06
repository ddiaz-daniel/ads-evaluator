import {
  useTranslations,
} from 'next-intl';
import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thanks',
  description: 'Using AI Models for Advertisement Generation: Evaluating the Effects on Visual Perception and Attention.',
};

export default function Thanks() {
  const t = useTranslations('thanks');

  return (
    <section className="relative flex h-dvh w-full justify-center bg-primary overflow-y-hidden">
      <div className="justtify-center flex w-full max-w-md">

        <div className="px-8 pt-28">
          <h1 className="mb-32 text-center text-2xl font-bold text-white">
            {t('title')}
          </h1>
          <h2 className="mb-8 flex flex-col space-y-8 text-center text-base text-white">
            <span>
              {t('first_paragraph')}
            </span>
            <span>{t('second_paragraph')}</span>
          </h2>
          <Image src="/cat.png" alt="Thanks-cat" width={400} height={400} className=' object-contain' />
        </div>

      </div>
    </section>
  );
}
