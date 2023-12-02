import { getAllPostIds, getPostData } from '@/utils/posts';
import Blog_item from '@/components/blog_item';
import 'highlight.js/styles/night-owl.css';
import Link from 'next/link';
import { londrina } from '@/components/fonts';

export async function generateMetadata({ params }) {
  const { id } = params;

  const postData = await getPostData(id);
  if (!postData) {
    return {
      title: 'Post Not Found',
    };
  }
  return {
    title: postData.title,
    description: postData.desc,
  };
}

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
  if (!postData) notFound();

  return (
    <>
      <Blog_item
        title={postData.title}
        date={postData.date}
        text={
          <article className='pb-[25px] border-b-[1px] border-white border-solid w-full max-w-none prose md:prose-lg lg:prose-xl prose-myblue prose-img:mx-auto dark:prose-invert'>
            {postData.content}
          </article>
        }
      ></Blog_item>
      <div
        className={`container mb-24 font-bold text-[20px] min-[475px]:text-[22px] sm:text-[24px] md:text-[26px] ${londrina.className}`}
      >
        <Link href='/'>Home</Link>
      </div>
    </>
  );
}
