import Link from "next/link";
import JobList from "../../components/JobList";
import { IconBriefcase, IconMail } from "../../components/Icons";

export default function CareerPage() {
  return (
    <div className="section-padding section-modern">
      <div className="container-page space-y-10">
        <div className="page-hero-modern">
          <span className="chip mb-4 inline-flex items-center gap-2"><IconBriefcase className="w-4 h-4" /> Join Us</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary flex items-center gap-2">
            <IconBriefcase className="w-8 h-8 text-secondary" /> Careers
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl">
            Join Encogix Technology and work on challenging projects with talented teams.
          </p>
        </div>

        <JobList />

        <div className="card card-3d block-3d bg-slate-50 text-center py-10">
          <IconMail className="w-10 h-10 text-secondary mx-auto mb-3" />
          <p className="text-slate-600">Don&apos;t see a fit? Send your resume to <a href="mailto:careers@encogix.com" className="text-secondary font-medium">careers@encogix.com</a></p>
        </div>
      </div>
    </div>
  );
}
