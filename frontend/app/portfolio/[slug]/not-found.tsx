import Link from "next/link";
import { IconFolderKanban, IconArrowRight } from "../../../components/Icons";

export default function ProjectNotFound() {
  return (
    <div className="section-padding section-modern">
      <div className="container-page text-center py-16">
        <IconFolderKanban className="w-14 h-14 text-slate-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-primary">Project not found</h1>
        <p className="mt-2 text-slate-600">This project may have been removed or the link is incorrect.</p>
        <Link href="/portfolio" className="btn-primary mt-6 inline-flex items-center gap-2">
          <IconArrowRight className="w-4 h-4 rotate-180" /> Back to portfolio
        </Link>
      </div>
    </div>
  );
}
