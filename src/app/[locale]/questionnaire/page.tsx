import AiOrRealComponent from '@/app/components/AiOrReal/AiOrRealComponent';
import QuestionnaireComponent from '@/app/components/QuestionnaireComponent/QuestionnaireComponent';
import SwitchLanguage from '@/app/components/UI/LanguageSelector';
import {
  NextIntlClientProvider,
  useMessages,
  useTranslations,
} from 'next-intl';
import React from 'react';

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
