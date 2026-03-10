import Link from "next/link";

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
    <div className="section-padding">
      <div className="container-page space-y-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-primary">
            Portfolio
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl">
            Selected projects we&apos;ve delivered for clients across industries.
          </p>
        </div>

        {projects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p: { id: number; title: string; description: string; image: string | null; category: string | null }) => (
              <div key={p.id} className="card overflow-hidden">
                {p.image ? (
                  <div className="relative h-48 -mx-6 -mt-6 mb-4 bg-slate-100 overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ) : (
                  <div className="h-48 -mx-6 -mt-6 mb-4 bg-slate-100 flex items-center justify-center text-slate-400">
                    No image
                  </div>
                )}
                {p.category && <span className="chip mb-2">{p.category}</span>}
                <h2 className="text-lg font-semibold text-primary">{p.title}</h2>
                <p className="text-sm text-slate-600 line-clamp-3">{p.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-16 text-slate-500">
            <p>No projects added yet. Check back soon.</p>
            <Link href="/" className="text-secondary text-sm mt-2 inline-block">← Back to home</Link>
          </div>
        )}
      </div>
    </div>
  );
}
