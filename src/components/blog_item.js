import { londrina, pt_serif, barlow } from './fonts';
import { parseISO, format } from 'date-fns';

export default function Blog_item({ title, date, text, home }) {
  const formatted_date = format(parseISO(date), 'LLLL d, yyyy');
  return (
    <div className={`group container pb-[10px] flex flex-col`}>
      <h2
        className={`mb-0 font-bold text-[28px] min-[475px]:text-[30px] sm:text-[32px] md:text-[34px] text-orange-400 
        ${home && 'group-hover:text-orange-500'} ${londrina.className}`}
      >
        {title}
      </h2>
      <span
        className={`pl-[5px] pb-[10px] mb-[10px] border-b-[1px] border-white border-solid text-[12px] min-[475px]:text-[13px] sm:text-[14px] md:text-[15px] ${pt_serif.className}`}
      >
        <time dateTime={date}>{formatted_date}</time>
      </span>
      <div className={`${barlow.className} underline-offset-2`}>{text}</div>
    </div>
  );
}
