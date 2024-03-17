'use client';

import { useQuestionnaire } from '@/app/context/QuestionnaireContext';
import { usePathname, useRouter } from '@/app/utils/navigation/navigation';
import { ChangeEvent, ReactNode, Suspense, useTransition } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';

type Props = {
  children: ReactNode;
  defaultValue: string;
};

export default function LocaleSwitcherSelect({
  children,
  defaultValue,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const { changeLanguage } = useQuestionnaire();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    changeLanguage(nextLocale);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <label
      className={`bg-black' relative w-28 text-gray-400 ${isPending && 'transition-opacity [&:disabled]:opacity-30'}`}
    >
      <div className="relative flex w-16 flex-row items-center">
        <select
          className="z-10 w-full cursor-pointer appearance-none bg-transparent py-3 pl-2 pr-8 uppercase focus:bg-primary/90 focus:outline-none"
          defaultValue={defaultValue}
          disabled={isPending}
          onChange={onSelectChange}
        >
          {children}
        </select>
        <RiArrowDropDownLine size={28} className="absolute right-2" />
      </div>
    </label>
  );
}
