import { getAllPostIds, getPostData } from '@/utils/posts';
import Blog_item from '@/components/blog_item';
import 'highlight.js/styles/night-owl.css';
import Link from 'next/link';
import { londrina } from '@/components/fonts';
import Footer from '@/components/footer';

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
    keywords: postData.keywords,
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
          <article className='pb-[42px] border-b-[1px] border-white border-solid w-full max-w-none prose md:prose-lg lg:prose-xl prose-myblue prose-img:mx-auto dark:prose-invert'>
            {postData.content}
          </article>
        }
      ></Blog_item>
      <Footer
        author={postData.author}
        author_links={postData.author_links}
      ></Footer>
    </>
  );
}
