import SelectLanguagePage from '@/app/components/SelectLanguage/SelectLanguagePage';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Index() {
  const t = useTranslations('select_language');

  const languagesIntl = {
    english: t('english'),
    german: t('german'),
    spanish: t('spanish'),
    italian: t('italian'),
    french: t('french'),
    portuguese: t('portuguese'),
  };
  return (
    <section className="relative h-dvh w-full justify-center overflow-hidden bg-primary">
      <div className="relative mx-auto flex h-screen max-w-xl flex-col justify-center">
        <div className="mt-14 h-full px-8">
          <h1 className="mb-24 text-center text-2xl font-bold text-white">
            {t('question')}
          </h1>
          <SelectLanguagePage intl={languagesIntl} />
        </div>
        <div className="absolute bottom-8 flex w-full justify-center px-8">
          <Link
            href="/introduction"
            className="mx-8 w-full rounded bg-secondary p-3 text-center"
          >
            {t('continue')}
          </Link>
        </div>
      </div>
    </section>
  );
}
