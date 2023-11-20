import Blog_item from '@/components/blog_item';
import { getSortedPostsData } from '@/utils/posts';

export default function Home() {
  const posts = getSortedPostsData();
  return (
    <div>
      {posts.map(({ id, date, title, desc }) => (
        <Blog_item key={id} title={title} date={date} text={desc}></Blog_item>
      ))}
    </div>
  );
}
