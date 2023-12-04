import './globals.css';
import Header from '@/components/header';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

export const metadata = {
  title: "Kapil's Blog",
  description: 'Blogs by Kapil Pokhrel',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' dark='true'>
      <body>
        <Header></Header>
        {children}
      </body>
    </html>
  );
}
