import SwitchLanguage from '@/app/components/UI/LanguageSelector';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Intro() {
    const t = useTranslations('introduction');

    return (
        <section className="h-screen w-full justify-center bg-primary relative flex">
            <div className='flex justtify-center w-full max-w-md'>
                <div className='absolute right-0'>
                    <SwitchLanguage />
                </div>

                <div className="px-8 pt-28">
                    <h1 className="mb-32 text-center text-2xl font-bold text-white">
                        {t('title')}
                    </h1>
                    <h2 className="mb-8 text-center text-base text-white space-y-8 flex flex-col">
                        <span>{t('first_paragraph')} <strong>{t('thesis')}</strong></span>
                        <span>{t('second_paragraph')}</span>
                    </h2>
                </div>
                <div className="flex justify-center absolute bottom-8 w-full max-w-md">
                    <Link href="/demographics" className='p-3 bg-secondary rounded w-full text-center mx-8'>
                        {t('continue')}
                    </Link>
                </div>
            </div>
        </section>
    );
}
