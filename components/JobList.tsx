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
          <div key={job.id} className="card card-3d block-3d flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
            <button onClick={() => setSelected(job)} className="btn-primary shrink-0 inline-flex items-center gap-2">
              Apply Now <IconArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      {selected && (
        <JobApplyModal job={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
