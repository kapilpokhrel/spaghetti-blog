import { londrina, pt_serif } from './fonts';
import Link from 'next/link';

export default function Footer({ author, author_links, children }) {
  const links = [];
  Object.entries(author_links).forEach(([site, link]) => {
    links.push(
      <div
        key={`${site} link`}
        className='p-1 m-1 rounded-full bg-green-800 w-6 h-6'
      >
        <Link href={link}></Link>
      </div>
    );
  });
  return (
    <div className='container'>
      <div className='flex items-center flex-col mb-4 ${pt_serif.className}'>
        <span className='italic text-[12px] min-[475px]:text-[13px] sm:text-[14px] md:text-[15px]'>
          By {author}
        </span>
        <div className='flex flex-row'>{links}</div>
      </div>
      <div
        className={`mb-10 font-bold text-[20px] min-[475px]:text-[22px] sm:text-[24px] md:text-[26px] ${londrina.className}`}
      >
        <Link href='/'>Home</Link>
      </div>
      {children}
    </div>
  );
}
