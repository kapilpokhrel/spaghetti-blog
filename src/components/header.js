import { londrina } from './fonts';

export default function Header({ children }) {
  return (
    <div
      className={`container py-[25px] font-extrabold text-[36px] min-[475px]:text-[38px] sm:text-[40px] md:text-[42px] ${londrina.className}`}
    >
      {children}
    </div>
  );
}
