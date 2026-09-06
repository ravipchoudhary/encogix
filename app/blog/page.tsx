import Link from "next/link";
import { IconFileText, IconArrowRight } from "../../components/Icons";

async function getBlogs() {
  try {
    const res = await fetch('/api/blogs', { cache: "no-store" });
    if (!res.ok) return [];
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return [];
    return res.json();
  } catch (_) {
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <div className="section-padding section-modern">
      <div className="container-page space-y-10">
        <div className="page-hero-modern">
          <span className="chip mb-4 inline-flex items-center gap-2"><IconFileText className="w-4 h-4" /> Insights</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary flex items-center gap-2">
            <IconFileText className="w-8 h-8 text-secondary" /> Blog
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl">
            Insights on technology, digital transformation, and industry trends.
          </p>
        </div>

        {blogs.length > 0 ? (
          <div className="space-y-6">
            {blogs.map((b: { id: number; title: string; content: string; author: string | null; image: string | null; created_at: string | null }) => (
              <Link key={b.id} href={`/blog/${b.id}`} className="card block hover:shadow-md transition overflow-hidden">
                {b.image && (
                  <div className="h-48 -mx-6 -mt-6 mb-4 bg-slate-100">
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                )}
                <h2 className="text-lg font-semibold text-primary">{b.title}</h2>
                <p className="text-sm text-slate-500 mt-1">
                  {b.author && <span>By {b.author}</span>}
                  {b.created_at && <span> • {new Date(b.created_at).toLocaleDateString()}</span>}
                </p>
                <p className="text-sm text-slate-600 mt-2 line-clamp-2">{b.content?.replace(/<[^>]*>/g, "") || ""}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card card-3d block-3d text-center py-16 text-slate-500">
            <IconFileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p>No blog posts yet. Check back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
