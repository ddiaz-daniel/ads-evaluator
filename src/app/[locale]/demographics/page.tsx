import DemographicsForm from '@/app/components/Demographics/DemographicsForm';
import SwitchLanguage from '@/app/components/UI/LanguageSelector';
import {
  NextIntlClientProvider,
  useMessages,
  useTranslations,
} from 'next-intl';

export default function Demographics() {
  const t = useTranslations('demographics');
  const messages = useMessages();

  return (
    <section className="relative min-h-screen w-full justify-center bg-primary">
      <div className="absolute right-0">
        <SwitchLanguage />
      </div>

      <div className="h-full px-8">
        <NextIntlClientProvider messages={messages}>
          <DemographicsForm />
        </NextIntlClientProvider>
      </div>
    </section>
  );
}
