import { londrina, pt_serif } from './fonts';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGithub,
  faInstagram,
  faXTwitter,
  faLinkedin,
  faTelegram,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';

export default function Footer({ author, author_links, children }) {
  const icons = {
    github: faGithub,
    twitter: faXTwitter,
    instagram: faInstagram,
    linkedin: faLinkedin,
    telegram: faTelegram,
    whatsapp: faWhatsapp,
  };
  const links = [];
  Object.entries(author_links).forEach(([site, link]) => {
    links.push(
      <Link key={`${site}-link`} href={link} className='p-1'>
        <FontAwesomeIcon icon={icons[site]} />
      </Link>
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
