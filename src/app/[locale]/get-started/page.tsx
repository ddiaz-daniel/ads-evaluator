import SwitchLanguage from '@/app/components/UI/LanguageSelector';
import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Get started - AI or Real?',
  description: 'Using AI Models for Advertisement Generation: Evaluating the Effects on Visual Perception and Attention.',
};

export default function Intro() {
  const t = useTranslations('get_started');

  return (
    <section className="relative flex h-screen w-full justify-center bg-primary">
      <div className="justtify-center flex w-full max-w-md">

        <div className="w-full px-8 pt-28">
          <h1 className="mb-32 text-center text-2xl font-bold text-white">
            {t('title')}
          </h1>
          <h2 className="mb-8 flex flex-col space-y-8 text-center text-base text-white">
            <span>{t('first_paragraph')}</span>
            <span>{t('second_paragraph')}</span>
          </h2>
        </div>
        <div className="absolute bottom-8 flex w-full max-w-md justify-center">
          <Link
            href="/ai-or-real"
            className="mx-8 w-full rounded bg-secondary p-3 text-center"
          >
            {t('start')}
          </Link>
        </div>
      </div>
    </section>
  );
}
