import './globals.css';
import Header from '@/components/header';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import Script from 'next/script';
config.autoAddCss = false;

export const metadata = {
  title: 'Spaghetti-Blogs | Blogs by Kapil Pokhrel',
  description: 'Random and tangled blogs by me.',
  keywords: ['nextjs-blog', 'spaghetti-blog'],
  verification: {
    google: 'NtaRlIYS0eNFkzGSX6PbsIBcVp303n8rmRfBpxIjtFw',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' dark='true'>
      <Script
        async
        src='https://www.googletagmanager.com/gtag/js?id=G-RNTX1ZBCCW'
      ></Script>
      <Script id='google-analytics'>
        {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-RNTX1ZBCCW');`}
      </Script>
      <body>
        <Header></Header>
        {children}
      </body>
    </html>
  );
}
