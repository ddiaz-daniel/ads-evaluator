import AiOrRealComponent from '@/app/components/AiOrReal/AiOrRealComponent';
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
    <section className="min-w-screen relative min-h-screen w-full justify-center bg-primary">
      <div className="absolute right-0">
        <SwitchLanguage />
      </div>

      <div className="h-full w-full">
        <NextIntlClientProvider messages={messages}>
          <AiOrRealComponent />
        </NextIntlClientProvider>
      </div>
    </section>
  );
}
