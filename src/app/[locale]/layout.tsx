import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Head from 'next/head'; // Import Head component from next/head
import './../globals.css';
import { QuestionnaireProvider } from '../context/QuestionnaireContext';
import FirebaseInit from './fireBaseInit';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Master Thesis Questionnaire',
  description: 'Using AI Models for Advertisement Generation: Evaluating the Effects on Visual Perception and Attention.',
};

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string; };
}>) {
  return (
    <html lang={locale}>
      <Head>
        {/* Include the viewport meta tag within the Head component */}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=yes" />
      </Head>

      <FirebaseInit>
        <QuestionnaireProvider>
          <body className={inter.className}>{children}</body>
        </QuestionnaireProvider>
      </FirebaseInit>
    </html>
  );
}
