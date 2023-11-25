import './globals.css';
import Header from '@/components/header';
import Link from 'next/link';

export const metadata = {
  title: "Kapil's Blog",
  description: 'Blogs by Kapil Pokhrel',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' dark='true'>
      <body>
        <Header>
          <Link href='/'>
            <span>Blogs</span>
          </Link>
        </Header>
        {children}
      </body>
    </html>
  );
}
