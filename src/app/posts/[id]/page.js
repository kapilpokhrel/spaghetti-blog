import { getAllPostIds, getPostData } from '@/utils/posts';
import Blog_item from '@/components/blog_item';
import 'highlight.js/styles/github-dark.css';

export async function generateStaticParams() {
  const posts = getAllPostIds();

  return posts.map((post) => ({
    id: post,
  }));
}

// Multiple versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
export default async function Page({ params }) {
  const { id } = params;

  const postData = await getPostData(id);
  return (
    <Blog_item
      title={postData.title}
      date={postData.date}
      text={
        <article className='prose sm:prose-md md:prose-lg lg:prose-xl prose-slate dark:prose-invert'>
          {postData.content}
        </article>
      }
    ></Blog_item>
  );
}
