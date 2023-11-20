import './globals.css';
import Header from '@/components/header';

export const metadata = {
  title: "Kapil's Blog",
  description: 'Blogs by Kapil Pokhrel',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <Header>
          <span>Blogs</span>
        </Header>
        {children}
      </body>
    </html>
  );
}
