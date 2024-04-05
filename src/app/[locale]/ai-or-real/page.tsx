import AiOrRealComponent from '@/app/components/AiOrReal/AiOrRealComponent';
import SwitchLanguage from '@/app/components/UI/LanguageSelector';
import { Metadata } from 'next';
import {
  NextIntlClientProvider,
  useMessages,
  useTranslations,
} from 'next-intl';

export const metadata: Metadata = {
  title: 'Ai or Real?',
  description: 'Using AI Models for Advertisement Generation: Evaluating the Effects on Visual Perception and Attention.',
};

export default function AiReal() {
  const messages = useMessages();

  return (
    <section className="min-w-screen relative min-h-screen w-full justify-center bg-primary">

      <div className="h-full w-full">
        <NextIntlClientProvider messages={messages}>
          <AiOrRealComponent />
        </NextIntlClientProvider>
      </div>
    </section>
  );
}
