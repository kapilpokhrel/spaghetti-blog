import { londrina, pt_serif, barlow } from './fonts';

export default function Blog_item({ title, date, text, home }) {
  return (
    <div className={`group container pb-[10px] flex flex-col`}>
      <h2
        className={`mb-0 font-bold text-[28px] min-[475px]:text-[30px] sm:text-[32px] md:text-[34px] text-[#10dbff] 
        ${home && 'group-hover:text-[#0faeca]'} ${londrina.className}`}
      >
        {title}
      </h2>
      <span
        className={`pl-[5px] pb-[10px] mb-[10px] border-b-[1px] border-white border-solid text-[12px] min-[475px]:text-[13px] sm:text-[14px] md:text-[15px] ${pt_serif.className}`}
      >
        {date}
      </span>
      <div className={`${barlow.className}`}>{text}</div>
    </div>
  );
}
