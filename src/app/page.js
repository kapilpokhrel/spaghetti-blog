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
              <div className='prose w-full md:prose-lg lg:prose-xl prose-myblue dark:prose-invert'>
                {desc}
              </div>
            }
          ></Blog_item>
        </Link>
      ))}
    </div>
  );
}
