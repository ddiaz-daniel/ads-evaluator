import SelectLanguagePage from '@/app/components/SelectLangauge/SelectLanguagePage';
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
        <section className="h-screen w-full justify-center bg-primary relative overflow-hidden">
            <div className="max-w-xl flex flex-col justify-center h-screen mx-auto relative">
                <div className="px-8 h-full mt-28">
                    <h1 className="mb-24 text-center text-2xl font-bold text-white">
                        {t('question')}
                    </h1>
                    <SelectLanguagePage intl={languagesIntl} />

                </div>
                <div className="flex justify-center absolute w-full bottom-8 px-8">
                    <Link href="/introduction" className='p-3 bg-secondary rounded w-full text-center mx-8'>
                        {t('continue')}
                    </Link>
                </div>
            </div>
        </section>

    );
}
