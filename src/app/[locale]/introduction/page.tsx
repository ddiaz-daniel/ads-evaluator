import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Introduction',
  description: 'Using AI Models for Advertisement Generation: Evaluating the Effects on Visual Perception and Attention.',
};

export default function Intro() {
  const t = useTranslations('introduction');

  return (
    <section className="relative flex h-dvh w-full justify-center bg-primary">
      <div className="justtify-center flex w-full max-w-md h-dvh">

        <div className="px-8 pt-14">
          <h1 className="mb-8 text-center text-2xl font-bold text-white">
            {t('title')}
          </h1>
          <label className="mb-8 flex flex-col space-y-8 text-center text-base text-white">
            <span>
              {t('first_paragraph')}
            </span>
            <span>
              <strong>{t('thesis')}</strong>
            </span>
            <span>{t('second_paragraph')}</span>
          </label>
        </div>
        <div className="absolute bottom-8 flex w-full max-w-md justify-center">
          <Link
            href="/demographics"
            className="mx-8 w-full rounded bg-secondary p-3 text-center"
          >
            {t('continue')}
          </Link>
        </div>
      </div>
    </section>
  );
}
