import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found',
};

export default async function NotFound() {
  return (
    <div className='container'>
      <h2>Not Found:</h2>
      <p>Could not find requested resource</p>
    </div>
  );
}
