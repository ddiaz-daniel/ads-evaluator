import ResultsPage from '@/app/components/Results/ResultsPage';
import SwitchLanguage from '@/app/components/UI/LanguageSelector';
import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Questionnaire Introduction',
  description: 'Using AI Models for Advertisement Generation: Evaluating the Effects on Visual Perception and Attention.',
};

export default function Results() {

  return (
    <section className="relative flex h-full w-screen justify-center bg-white text-black">
      <ResultsPage />
    </section>
  );
}
