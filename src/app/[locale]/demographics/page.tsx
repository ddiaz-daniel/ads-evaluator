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

            <div className="px-8 h-screen">

                <NextIntlClientProvider messages={messages}>
                    <DemographicsForm />
                </NextIntlClientProvider>
            </div>

        </section>
    );
}
