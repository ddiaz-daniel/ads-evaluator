import AiOrRealComponent from '@/app/components/AiOrReal/AiOrRealComponent';
import SwitchLanguage from '@/app/components/UI/LanguageSelector';
import { NextIntlClientProvider, useMessages, useTranslations } from 'next-intl';

export default function Demographics() {
    const t = useTranslations('demographics');
    const messages = useMessages();

    return (
        <section className="min-h-screen justify-center bg-primary relative w-full min-w-screen">
            <div className='absolute right-0'>
                <SwitchLanguage />
            </div>

            <div className="w-full h-full">

                <NextIntlClientProvider messages={messages}>
                    <AiOrRealComponent />
                </NextIntlClientProvider>
            </div>

        </section>
    );
}
