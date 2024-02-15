'use client';

import { FC } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from '@/app/utils/navigation/navigation';

const SwitchLanguage: FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = async (lang: string) => {
    if (router) {
      await router.replace(pathname, { locale: lang });
    }
  };

  return (
    <div className="flex flex-row space-x-2 px-1">
      <button
        onClick={() => handleChange('en')}
        className="w-full place-content-center py-1"
      >
        <Image
          src="/uk-flag.svg"
          alt="English"
          width={50}
          height={50}
          className="flex h-5 w-6 place-self-center self-center rounded object-cover object-center"
        />
      </button>
      <button
        onClick={() => handleChange('de')}
        className="w-full place-content-center py-1"
      >
        <Image
          src="/austria-flag.svg"
          alt="English"
          width={50}
          height={50}
          className="flex h-5 w-6 place-self-center self-center rounded object-cover object-center"
        />
      </button>
    </div>
  );
};

export default SwitchLanguage;
