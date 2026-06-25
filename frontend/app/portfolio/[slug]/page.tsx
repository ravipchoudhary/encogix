import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  IconFolderKanban,
  IconImage,
  IconArrowRight,
  IconBriefcase,
  IconGlobe,
} from "../../../components/Icons";
import { projectPath } from "../../../lib/slug";

export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string | null;
  category: string | null;
  client: string | null;
  technologies: string | null;
  project_url: string | null;
}

async function getProject(slug: string): Promise<Project | null> {
  try {
    const res = await fetch(`/api/projects/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return null;
    return res.json();
  } catch (_) {
    return null;
  }
}

async function getAllProjects(): Promise<Project[]> {
  try {
    const res = await fetch('/api/projects', { cache: "no-store" });
    if (!res.ok) return [];
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return [];
    return res.json();
  } catch (_) {
    return [];
  }
}

function parseTechnologies(raw: string | null): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/[,;|]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function descriptionParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}|\r\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project Not Found | Encogix Technology" };
  const summary = project.description?.replace(/\s+/g, " ").trim().slice(0, 160);
  return {
    title: `${project.title} | Portfolio | Encogix Technology`,
    description: summary || `Case study: ${project.title}`,
    openGraph: {
      title: project.title,
      description: summary,
      ...(project.image ? { images: [{ url: project.image }] } : {}),
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const all = await getAllProjects();
  const related = all.filter((p) => p.id !== project.id).slice(0, 3);
  const techList = parseTechnologies(project.technologies);
  const paragraphs = descriptionParagraphs(project.description || "");

  return (
    <div className="section-padding section-modern">
      <div className="container-page space-y-10">
        <nav className="text-sm text-slate-500 flex flex-wrap items-center gap-2">
          <Link href="/portfolio" className="hover:text-secondary transition-colors inline-flex items-center gap-1">
            <IconFolderKanban className="w-4 h-4" /> Portfolio
          </Link>
          <span aria-hidden>/</span>
          <span className="text-primary font-medium truncate max-w-[200px] sm:max-w-none">{project.title}</span>
        </nav>

        <header className="page-hero-modern">
          {project.category && (
            <span className="chip mb-4 inline-flex">{project.category}</span>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">{project.title}</h1>
          {project.client && (
            <p className="mt-3 text-slate-600 flex items-center gap-2">
              <IconBriefcase className="w-5 h-5 text-secondary shrink-0" />
              Client: <span className="font-medium text-primary">{project.client}</span>
            </p>
          )}
        </header>

        {project.image ? (
          <div className="rounded-2xl shadow-xl border border-slate-200/80 bg-slate-100 flex items-center justify-center p-2 sm:p-4">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-auto max-h-[min(70vh,640px)] object-contain rounded-lg"
              loading="eager"
            />
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center min-h-[200px] text-slate-400">
            <IconImage className="w-16 h-16" />
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
          <article className="lg:col-span-2 space-y-6">
            <section className="card card-3d block-3d">
              <h2 className="text-xl font-semibold text-primary mb-4">Project overview</h2>
              <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
                {paragraphs.length > 0 ? (
                  paragraphs.map((para, i) => (
                    <p key={i} className="text-sm sm:text-base leading-relaxed whitespace-pre-line">
                      {para}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No description provided.</p>
                )}
              </div>
            </section>

            {techList.length > 0 && (
              <section className="card card-3d block-3d lg:hidden">
                <h2 className="text-lg font-semibold text-primary mb-3">Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {techList.map((t) => (
                    <span key={t} className="chip text-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </article>

          <aside className="space-y-6">
            <div className="card card-3d block-3d sticky top-24 space-y-5">
              <h2 className="text-lg font-semibold text-primary">Project details</h2>
              <dl className="space-y-4 text-sm">
                {project.category && (
                  <div>
                    <dt className="text-slate-500 font-medium">Industry</dt>
                    <dd className="mt-1 text-primary">{project.category}</dd>
                  </div>
                )}
                {project.client && (
                  <div>
                    <dt className="text-slate-500 font-medium">Client</dt>
                    <dd className="mt-1 text-primary">{project.client}</dd>
                  </div>
                )}
                {techList.length > 0 && (
                  <div className="hidden lg:block">
                    <dt className="text-slate-500 font-medium mb-2">Technologies</dt>
                    <dd className="flex flex-wrap gap-2">
                      {techList.map((t) => (
                        <span key={t} className="chip text-xs">
                          {t}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
              {project.project_url && (
                <a
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline w-full inline-flex items-center justify-center gap-2 text-sm"
                >
                  <IconGlobe className="w-4 h-4" /> View live project
                </a>
              )}
              <Link
                href="/contact"
                className="btn-primary w-full inline-flex items-center justify-center gap-2 text-sm"
              >
                Start a similar project <IconArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="space-y-6 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-primary">More projects</h2>
              <Link href="/portfolio" className="text-sm font-semibold text-secondary inline-flex items-center gap-1">
                View all <IconArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={projectPath(p.slug, p.title)}
                  className="card card-3d block-3d overflow-hidden group hover:shadow-lg transition-shadow"
                >
                  {p.image ? (
                    <div className="-mx-6 mb-4 bg-slate-100 flex items-center justify-center min-h-[10rem] p-2">
                      <img src={p.image} alt={p.title} className="w-full h-auto max-h-40 object-contain group-hover:scale-[1.02] transition-transform" loading="lazy" />
                    </div>
                  ) : (
                    <div className="-mx-6 mb-4 min-h-[10rem] bg-slate-100 flex items-center justify-center text-slate-400">
                      <IconImage className="w-10 h-10" />
                    </div>
                  )}
                  {p.category && <span className="chip text-xs mb-2">{p.category}</span>}
                  <h3 className="font-semibold text-primary group-hover:text-secondary transition-colors">{p.title}</h3>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">{p.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/portfolio" className="btn-outline inline-flex items-center gap-2">
            <IconArrowRight className="w-4 h-4 rotate-180" /> Back to portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
