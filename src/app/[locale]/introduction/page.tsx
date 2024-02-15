import SelectLanguagePage from '@/app/components/SelectLangauge/SelectLanguagePage';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Index() {
    const t = useTranslations('introduction');

    const languagesIntl = {

    };

    return (
        <section className="h-screen w-full justify-center bg-primary relative">
            <div className="px-8 pt-28">
                <h1 className="mb-32 text-center text-2xl font-bold text-white">
                    {t('title')}
                </h1>
            </div>
            <div className="flex justify-center absolute bottom-8 w-full">
                <Link href="/demographics" className='p-3 bg-secondary rounded w-full text-center mx-8'>
                    {t('continue')}
                </Link>
            </div>
        </section>
    );
}
