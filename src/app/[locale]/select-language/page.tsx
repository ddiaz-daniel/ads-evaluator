import SelectLanguagePage from '@/app/components/SelectLangauge/SelectLanguagePage';
import { useTranslations } from 'next-intl';

export default function Index() {
    const t = useTranslations('select_language');

    const languagesIntl = {
        english: t('english'),
        german: t('german'),
    };
    return (
        <section className="h-screen w-screen justify-center bg-slate-800">
            <div className="px-8 pt-28">
                <h1 className="mb-32 text-center text-2xl font-bold text-white">
                    {t('question')}
                </h1>
                <SelectLanguagePage intl={languagesIntl} />
            </div>
        </section>
    );
}
