import { useLocale, useTranslations } from 'next-intl';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';
import { locales } from '@/app/utils/navigation/navigation';

export default function LocaleSwitcher() {
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect defaultValue={locale} >
      {locales.map((lang) => (
        <option key={lang} value={lang}>
          {lang}
        </option>
      ))}
    </LocaleSwitcherSelect>
  );
}