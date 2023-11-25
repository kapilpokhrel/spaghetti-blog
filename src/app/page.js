import Blog_item from '@/components/blog_item';
import { getSortedPostsData } from '@/utils/posts';
import Link from 'next/link';

export default function Home() {
  const posts = getSortedPostsData();
  return (
    <div>
      {posts.map(({ id, date, title, desc }) => (
        <Link href={`/posts/${id}`} key={id}>
          <Blog_item
            home
            title={title}
            date={date}
            text={
              <span className='prose sm:prose-md md:prose-lg lg:prose-xl prose-slate dark:prose-invert'>
                {desc}
              </span>
            }
          ></Blog_item>
        </Link>
      ))}
    </div>
  );
}
