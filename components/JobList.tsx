"use client";

import { useEffect, useState } from "react";
import JobApplyModal from "./JobApplyModal";
import { IconBriefcase, IconArrowRight } from "./Icons";

interface Job {
  id: number;
  title: string;
  location: string;
  experience: string;
  description: string;
}

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selected, setSelected] = useState<Job | null>(null);
  const [applicationJob, setApplicationJob] = useState<Job | null>(null);

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then(setJobs)
      .catch(() => setJobs([]));
  }, []);

  if (jobs.length === 0) {
    return (
      <div className="card card-3d block-3d text-center py-12 text-slate-500">
        <IconBriefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p>No job openings at the moment. Check back soon.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            role="button"
            tabIndex={0}
            onClick={() => setSelected(job)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setSelected(job);
              }
            }}
            className="card card-3d block-3d flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary/50"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 text-secondary">
                <IconBriefcase className="w-5 h-5" />
              </div>
            <div>
              <h2 className="font-semibold text-primary">{job.title}</h2>
              <p className="text-sm text-slate-500 mt-1">
                {job.location && <span>{job.location}</span>}
                {job.experience && <span> • {job.experience}</span>}
              </p>
              <p className="text-sm text-slate-600 mt-2 line-clamp-2">{job.description}</p>
            </div>
            </div>
            <button onClick={(event) => { event.stopPropagation(); setSelected(job); }} className="btn-primary shrink-0 inline-flex items-center gap-2">
              View Details <IconArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-2xl font-semibold text-primary">{selected.title}</h2>
                <p className="text-sm text-slate-500 mt-2">
                  {selected.location || "Location flexible"}
                  {selected.experience ? ` • ${selected.experience}` : ""}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-700" aria-label="Close job details">✕</button>
            </div>
            <div className="border-t border-slate-200 pt-5">
              <h3 className="font-semibold text-primary mb-2">Job Details</h3>
              <p className="text-slate-600 whitespace-pre-line leading-relaxed">{selected.description || "Details will be shared during the interview process."}</p>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3 mt-7">
              <button onClick={() => setSelected(null)} className="btn-outline">Close</button>
              <button onClick={() => { setApplicationJob(selected); setSelected(null); }} className="btn-primary inline-flex items-center justify-center gap-2">
                Apply Now <IconArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      {applicationJob && (
        <JobApplyModal job={applicationJob} onClose={() => setApplicationJob(null)} />
      )}
    </>
  );
}
