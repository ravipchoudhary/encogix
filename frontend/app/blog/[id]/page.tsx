import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

async function getBlog(id: string) {
  try {
    const res = await fetch(`/api/blogs/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return null;
    return res.json();
  } catch (_) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const blog = await getBlog(params.id);
  if (!blog) return { title: "Blog | Encogix Technology" };
  return {
    title: `${blog.title} | Encogix Technology Blog`,
    description: String(blog.content || "").slice(0, 160),
    openGraph: {
      title: blog.title,
      description: String(blog.content || "").slice(0, 160),
      images: blog.image ? [blog.image] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: { params: { id: string } }) {
  const blog = await getBlog(params.id);
  if (!blog) notFound();

  const date = blog.createdAt || blog.created_at;

  return (
    <article className="section-padding section-modern">
      <div className="container-page max-w-3xl">
        <Link href="/blog" className="text-sm text-secondary hover:underline mb-6 inline-block">
          ← Back to blog
        </Link>
        {blog.image && (
          <img src={blog.image} alt={blog.title} className="w-full rounded-2xl mb-8 object-cover max-h-96" loading="lazy" />
        )}
        <h1 className="text-3xl sm:text-4xl font-bold text-primary">{blog.title}</h1>
        <p className="mt-2 text-sm text-slate-500">
          {blog.author && <span>By {blog.author}</span>}
          {date && <span> · {new Date(date).toLocaleDateString()}</span>}
        </p>
        <div className="mt-8 prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
          {blog.content}
        </div>
      </div>
    </article>
  );
}
