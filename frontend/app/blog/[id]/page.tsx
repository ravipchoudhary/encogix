import Link from "next/link";
import { IconFileText, IconArrowRight } from "../../../components/Icons";

async function getBlog(id: string) {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/blogs/${id}`, { cache: "no-store" });
    if (res.ok) return res.json();
  } catch (_) {}
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blog = await getBlog(id);
  if (!blog) return { title: "Blog not found | Encogix Technology" };
  return { title: `${blog.title} | Encogix Technology Blog` };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    return (
      <div className="section-padding section-modern container-page">
        <p className="text-slate-500">Blog post not found.</p>
        <Link href="/blog" className="text-secondary text-sm mt-2 inline-flex items-center gap-1"><IconArrowRight className="w-4 h-4 rotate-180" /> Back to blog</Link>
      </div>
    );
  }

  return (
    <article className="section-padding">
      <div className="container-page max-w-3xl">
        <Link href="/blog" className="text-secondary text-sm mb-4 inline-block">← Back to blog</Link>
        {blog.image && (
          <div className="block-3d w-full h-64 sm:h-80 rounded-xl overflow-hidden bg-slate-100 mb-6 shadow-lg card-flat-3d">
            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl font-semibold text-primary">{blog.title}</h1>
        <p className="text-slate-500 mt-2">
          {blog.author && <span>By {blog.author}</span>}
          {blog.created_at && <span> • {new Date(blog.created_at).toLocaleDateString()}</span>}
        </p>
        <div className="prose prose-slate mt-8 max-w-none" dangerouslySetInnerHTML={{ __html: blog.content?.replace(/\n/g, "<br />") || "" }} />
      </div>
    </article>
  );
}
