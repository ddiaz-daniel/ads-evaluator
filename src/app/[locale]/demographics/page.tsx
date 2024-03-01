import DemographicsForm from '@/app/components/Demographics/DemographicsForm';
import SwitchLanguage from '@/app/components/UI/LanguageSelector';
import { NextIntlClientProvider, useMessages, useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Demographics() {
    const t = useTranslations('demographics');
    const messages = useMessages();

    return (
        <section className="h-screen w-full justify-center bg-primary relative">
            <div className='absolute right-0'>
                <SwitchLanguage />
            </div>

            <div className="px-8 pt-16">
                <h1 className="mb-8 text-center text-2xl font-bold text-white">
                    {t('demographics')}
                </h1>
                <NextIntlClientProvider messages={messages}>
                    <DemographicsForm />
                </NextIntlClientProvider>
            </div>
            <div className="flex justify-center absolute bottom-8 w-full">
                <Link href="/demographics" className='p-3 bg-secondary rounded w-full text-center mx-8'>
                    {t('continue')}
                </Link>
            </div>
        </section>
    );
}
