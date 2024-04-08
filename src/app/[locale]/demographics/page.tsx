import DemographicsForm from '@/app/components/Demographics/DemographicsForm';
import SwitchLanguage from '@/app/components/UI/LanguageSelector';
import { Metadata } from 'next';
import {
  NextIntlClientProvider,
  useMessages,
  useTranslations,
} from 'next-intl';


export const metadata: Metadata = {
  title: 'Demographics',
  description: 'Using AI Models for Advertisement Generation: Evaluating the Effects on Visual Perception and Attention.',
};

export default function Demographics() {
  const t = useTranslations('demographics');
  const messages = useMessages();

  return (
    <section className="relative h-full w-full justify-center bg-primary">

      <div className="px-8 min-h-dvh h-full">
        <NextIntlClientProvider messages={messages}>
          <DemographicsForm />
        </NextIntlClientProvider>
      </div>
    </section>
  );
}
