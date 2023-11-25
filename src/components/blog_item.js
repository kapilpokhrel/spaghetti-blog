import { londrina, pt_serif, mukta } from './fonts';

export default function Blog_item({ title, date, text }) {
  return (
    <div className={`container pb-[10px] flex flex-col`}>
      <h2
        className={`mb-0 font-bold text-[28px] min-[475px]:text-[30px] sm:text-[32px] md:text-[34px] text-[#10dbff] ${londrina.className}`}
      >
        {title}
      </h2>
      <span
        className={`pl-[5px] pb-[10px] mb-[10px] border-b-[1px] border-white border-solid text-[14px] min-[475px]:text-[15px] sm:text-[16px] ${pt_serif.className}`}
      >
        {date}
      </span>
      <div
        className={`text-[18px] min-[475px]:text-[20px] sm:text-[21px] md:text-[22px] ${mukta.className}`}
      >
        {text}
      </div>
    </div>
  );
}
