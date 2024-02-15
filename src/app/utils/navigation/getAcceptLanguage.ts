import { GetServerSideProps } from 'next';

interface Props {
  preferredLocale: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
}) => {
  const acceptLanguage = req.headers['accept-language'];
  const preferredLocale: string =
    acceptLanguage?.split(',')[0] || 'default-locale';

  return { props: { preferredLocale } };
};
