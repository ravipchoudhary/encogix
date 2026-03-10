import Link from "next/link";
import JobList from "../../components/JobList";

export default function CareerPage() {
  return (
    <div className="section-padding">
      <div className="container-page space-y-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-primary">
            Careers
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl">
            Join Encogix Technology and work on challenging projects with talented teams.
          </p>
        </div>

        <JobList />

        <div className="card bg-slate-50 text-center py-10">
          <p className="text-slate-600">Don&apos;t see a fit? Send your resume to <a href="mailto:careers@encogix.com" className="text-secondary">careers@encogix.com</a></p>
        </div>
      </div>
    </div>
  );
}
