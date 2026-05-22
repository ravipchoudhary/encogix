import Link from "next/link";
import { IconFolderKanban, IconImage, IconArrowRight } from "../../components/Icons";
import { projectPath } from "../../lib/slug";

async function getProjects() {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/projects`, { cache: "no-store" });
    if (res.ok) return res.json();
  } catch (_) {}
  return [];
}

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <div className="section-padding section-modern">
      <div className="container-page space-y-10">
        <div className="page-hero-modern">
          <span className="chip mb-4 inline-flex items-center gap-2"><IconFolderKanban className="w-4 h-4" /> Our Work</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary flex items-center gap-2">
            <IconFolderKanban className="w-8 h-8 text-secondary" /> Portfolio
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl">
            Selected projects we&apos;ve delivered for clients across industries.
          </p>
        </div>

        {projects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p: { id: number; slug?: string; title: string; description: string; image: string | null; category: string | null }) => (
              <Link
                key={p.id}
                href={projectPath(p.slug, p.title)}
                className="card card-3d block-3d group flex flex-col hover:shadow-lg transition-shadow"
              >
                {p.image ? (
                  <div className="relative -mx-6 mb-4 bg-slate-100 flex items-center justify-center min-h-[12rem] p-2 rounded-t-xl">
                    <img src={p.image} alt={p.title} className="w-full h-auto max-h-48 object-contain group-hover:scale-[1.02] transition-transform duration-300" loading="lazy" />
                  </div>
                ) : (
                  <div className="min-h-[12rem] -mx-6 mb-4 bg-slate-100 flex items-center justify-center text-slate-400 rounded-t-xl">
                    <IconImage className="w-12 h-12" />
                  </div>
                )}
                {p.category && <span className="chip mb-2 w-fit">{p.category}</span>}
                <h2 className="text-lg font-semibold text-primary group-hover:text-secondary transition-colors">{p.title}</h2>
                <p className="text-sm text-slate-600 line-clamp-3 flex-1">{p.description}</p>
                <span className="mt-4 text-sm font-semibold text-secondary inline-flex items-center gap-1">
                  View project <IconArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card card-3d text-center py-16 text-slate-500">
            <p>No projects added yet. Check back soon.</p>
            <Link href="/" className="text-secondary text-sm mt-2 inline-flex items-center gap-1"><IconArrowRight className="w-4 h-4 rotate-180" /> Back to home</Link>
          </div>
        )}
      </div>
    </div>
  );
}
