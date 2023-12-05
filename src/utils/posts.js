import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remarkGfm from 'remark-gfm';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import ExportedImage from 'next-image-export-optimizer';
import Link from 'next/link';

export function CustomImage({ src, w, h }) {
  return (
    <ExportedImage
      // Here the px are the css pixel but browser will calculate the appropirate image size based on the ratio of screen pixel to css pixel
      sizes='(min-width: 768px) 768px, (min-widht: 640px) 640px, (min-width: 475px) 480px, 100vw'
      src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/${src}`}
      width={w}
      height={h}
    />
  );
}
const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    };
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  const ids = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');
    return id;
  });
  return ids;
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  let fileContents = '';
  try {
    fileContents = fs.readFileSync(fullPath, 'utf8');
  } catch (error) {
    return undefined;
  }

  const components = {
    CustomImage,
    a: (props) => <Link target='_blank' rel='noreferrer noopener' {...props} />,
  };

  const { frontmatter, content } = await compileMDX({
    source: fileContents,
    components: { ...components },
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeHighlight,
          rehypeSlug,
          [rehypeAutolinkHeadings, { behaviour: 'wrap' }],
        ],
      },
    },
  });

  return {
    id,
    content,
    ...frontmatter,
  };
}
