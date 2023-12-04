import { londrina, pt_serif } from './fonts';
import Link from 'next/link';

export default function Header({ children }) {
  return (
    <div className='container py-[25px]'>
      <div
        className={`font-extrabold text-[36px] min-[475px]:text-[38px] sm:text-[40px] md:text-[42px] ${londrina.className}`}
      >
        <Link href='/'>Spaghetti-Blogs</Link>
      </div>
      <div
        className={`pl-[5px] text-[12px] min-[475px]:text-[13px] sm:text-[14px] md:text-[15px] ${pt_serif.className} italic`}
      >
        By{' '}
        <Link
          href='https://www.github.com/kapilpokhrel'
          className='underline underline-offset-2'
        >
          Kapil Pokhrel
        </Link>
      </div>
      {children}
    </div>
  );
}
