import SwitchLanguage from '@/app/components/UI/LanguageSelector';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Intro() {
  const t = useTranslations('introduction');

  return (
    <section className="relative flex h-screen w-full justify-center bg-primary">
      <div className="justtify-center flex w-full max-w-md">
        <div className="absolute right-0">
          <SwitchLanguage />
        </div>

        <div className="px-8 pt-28">
          <h1 className="mb-32 text-center text-2xl font-bold text-white">
            {t('title')}
          </h1>
          <h2 className="mb-8 flex flex-col space-y-8 text-center text-base text-white">
            <span>
              {t('first_paragraph')} <strong>{t('thesis')}</strong>
            </span>
            <span>{t('second_paragraph')}</span>
          </h2>
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
