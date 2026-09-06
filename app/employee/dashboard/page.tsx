"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function empAuthHeaders() {
  return { Authorization: "Bearer " + (typeof window !== "undefined" ? localStorage.getItem("employee_token") : "") };
}

interface CelebrationItem {
  id: number;
  name: string;
  date?: string;
  daysAway?: number;
}

interface Celebrations {
  birthdays: CelebrationItem[];
  anniversaries: CelebrationItem[];
  upcoming?: { birthdays: CelebrationItem[]; anniversaries: CelebrationItem[] };
}

export default function EmployeeDashboardPage() {
  const router = useRouter();
  const [today, setToday] = useState<{ punch_in: string | null; punch_out: string | null; punch_in_location?: string | null; punch_out_location?: string | null } | null>(null);
  const [profile, setProfile] = useState<{ name: string; designation: string } | null>(null);
  const [celebrations, setCelebrations] = useState<Celebrations>({ birthdays: [], anniversaries: [] });
  const [announcements, setAnnouncements] = useState<{ id: number; title: string; content: string; created_at: string }[]>([]);
  const [leaveStatus, setLeaveStatus] = useState<{ pending: number }>({ pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("employee_token");
    if (!token) {
      router.replace("/employee/login");
      return;
    }
    Promise.all([
      fetch("/api/employee/today", { headers: empAuthHeaders() }).then((r) => (r.status === 401 ? router.replace("/employee/login") : r.json())).then(setToday),
      fetch("/api/employee/profile", { headers: empAuthHeaders() }).then((r) => (r.status === 401 ? null : r.json())).then(setProfile),
      fetch("/api/employee/celebrations", { headers: empAuthHeaders() })
        .then((r) => (r.ok ? r.json() : { birthdays: [], anniversaries: [], upcoming: { birthdays: [], anniversaries: [] } }))
        .then((d) => setCelebrations({ birthdays: d.birthdays || [], anniversaries: d.anniversaries || [], upcoming: d.upcoming || { birthdays: [], anniversaries: [] } })),
      fetch("/api/employee/announcements", { headers: empAuthHeaders() }).then((r) => (r.ok ? r.json() : [])).then((arr) => setAnnouncements(Array.isArray(arr) ? arr.slice(0, 3) : [])),
      fetch("/api/employee/leave", { headers: empAuthHeaders() }).then((r) => (r.ok ? r.json() : [])).then((arr) => {
        const list = Array.isArray(arr) ? arr : [];
        setLeaveStatus({ pending: list.filter((l: { status: string }) => l.status === "pending").length });
      }),
    ]).catch(() => {});
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [router]);

  if (loading) return <div className="section-padding container-page"><p className="text-slate-500">Loading…</p></div>;

  const canPunchIn = !today?.punch_in;
  const canPunchOut = today?.punch_in && !today?.punch_out;
  const hasToday = celebrations.birthdays.length > 0 || celebrations.anniversaries.length > 0;
  const upcomingB = celebrations.upcoming?.birthdays || [];
  const upcomingA = celebrations.upcoming?.anniversaries || [];
  const hasUpcoming = upcomingB.length > 0 || upcomingA.length > 0;
  const showCelebrations = hasToday || hasUpcoming;

  const punchIn = async () => {
    const res = await fetch("/api/employee/punch-in", { method: "POST", headers: empAuthHeaders() });
    if (res.ok) setToday((t) => (t ? { ...t, punch_in: new Date().toISOString() } : { punch_in: new Date().toISOString(), punch_out: null })); else alert((await res.json()).message || "Failed");
  };
  const punchOut = async () => {
    const res = await fetch("/api/employee/punch-out", { method: "POST", headers: empAuthHeaders() });
    if (res.ok) setToday((t) => (t ? { ...t, punch_out: new Date().toISOString() } : null)); else alert((await res.json()).message || "Failed");
  };

  const quickLinks = [
    { href: "/employee/leads", label: "My Leads", desc: "View and update assigned customer inquiries and follow-up notes.", icon: "📋" },
    {
      href: "/employee/attendance",
      label: "Attendance",
      desc: "View your daily punch-in and punch-out records, track working hours, and monitor your attendance history in one place.",
      icon: "📋",
    },
    {
      href: "/employee/profile",
      label: "My Profile",
      desc: "Update your contact details, designation, and personal information so HR and your team always have the latest data.",
      icon: "👤",
    },
    {
      href: "/employee/leave",
      label: "Leave Request",
      desc: "Submit new leave requests, review approval status, and keep a clear record of your time off and planned vacations.",
      icon: "📅",
    },
    {
      href: "/employee/announcements",
      label: "Announcements",
      desc: "Stay informed about important company news, events, policy changes, and updates shared by the management team.",
      icon: "📢",
    },
  ];

  return (
    <div className="section-padding section-modern">
      <div className="container-page max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-1">Welcome, {profile?.name || "Employee"}!</h1>
        {profile?.designation && <p className="text-slate-600">{profile.designation}</p>}
        <p className="text-sm text-slate-500 mt-1">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2 card card-3d block-3d">
          <h2 className="text-lg font-semibold text-primary mb-1">Today&apos;s Attendance</h2>
          <p className="text-sm text-slate-600 mb-4">
            Keep your workday on track by recording accurate punch-in and punch-out times. This dashboard helps you monitor your
            daily presence, maintain transparency with HR, and build a consistent attendance record.
          </p>
          <div className="flex flex-wrap gap-6 mb-4">
            <div className="flex-1 min-w-[120px] px-5 py-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/60">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Punch In</p>
              <p className="font-mono font-semibold text-lg mt-1">{today?.punch_in ? new Date(today.punch_in).toLocaleTimeString() : "—"}</p>
              {today?.punch_in_location && <p className="text-xs text-slate-600 mt-1" title={today.punch_in_location}>📍 {today.punch_in_location}</p>}
            </div>
            <div className="flex-1 min-w-[120px] px-5 py-4 rounded-xl bg-gradient-to-br from-sky-50 to-sky-100/60">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Punch Out</p>
              <p className="font-mono font-semibold text-lg mt-1">{today?.punch_out ? new Date(today.punch_out).toLocaleTimeString() : "—"}</p>
              {today?.punch_out_location && <p className="text-xs text-slate-600 mt-1" title={today.punch_out_location}>📍 {today.punch_out_location}</p>}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={punchIn} disabled={!canPunchIn} className="btn-primary disabled:opacity-50 disabled:hover:translate-y-0">Punch In</button>
            <button onClick={punchOut} disabled={!canPunchOut} className="btn-outline disabled:opacity-50">Punch Out</button>
            <Link href="/employee/attendance" className="btn-outline">View Attendance</Link>
          </div>
        </div>

        <div className="space-y-4">
          {leaveStatus.pending > 0 && (
            <Link href="/employee/leave" className="block card card-3d block-3d border-amber-200 bg-amber-50/70 hover:border-amber-300">
              <p className="font-semibold text-amber-800">⏳ {leaveStatus.pending} Pending Leave{leaveStatus.pending > 1 ? "s" : ""}</p>
              <p className="text-sm text-amber-700 mt-1">View status →</p>
            </Link>
          )}
          <Link href="/employee/profile" className="block card card-3d block-3d hover:border-secondary/30">
            <p className="font-semibold text-primary">🎂 Celebrations</p>
            <p className="text-sm text-slate-600 mt-1">Send birthday & work anniversary wishes</p>
          </Link>
        </div>
      </div>

      {showCelebrations && (
        <div className="card card-3d block-3d mb-8">
          <h2 className="text-lg font-semibold text-primary mb-4">🎂 Birthdays & Work Anniversaries</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Today</h3>
              {hasToday ? (
                <div className="flex flex-wrap gap-4">
                  {celebrations.birthdays.length > 0 && (
                    <div className="rounded-xl bg-pink-50 border border-pink-100 px-4 py-3 flex-1 min-w-[140px]">
                      <p className="text-xs text-pink-600 font-medium mb-1">Birthday</p>
                      {celebrations.birthdays.map((e) => (
                        <p key={e.id} className="font-semibold text-primary">{e.name}</p>
                      ))}
                    </div>
                  )}
                  {celebrations.anniversaries.length > 0 && (
                    <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 flex-1 min-w-[140px]">
                      <p className="text-xs text-blue-600 font-medium mb-1">Work Anniversary</p>
                      {celebrations.anniversaries.map((e) => (
                        <p key={e.id} className="font-semibold text-primary">{e.name}</p>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No birthdays or work anniversaries today. When your teammates are celebrating, you&apos;ll see their names here so
                  you can send a quick wish.
                </p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Upcoming (next 7 days)</h3>
              {hasUpcoming ? (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {upcomingB.slice(0, 5).map((e) => (
                    <div key={`b-${e.id}-${e.daysAway}`} className="flex justify-between items-center text-sm py-1.5 px-2 rounded-lg bg-pink-50/70">
                      <span className="font-medium text-primary">{e.name}</span>
                      <span className="text-pink-600 text-xs">Birthday in {e.daysAway}d</span>
                    </div>
                  ))}
                  {upcomingA.slice(0, 5).map((e) => (
                    <div key={`a-${e.id}-${e.daysAway}`} className="flex justify-between items-center text-sm py-1.5 px-2 rounded-lg bg-blue-50/70">
                      <span className="font-medium text-primary">{e.name}</span>
                      <span className="text-blue-600 text-xs">Anniversary in {e.daysAway}d</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  There are no upcoming birthdays or work anniversaries in the next seven days. Check back later for new team
                  celebrations.
                </p>
              )}
            </div>
          </div>
          <Link href="/employee/profile" className="inline-flex items-center gap-1 mt-4 text-secondary text-sm font-semibold hover:underline">
            Send wishes →
          </Link>
        </div>
      )}

      {!showCelebrations && (
        <div className="card card-3d block-3d mb-8 border-dashed border-slate-200">
          <h2 className="text-lg font-semibold text-primary mb-2">🎂 Birthdays & Work Anniversaries</h2>
          <p className="text-slate-500 text-sm mb-3">
            There are currently no team celebrations scheduled for today or the coming week. Make sure your date of birth and join
            date are updated in your profile so colleagues can see and celebrate your special days.
          </p>
          <Link href="/employee/profile" className="text-secondary text-sm font-medium hover:underline">View Profile →</Link>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-primary">Recent Announcements</h2>
            <Link href="/employee/announcements" className="text-secondary text-sm font-medium hover:underline">View all</Link>
          </div>
          {announcements.length > 0 ? (
            <div className="space-y-3">
              {announcements.map((a) => (
                <Link key={a.id} href="/employee/announcements" className="block card card-3d hover:border-secondary/20 transition-colors">
                  <h3 className="font-medium text-primary">{a.title}</h3>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">{a.content}</p>
                  <p className="text-xs text-slate-400 mt-2">{new Date(a.created_at).toLocaleDateString()}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card-flat text-center py-8 text-slate-500">No announcements yet.</div>
          )}
        </div>

        <div>
          <h2 className="font-semibold text-primary mb-4">Quick Links</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickLinks.map((item) => (
              <Link key={item.href} href={item.href} className="card card-3d block-3d flex items-center gap-4 hover:border-secondary/30 group">
                <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg">
                  {item.icon}
                </span>
                <div>
                  <h3 className="font-semibold text-primary group-hover:text-secondary">{item.label}</h3>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
