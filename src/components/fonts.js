import { Londrina_Solid, PT_Serif, Mukta, Barlow } from 'next/font/google';

export const londrina = Londrina_Solid({
  subsets: ['latin'],
  weight: '400',
});

export const pt_serif = PT_Serif({
  subsets: ['latin'],
  weight: '400',
});

export const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '700'],
});
