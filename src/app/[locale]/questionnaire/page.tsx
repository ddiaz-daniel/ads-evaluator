import QuestionnaireComponent from '@/app/components/QuestionnaireComponent/QuestionnaireComponent';
import { Metadata } from 'next';
import {
  NextIntlClientProvider,
  useMessages,
  useTranslations,
} from 'next-intl';
import React from 'react';

export const metadata: Metadata = {
  title: 'Questionnaire',
  description: 'Using AI Models for Advertisement Generation: Evaluating the Effects on Visual Perception and Attention.',
};

export default function Questionnaire() {
  const t = useTranslations('questionnaire');
  const messages = useMessages();

  return (
    <section className="min-w-screen relative min-h-screen w-full justify-center bg-primary">


      <div className="h-full w-full">
        <React.StrictMode>
          <NextIntlClientProvider messages={messages}>
            <QuestionnaireComponent />
          </NextIntlClientProvider>
        </React.StrictMode>
      </div>
    </section>
  );
}
