import Link from 'next/link';
import { londrina, pt_serif } from '@/components/fonts';

export const metadata = {
  title: 'Page Not Found',
};

export default async function NotFound() {
  return (
    <div className='container'>
      <h1
        className={`text-center font-bold text-8xl text-orange-500 ${londrina.className}`}
      >
        404
      </h1>
      <p className={`text-center text-xl ${pt_serif.className}`}>
        Looks like you got tangled up in the Spaghetti
      </p>
    </div>
  );
}
