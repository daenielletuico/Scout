import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  CalendarDays, ListChecks, StickyNote, Plus, X, Trash2, MapPin,
  Copy, Check, Circle, CheckCircle2, ExternalLink, Heart, Flame,
  Search, Inbox as InboxIcon, Link2, User, Play, Pause,
  RotateCcw, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, GraduationCap, Sparkles,
  ArrowLeft, ImageIcon, Download, Upload, StickyNote as NoteIcon, Mic, MicOff, Wand2,
  Archive, Lightbulb, Activity as ActivityIcon, Target, Folder, FolderPlus, Wallet,
  Settings as SettingsIcon, Sun, Moon, Bell, BellOff, GripVertical, CalendarPlus,
  Snowflake, LayoutGrid, List as ListIcon, Pencil, CornerDownRight, TrendingUp, Undo2, Mail,
} from "lucide-react";

/* =====================================================================
   Scout — a warm, single-person planner.
   Visual direction: "Cabin at Golden Hour" (day) / "Cabin After Dark" (night).
   All colour lives in CSS variables so the whole app can switch themes
   without threading a theme object through sixty components.
   ===================================================================== */

const THEME_CSS = `
/* ---- neutrals come from the mode ---- */
.scout-root {
  --card:#FFFAF2; --card-2:#FDF4E5; --input:#FBF0DD; --border:#E7CFAD; --border-soft:#F1E4CD;
  --text:#42291A; --muted:#8A7059; --scrim:rgba(66,41,26,0.44);
  --shadow:0 6px 20px rgba(139,90,60,0.18); --shadow-lg:0 18px 48px rgba(139,90,60,0.26);
  --header:rgba(255,250,242,0.72); --ring:rgba(0,0,0,0.06);
}
.scout-root[data-theme="dark"] {
  --card:#2A1D14; --card-2:#231810; --input:#1D140F; --border:#4A3423; --border-soft:#38261A;
  --text:#F4E6D0; --muted:#AB9078; --scrim:rgba(0,0,0,0.58);
  --shadow:0 6px 20px rgba(0,0,0,0.42); --shadow-lg:0 18px 48px rgba(0,0,0,0.55);
  --header:rgba(42,29,20,0.76); --ring:rgba(255,255,255,0.07);
}

/* ---- character comes from the palette ---- */
.scout-root[data-palette="golden"] { --accent:#E8A93B; --sage:#7A9150; --gold:#B4681F; --coral:#D9714A; --green:#5E8570; --red:#BC3D2A; --violet:#7D6BB5;
  --a1:#F0B93F; --a2:#D9714A; --a3:#7A9150; }
.scout-root[data-palette="ube"] { --accent:#9B7BD4; --sage:#6FA8A0; --gold:#7B5BB8; --coral:#E0779E; --green:#4F9E86; --red:#C4425C; --violet:#8B6BC7;
  --a1:#A98BE0; --a2:#E0779E; --a3:#6FA8A0; }
.scout-root[data-palette="seaglass"] { --accent:#3E9E9E; --sage:#6E9E5A; --gold:#2C7C82; --coral:#E08A5E; --green:#3F9174; --red:#C0503F; --violet:#6C7FC0;
  --a1:#4FB0AC; --a2:#6C7FC0; --a3:#E08A5E; }
.scout-root[data-palette="ember"] { --accent:#E4693F; --sage:#9A8A4E; --gold:#B24A24; --coral:#D4506B; --green:#6E8F5E; --red:#B93A2E; --violet:#8D5F94;
  --a1:#F07A45; --a2:#D4506B; --a3:#9A8A4E; }

.scout-root[data-theme="dark"][data-palette="golden"] { --accent:#E8A93B; --sage:#A9C07C; --gold:#EBB765; --coral:#E8825C; --green:#83B99C; --red:#E2705A; }
.scout-root[data-theme="dark"][data-palette="ube"] { --accent:#B79BE8; --sage:#8FC7BE; --gold:#C4AAF0; --coral:#F09BBB; --green:#78C4AA; --red:#E8798F; }
.scout-root[data-theme="dark"][data-palette="seaglass"] { --accent:#5CC2C0; --sage:#9FC788; --gold:#7FD6D2; --coral:#F0A47C; --green:#6FBFA0; --red:#E0806E; }
.scout-root[data-theme="dark"][data-palette="ember"] { --accent:#F0865C; --sage:#C4B375; --gold:#F5A17C; --coral:#EE7C93; --green:#9BC08A; --red:#E86A5A; }

.scout-root { --accent-text:#3A2411; --accent-soft:color-mix(in srgb, var(--accent) 22%, transparent); }
.scout-root[data-theme="dark"] { --accent-text:#241709; --accent-soft:color-mix(in srgb, var(--accent) 20%, transparent); }

/* ---- the sky moves with the real hour ---- */
.scout-root[data-tod="dawn"]      { --bg:linear-gradient(180deg,#F7D9C0 0%,#EFB89A 45%,#9C7A72 100%); --sky-top:#FBE3CE; --sky-bot:#EBA98A; --sun:#F7C06A; --hill:#7E5A50; }
.scout-root[data-tod="morning"]   { --bg:linear-gradient(180deg,#FAE8BE 0%,#F0C98A 45%,#A57F58 100%); --sky-top:#FCEDCD; --sky-bot:#EFC17F; --sun:#F8CE5E; --hill:#8A6244; }
.scout-root[data-tod="afternoon"] { --bg:linear-gradient(180deg,#FBEBC4 0%,#EDBE7B 45%,#9E7350 100%); --sky-top:#FDF0D4; --sky-bot:#EEBA76; --sun:#F6BE43; --hill:#8B5F41; }
.scout-root[data-tod="golden"]    { --bg:linear-gradient(180deg,#FAE0AE 0%,#EDA968 45%,#96603F 100%); --sky-top:#FBE2B4; --sky-bot:#E99C60; --sun:#F5A93B; --hill:#7E5238; }
.scout-root[data-tod="dusk"]      { --bg:linear-gradient(180deg,#E7B392 0%,#A87694 45%,#4E4468 100%); --sky-top:#EDBFA0; --sky-bot:#9C6E90; --sun:#F0A06C; --hill:#463C5C; }
.scout-root[data-tod="night"]     { --bg:linear-gradient(180deg,#3B2B47 0%,#241C33 45%,#12101C 100%); --sky-top:#3A2A46; --sky-bot:#1C1626; --sun:#F0E0B0; --hill:#151220; }
.scout-root[data-theme="dark"][data-tod="dawn"],
.scout-root[data-theme="dark"][data-tod="morning"],
.scout-root[data-theme="dark"][data-tod="afternoon"],
.scout-root[data-theme="dark"][data-tod="golden"],
.scout-root[data-theme="dark"][data-tod="dusk"] { --bg:linear-gradient(180deg,#3C2A1C 0%,#261911 45%,#141009 100%); --sky-top:#3A2A46; --sky-bot:#1D1725; --sun:#F0E0B0; --hill:#161219; }
`;


const PALETTES = [["golden", "Golden hour"], ["ube", "Ube"], ["seaglass", "Sea glass"], ["ember", "Ember"]];
const CARD = "var(--card)", CARD_2 = "var(--card-2)", INPUT_BG = "var(--input)";
const BORDER = "var(--border)", BORDER_SOFT = "var(--border-soft)";
const TEXT = "var(--text)", MUTED = "var(--muted)";
const ACCENT = "var(--accent)", ACCENT_TEXT = "var(--accent-text)", ACCENT_SOFT = "var(--accent-soft)";
const SAGE = "var(--sage)", GOLD = "var(--gold)", CORAL = "var(--coral)";
const GREEN = "var(--green)", RED = "var(--red)", VIOLET = "var(--violet)";
const HEADER_BG = "var(--header)", CARD_SHADOW = "var(--shadow)", SHADOW_LG = "var(--shadow-lg)";
const BASE_GRADIENT = "var(--bg)";

const ORG_COLORS = ["#D9714A", "#D98F2B", "#8E7CC3", "#6B9080", "#B5654A", "#C97B9E", "#7A8C5A", "#A0785A"];
const IMPORTANCE_COLORS = { 3: RED, 2: ACCENT, 1: GREEN };
const IMPORTANCE_LABELS = { 3: "Must do today", 2: "Would be good", 1: "If there's time" };
const URGENCY_COLORS = { overdue: RED, urgent: RED, soon: CORAL, upcoming: ACCENT, calm: BORDER };

const TAB_TINTS = {
  calendar: "radial-gradient(120% 60% at 50% 0%, var(--glow-b), transparent 60%)",
  goals: "radial-gradient(120% 60% at 50% 0%, rgba(74,123,167,0.16), transparent 60%)",
  today: "transparent",
  notes: "radial-gradient(120% 60% at 50% 0%, rgba(122,140,90,0.18), transparent 60%)",
  reflect: "radial-gradient(120% 60% at 50% 0%, var(--glow-a), transparent 60%)",
  apply: "radial-gradient(120% 60% at 50% 0%, rgba(74,123,167,0.18), transparent 60%)",
};

/* Seed versions are intentionally unchanged so existing data is never clobbered. */
const ORG_VERSION = "v2-personal-puso-localcolor-freelance";
const APPS_VERSION = "v1-seeded-roadmap";
const MILESTONES_VERSION = "v1-seeded-roadmap";
const NOTES_VERSION = "v2-org-folders";
const SCHEMA_VERSION = 3;

const STATUS_META = {
  not_started: { label: "Not started", color: MUTED, short: "To do" },
  researching: { label: "Researching", color: SAGE, short: "Research" },
  watching: { label: "Watching", color: CORAL, short: "Watching" },
  applied: { label: "Applied", color: SAGE, short: "Applied" },
  accepted: { label: "Accepted", color: GREEN, short: "In" },
  waitlisted: { label: "Waitlisted", color: VIOLET, short: "Waitlist" },
  rejected: { label: "Rejected", color: RED, short: "Closed" },
};
const KANBAN_COLUMNS = ["not_started", "researching", "applied", "accepted", "rejected"];

const RECURRENCE_META = {
  none: { label: "Once", short: "" },
  daily: { label: "Every day", short: "daily" },
  weekdays: { label: "Weekdays", short: "Mon–Fri" },
  weekly: { label: "Every week", short: "weekly" },
  monthly: { label: "Every month", short: "monthly" },
};

const ADVICE = [
  "Progress, not perfection — one task at a time.",
  "Drink some water and check in with yourself.",
  "You don't have to finish everything today.",
  "Take five minutes to just breathe before your next task.",
  "Celebrate the small wins — they add up.",
  "It's okay to say no to protect your energy.",
  "A short walk can reset your whole afternoon.",
  "You're allowed to rest without earning it.",
  "Write down one thing that's weighing on you, then set it aside.",
  "Done is better than perfect — ship it.",
  "Check in: how's your energy right now?",
  "Deadlines matter, but so do you.",
  "One deep breath in, one slow breath out.",
  "You've handled hard days before. You can handle this one.",
  "Give yourself the grace you'd give a friend.",
];

const MOODS = ["😄", "🙂", "😐", "😔", "😣"];
const PHASE_ORDER = ["Right now — PH Trip", "Sep–Oct 2026", "Nov–Dec 2026", "Jan–Mar 2027", "Apr–Jun 2027"];
const PHASE_LABELS = {
  "Right now — PH Trip": "Before you leave for PH",
  "Sep–Oct 2026": "Build your foundation",
  "Nov–Dec 2026": "Early apps + UC applications",
  "Jan–Mar 2027": "Peak application season",
  "Apr–Jun 2027": "Close out + move to LA",
};

const BUDGET_CATEGORIES = ["Rent", "Food", "Transport", "School", "Fun", "Savings", "Other"];

/* ================= seed data ================= */

const genId = () => `id_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const SEED_ORGS = [
  { id: "org_personal", name: "Personal", color: "#D98F2B", archived: false },
  { id: "org_puso", name: "PUSO", color: "#D9714A", archived: false },
  { id: "org_localcolor", name: "Local Color", color: "#8E7CC3", archived: false },
  { id: "org_freelance", name: "Freelancing", color: "#7A8C5A", archived: false },
];

const SEED_EVENTS = [
  { id: "ev_seed_1", title: "Pasadena CC Deadline Check", start: "2026-08-07T11:00:00-07:00", end: "2026-08-07T12:00:00-07:00", orgId: "org_personal", source: "google", location: "", meetingLink: "", contact: "", notes: "", travelBufferMin: null },
  { id: "ev_seed_2", title: "Member Spotlight Post (create caption + schedule 5pm)", start: "2026-08-08T05:00:00-07:00", end: "2026-08-08T06:00:00-07:00", orgId: "org_puso", source: "google", location: "", meetingLink: "", contact: "", notes: "", travelBufferMin: null },
];

const mkApp = (o) => ({ id: genId(), role: "", opens: null, deadline: null, recheckBy: null, link: "", priority: 2, tags: [], amountLabel: "", amountValue: null, requirements: [], notes: "", linkedNoteId: null, status: "not_started", ...o });

const SEED_APPLICATIONS = [
  mkApp({ name: "Jack Kent Cooke Transfer", role: "Undergraduate Transfer Scholarship", type: "scholarship", opens: "2026-08-19", deadline: "2026-12-09", priority: 3, tags: ["Transfer"], amountLabel: "Up to $55k/yr", amountValue: 55000, notes: "Largest private scholarship for CC transfer students. Needs 3.5 GPA + financial need. Apply via Common App for Transfer." }),
  mkApp({ name: "APIA Scholars", role: "General Scholarship (AANHPI)", type: "scholarship", opens: "2026-11-15", deadline: "2027-01-15", priority: 3, tags: ["AAPI"], amountLabel: "$2,500–$20k", amountValue: 20000, notes: "Open to all AANHPI undergrads. Prioritizes first-gen + financial need." }),
  mkApp({ name: "Alexander De Guia Scholarship", role: "Filipino Immigrant Leaders (Bold.org)", type: "scholarship", deadline: "2027-03-03", priority: 3, tags: ["Filipino"], amountLabel: "$5,000", amountValue: 5000, notes: "Filipino/Filipino-American CC transfer students in CA. Community service + leadership required." }),
  mkApp({ name: "Coca-Cola Scholars", role: "Achievement-Based Scholarship", type: "scholarship", opens: "2026-08-01", deadline: "2026-09-30", priority: 1, tags: ["Leadership"], amountLabel: "$20,000", amountValue: 20000, notes: "⚠️ For graduating HIGH SCHOOL seniors — check eligibility, or look at Coca-Cola First Gen instead." }),
  mkApp({ name: "Coca-Cola First Generation (HACU)", role: "First-Gen College Student Award", type: "scholarship", opens: "2027-02-01", deadline: "2027-05-15", priority: 3, tags: ["AAPI", "FirstGen"], amountLabel: "$5,000", amountValue: 5000, notes: "For first-gen students with 3.0+ GPA, at least one year completed. Check if De Anza is an HACU-member institution." }),
  mkApp({ name: "Pinay Aspire Scholarship", role: "Filipino Women in Bay Area", type: "scholarship", recheckBy: "2027-01-01", priority: 2, tags: ["Filipino", "AAPI"], amountLabel: "Varies", notes: "For young Filipino women in the 9 Bay Area counties. You're in Santa Clara — eligible." }),
  mkApp({ name: "Asian Pacific Fund Scholarships", role: "Multiple Awards (Bay Area)", type: "scholarship", recheckBy: "2027-01-01", priority: 2, tags: ["AAPI"], amountLabel: "Varies", notes: "10 scholarships for undergrad/grad API students. Closed for 2026, reopens 2027." }),
  mkApp({ name: "OCA-UPS Gold Mountain", role: "First-Gen API Students", type: "scholarship", recheckBy: "2027-01-01", priority: 2, tags: ["Leadership", "General"], amountLabel: "$2,500", amountValue: 2500, notes: "For first-gen API students in final year — better to apply at UCLA/UCI senior year." }),
  mkApp({ name: "UCLA / UCI Transfer Scholarships", role: "Institutional Merit Awards", type: "scholarship", priority: 3, tags: ["General", "Leadership"], amountLabel: "Varies widely", notes: "Automatic merit scholarships for transfer admits. Research UCLA Regents + UCI Transfer Alliance Program." }),
  mkApp({ name: "Getty Museum", role: "Getty Marrow Comms & Marketing Intern", type: "internship", opens: "2026-10-01", deadline: "2026-12-15", priority: 3, tags: ["Arts", "Transfer"], amountLabel: "Paid + housing stipend", notes: "Also listed as the Getty Marrow Scholarship. Bridges Local Color SJ experience perfectly. Apply first, before any other internship." }),
  mkApp({ name: "TikTok LA", role: "Creator Marketing / Campaign Ops", type: "internship", opens: "2026-10-01", deadline: "2027-01-31", priority: 3, tags: ["Tech"], notes: "Your TikTok presence is literally your portfolio. Apply early — competitive." }),
  mkApp({ name: "Live Nation / Insomniac", role: "Festival/Concert Marketing", type: "internship", opens: "2027-01-01", deadline: "2027-02-28", priority: 3, tags: ["Entertainment"], notes: "Your PUSO event planning is a direct match for festival marketing work." }),
  mkApp({ name: "Warner Music Group", role: "Emerging Talent Marketing", type: "internship", opens: "2027-01-01", deadline: "2027-02-28", priority: 3, tags: ["Entertainment"], notes: "Paid program, music + content intersection, great for storytelling background." }),
  mkApp({ name: "AEG / AXS", role: "Communications Intern", type: "internship", opens: "2027-01-01", deadline: "2027-03-31", priority: 3, tags: ["Entertainment"], notes: "Live events + comms. La Voz journalism experience is a strong differentiator." }),
  mkApp({ name: "Prime Video / Amazon MGM", role: "Marketing Intern", type: "internship", opens: "2026-10-01", deadline: "2026-12-31", priority: 2, tags: ["Entertainment"], notes: "Amazon opens apps very early. Set a reminder for October 2026." }),
  mkApp({ name: "Sony Pictures", role: "Marketing Intern", type: "internship", opens: "2027-01-01", deadline: "2027-02-28", priority: 2, tags: ["Entertainment"], notes: "Culver City. Studio experience, competitive but worth trying." }),
  mkApp({ name: "Spotify LA", role: "Artist/Creator Marketing", type: "internship", opens: "2026-11-01", deadline: "2027-02-28", priority: 2, tags: ["Tech"], notes: "Music + content culture. Good fit for your creator identity." }),
  mkApp({ name: "Pinterest", role: "Content/Brand Marketing", type: "internship", opens: "2027-01-01", deadline: "2027-02-28", priority: 2, tags: ["Tech"], notes: "Visual/lifestyle focus. Aligns with content strategy + design background." }),
  mkApp({ name: "NAACP Hollywood Bureau", role: "Comms / Social Media Intern", type: "internship", opens: "2027-02-01", deadline: "2027-03-31", priority: 2, tags: ["Arts"], notes: "Newsletter, social, outreach. Meaningful alongside your AANHPI advocacy background." }),
  mkApp({ name: "LACMA / The Broad", role: "Marketing / Communications", type: "internship", opens: "2027-01-01", deadline: "2027-03-31", priority: 2, tags: ["Arts"], notes: "Natural follow-on from Local Color SJ public art work." }),
  mkApp({ name: "Boutique PR Agencies (LA)", role: "PR / Comms Intern", type: "internship", priority: 2, tags: ["PR"], notes: "Search: 'entertainment PR internship LA summer 2027.' Rolling deadlines are your friend." }),
  mkApp({ name: "Alo Yoga", role: "Marketing / E-commerce Intern", type: "internship", opens: "2027-01-01", deadline: "2027-02-28", priority: 1, tags: ["Fashion"], notes: "Beverly Hills. Good for brand/lifestyle variety in portfolio." }),
];

const SEED_MILESTONES = [
  ["Right now — PH Trip", ["Screenshot all scholarship deadlines to revisit in Sep", "Save all Local Color SJ work files + metrics", "Ask 2 professors about writing recommendations", "Check if De Anza is a HACU-member institution for Coke First Gen"]],
  ["Sep–Oct 2026", ["Update resume with Local Color + La Voz + PUSO work", "Refresh portfolio website with new projects", "Update LinkedIn (comms + journalism + marketing angle)", "Start drafting Getty Marrow personal statement", "Start Jack Kent Cooke application (opens Aug 19!)", "Begin following LA companies + people on LinkedIn"]],
  ["Nov–Dec 2026", ["Submit Jack Kent Cooke app (closes Dec 9!)", "Submit Getty Marrow application", "Apply to APIA Scholars (opens Nov 15)", "Check Amazon / TikTok LA internship portals", "Submit UC Transfer applications (UCLA + UCI)", "Finalize 3 cover letter templates for internships"]],
  ["Jan–Mar 2027", ["Apply: Live Nation, Warner Music, AEG", "Apply: Sony Pictures, Spotify, Pinterest", "Apply: NAACP Hollywood, LACMA/Broad", "Apply: Alexander De Guia Scholarship (Mar 3)", "Apply: Coca-Cola First Gen / HACU (May deadline)", "Research boutique PR agencies (rolling deadlines)", "Start researching LA housing (Feb–Mar)"]],
  ["Apr–Jun 2027", ["Deep-research each company before interviews", "Compare internship offers + decide by May", "Secure housing in LA", "Confirm UCLA/UCI acceptance + scholarship packages", "De Anza classes end June → pack + move 🌴"]],
].flatMap(([phase, items]) => items.map((text) => ({ id: genId(), phase, text, done: false })));

const SEED_NOTES = [
  { id: genId(), title: "About Me", text: "Filipino immigrant, first-year community college student, proven community leader — PUSO president, peer mentor, La Voz reporter, Local Color SJ. Planning to transfer Fall 2027. This blurb is scholarship-essay gold — reuse and adapt it.", tags: ["reference"], pinned: true, updatedAt: Date.now(), checklistItems: [], linkedApplicationId: null, orgId: null, folderId: null },
];

/* ================= date + data helpers ================= */

const pad2 = (n) => String(n).padStart(2, "0");
const todayStr = (d = new Date()) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const fmtTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
const fmtDayShort = (iso) => new Date(iso).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
const fmtFullDate = (d = new Date()) => d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
const daysUntil = (dateStr) => Math.ceil((new Date(dateStr + "T23:59:59") - new Date()) / 86400000);
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const startOfWeek = (d) => { const r = new Date(d); r.setDate(r.getDate() - r.getDay()); return r; };
const sameDay = (a, b) => todayStr(a) === todayStr(b);
const parseDs = (ds) => new Date(`${ds}T12:00:00`);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const money = (n) => `$${Math.round(n).toLocaleString()}`;

/* --- completion map: { [itemId]: { [dateStr]: true } } --- */
const isDone = (map, id, ds) => !!(map[id] && map[id][ds]);
const withDone = (map, id, ds, val) => {
  const forItem = { ...(map[id] || {}) };
  if (val) forItem[ds] = true; else delete forItem[ds];
  const next = { ...map };
  if (Object.keys(forItem).length) next[id] = forItem; else delete next[id];
  return next;
};
/* Old shape was a flat "itemId_YYYY-MM-DD" -> true map. Convert once, keep everything. */
function migrateDoneMap(flat) {
  if (!flat || typeof flat !== "object") return {};
  const nested = {};
  Object.entries(flat).forEach(([k, v]) => {
    if (!v) return;
    if (v === true || v === 1) {
      const ds = k.slice(-10);
      const id = k.slice(0, -11);
      if (DATE_RE.test(ds) && id) { nested[id] = nested[id] || {}; nested[id][ds] = true; }
    } else if (typeof v === "object") {
      nested[k] = { ...v };
    }
  });
  return nested;
}

/* --- recurrence --- */
function taskAppliesOn(item, ds) {
  const rec = item.recurrence || (item.recurring ? "daily" : "none");
  if (rec === "none") return item.date === ds;
  if (item.date && ds < item.date) return false;
  const d = parseDs(ds);
  if (rec === "daily") return true;
  if (rec === "weekdays") return d.getDay() >= 1 && d.getDay() <= 5;
  if (rec === "weekly") return item.date ? parseDs(item.date).getDay() === d.getDay() : true;
  if (rec === "monthly") return item.date ? parseDs(item.date).getDate() === d.getDate() : true;
  return false;
}
/* Unfinished one-offs roll forward instead of disappearing at midnight. */
function taskShowsOn(item, ds, doneMap) {
  const rec = item.recurrence || (item.recurring ? "daily" : "none");
  if (rec !== "none") return taskAppliesOn(item, ds);
  if (item.date === ds) return true;
  return !!item.date && item.date < ds && !isDone(doneMap, item.id, item.date);
}
/* The date a task's completion is filed under. One-offs always file under their own date. */
const taskSlot = (item, ds) => ((item.recurrence || (item.recurring ? "daily" : "none")) === "none" ? item.date : ds);
const taskIsDone = (item, doneMap, ds) => isDone(doneMap, item.id, taskSlot(item, ds));

/* --- streaks, with one forgiven day per week ("streak freeze") --- */
function streakWithFreeze(hasDay, freezeEnabled) {
  let streak = 0, freezes = 0, lastFreezeAt = -99;
  let d = new Date();
  if (!hasDay(todayStr(d))) d = addDays(d, -1);
  for (let i = 0; i < 400; i++) {
    const ds = todayStr(d);
    if (hasDay(ds)) { streak++; d = addDays(d, -1); continue; }
    if (freezeEnabled && streak > 0 && streak - lastFreezeAt >= 7) {
      lastFreezeAt = streak; freezes++; d = addDays(d, -1); continue;
    }
    break;
  }
  return { streak, freezes };
}
function taskStreak(item, doneMap, freezeEnabled) {
  const rec = item.recurrence || (item.recurring ? "daily" : "none");
  if (rec === "none") return { streak: 0, freezes: 0 };
  return streakWithFreeze((ds) => !taskAppliesOn(item, ds) || isDone(doneMap, item.id, ds), freezeEnabled);
}
function orgActiveOnDate(orgId, ds, checkins, checklist, doneMap) {
  if ((checkins[orgId] || []).includes(ds)) return true;
  return checklist.some((i) => i.orgId === orgId && taskAppliesOn(i, ds) && isDone(doneMap, i.id, taskSlot(i, ds)));
}
function orgStreak(orgId, checkins, checklist, doneMap, freezeEnabled) {
  return streakWithFreeze((ds) => orgActiveOnDate(orgId, ds, checkins, checklist, doneMap), freezeEnabled);
}
function daysSinceOrgActivity(orgId, checkins, checklist, doneMap) {
  for (let i = 0; i <= 30; i++) if (orgActiveOnDate(orgId, todayStr(addDays(new Date(), -i)), checkins, checklist, doneMap)) return i;
  return 999;
}
function habitStreak(id, checkinsMap, freezeEnabled) {
  return streakWithFreeze((ds) => (checkinsMap[id] || []).includes(ds), freezeEnabled);
}

function reminderUrgency(dueAt, done) {
  if (!dueAt || done) return "calm";
  const diff = new Date(dueAt) - new Date();
  if (diff < 0) return "overdue";
  if (diff < 36e5 * 3) return "urgent";
  if (diff < 36e5 * 24) return "soon";
  if (diff < 36e5 * 72) return "upcoming";
  return "calm";
}
function bumpRecurring(dueAt, recurrence) {
  const nd = new Date(dueAt);
  if (recurrence === "daily") nd.setDate(nd.getDate() + 1);
  else if (recurrence === "weekdays") { do { nd.setDate(nd.getDate() + 1); } while (nd.getDay() === 0 || nd.getDay() === 6); }
  else if (recurrence === "weekly") nd.setDate(nd.getDate() + 7);
  else if (recurrence === "monthly") nd.setMonth(nd.getMonth() + 1);
  return toLocalInputValue(nd);
}

/* ---- natural-language reminder parsing ---- */
const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
function toLocalInputValue(d) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`; }
function extractRelative(text, now) {
  const m = text.match(/\bin\s+(\d+)\s*(minute|minutes|min|mins|hour|hours|hr|hrs|day|days|week|weeks)\b/i);
  if (!m) return null;
  const amount = parseInt(m[1], 10); const unit = m[2].toLowerCase();
  let date = new Date(now);
  if (unit.startsWith("min")) date = new Date(now.getTime() + amount * 60000);
  else if (unit.startsWith("hour") || unit.startsWith("hr")) date = new Date(now.getTime() + amount * 3600000);
  else if (unit.startsWith("day")) date = addDays(now, amount);
  else if (unit.startsWith("week")) date = addDays(now, amount * 7);
  return { date, matched: m[0] };
}
function extractDay(text, now) {
  if (/\btomorrow\b/i.test(text)) return { date: addDays(now, 1), matched: text.match(/\btomorrow\b/i)[0], defaultHour: 9 };
  if (/\btonight\b/i.test(text)) return { date: new Date(now), matched: text.match(/\btonight\b/i)[0], defaultHour: 20 };
  if (/\btoday\b/i.test(text)) return { date: new Date(now), matched: text.match(/\btoday\b/i)[0], defaultHour: 9 };
  const wdRegex = new RegExp(`\\b((?:next|this)\\s+)?(${WEEKDAYS.join("|")})\\b`, "i");
  const wm = text.match(wdRegex);
  if (wm) { const targetIdx = WEEKDAYS.indexOf(wm[2].toLowerCase()); let diff = (targetIdx - now.getDay() + 7) % 7; if (diff === 0) diff = 7; return { date: addDays(now, diff), matched: wm[0], defaultHour: 9 }; }
  return null;
}
function extractTime(text) {
  if (/\bnoon\b/i.test(text)) return { h: 12, min: 0, matched: text.match(/\b(at\s+)?noon\b/i)[0] };
  if (/\bmidnight\b/i.test(text)) return { h: 0, min: 0, matched: text.match(/\b(at\s+)?midnight\b/i)[0] };
  let m = text.match(/\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i);
  if (!m) m = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i);
  if (!m) return null;
  let h = parseInt(m[1], 10); const min = m[2] ? parseInt(m[2], 10) : 0; const ap = (m[3] || "").toLowerCase();
  if (ap === "pm" && h < 12) h += 12; if (ap === "am" && h === 12) h = 0;
  if (!ap && h >= 1 && h <= 7) h += 12;
  return { h, min, matched: m[0] };
}
function extractRepeat(text) {
  const m = text.match(/\b(every\s*day|daily|every\s*week|weekly|every\s*month|monthly|weekdays)\b/i);
  if (!m) return null;
  const t = m[0].toLowerCase().replace(/\s+/g, "");
  const rec = t === "weekdays" ? "weekdays" : t.includes("day") ? "daily" : t.includes("week") ? "weekly" : "monthly";
  return { rec, matched: m[0] };
}
function parseReminderPhrase(raw) {
  const now = new Date(); let text = raw.trim(); let dueDate = null; let recurrence = "none";
  const rep = extractRepeat(text);
  if (rep) { recurrence = rep.rec; text = text.replace(rep.matched, "").trim(); }
  const rel = extractRelative(text, now);
  if (rel) { dueDate = rel.date; text = text.replace(rel.matched, "").trim(); }
  else {
    const day = extractDay(text, now); if (day) text = text.replace(day.matched, "").trim();
    const time = extractTime(text); let base = day ? new Date(day.date) : new Date(now);
    if (time) { base.setHours(time.h, time.min, 0, 0); text = text.replace(time.matched, "").trim(); if (!day && base < now) base = addDays(base, 1); }
    else if (day) base.setHours(day.defaultHour, 0, 0, 0);
    if (day || time) dueDate = base;
    else if (recurrence !== "none") { base.setHours(9, 0, 0, 0); if (base < now) base = addDays(base, 1); dueDate = base; }
  }
  text = text.replace(/^(please\s+)?(remind me to|remind to|remind me|reminder to|reminder)\s*/i, "");
  text = text.replace(/\s+(at|on)\s*$/i, "").replace(/\s{2,}/g, " ").trim();
  if (text) text = text.charAt(0).toUpperCase() + text.slice(1);
  return { text, dueAt: dueDate ? toLocalInputValue(dueDate) : "", recurrence };
}

/* ---- .ics import (paste an export from Google Calendar / Apple Calendar) ---- */
function unfoldIcs(raw) {
  return raw.replace(/\r\n/g, "\n").split("\n").reduce((acc, line) => {
    if (/^[ \t]/.test(line) && acc.length) acc[acc.length - 1] += line.slice(1);
    else acc.push(line);
    return acc;
  }, []);
}
function icsDateToIso(value, params) {
  const isDateOnly = /VALUE=DATE/i.test(params || "");
  const v = value.trim();
  if (isDateOnly || /^\d{8}$/.test(v)) return `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}T09:00:00`;
  const m = v.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/);
  if (!m) return null;
  const [, y, mo, d, h, mi, s, z] = m;
  return z ? new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s)).toISOString() : `${y}-${mo}-${d}T${h}:${mi}:${s}`;
}
function parseIcs(raw) {
  const lines = unfoldIcs(raw);
  const out = []; let cur = null;
  const unesc = (s) => s.replace(/\\n/gi, "\n").replace(/\\,/g, ",").replace(/\\;/g, ";").replace(/\\\\/g, "\\");
  for (const line of lines) {
    if (/^BEGIN:VEVENT/i.test(line)) { cur = {}; continue; }
    if (/^END:VEVENT/i.test(line)) {
      if (cur && cur.title && cur.start) {
        out.push({
          id: genId(), title: cur.title, start: cur.start, end: cur.end || cur.start,
          orgId: null, source: "ics", location: cur.location || "", meetingLink: cur.url || "",
          contact: "", notes: cur.notes || "", travelBufferMin: null, uid: cur.uid || null,
        });
      }
      cur = null; continue;
    }
    if (!cur) continue;
    const idx = line.indexOf(":"); if (idx < 0) continue;
    const left = line.slice(0, idx); const value = line.slice(idx + 1);
    const [name, ...paramParts] = left.split(";"); const params = paramParts.join(";");
    const key = name.toUpperCase();
    if (key === "SUMMARY") cur.title = unesc(value);
    else if (key === "DTSTART") cur.start = icsDateToIso(value, params);
    else if (key === "DTEND") cur.end = icsDateToIso(value, params);
    else if (key === "LOCATION") cur.location = unesc(value);
    else if (key === "DESCRIPTION") cur.notes = unesc(value).slice(0, 500);
    else if (key === "URL") cur.url = value;
    else if (key === "UID") cur.uid = value;
  }
  return out.filter((e) => e.start);
}

/* ================= storage ================= */

const memStore = new Map();
const NS = "scout:";
const HAS_LS = (() => { try { const k = "__scout_probe"; localStorage.setItem(k, "1"); localStorage.removeItem(k); return true; } catch { return false; } })();
const artifactBridge = () => (typeof window !== "undefined" && window.storage && typeof window.storage.get === "function" ? window.storage : null);

async function loadKey(key, fallback) {
  try {
    const bridge = artifactBridge();
    if (bridge) { const res = await bridge.get(key, false); return res ? JSON.parse(res.value) : fallback; }
    if (HAS_LS) { const v = localStorage.getItem(NS + key); return v === null ? fallback : JSON.parse(v); }
    return memStore.has(key) ? memStore.get(key) : fallback;
  } catch { return fallback; }
}
async function saveKey(key, value) {
  memStore.set(key, value);
  try {
    const bridge = artifactBridge();
    if (bridge) { await bridge.set(key, JSON.stringify(value), false); return; }
    if (HAS_LS) localStorage.setItem(NS + key, JSON.stringify(value));
  } catch (e) { console.error("save failed", key, e); }
}

/* Every key the dashboard owns. A backup writes all of them; a restore fills in
   whichever ones a given file happens to contain, so three separate exports from
   the old split artifacts can be imported one after another without clobbering. */
const ALL_KEYS = ["orgs","checklist","checklist-done-v2","checklist-done","events","reminders","notes","note-folders",
  "applications","milestones","habits","habit-checkins","org-checkins","org-photos","org-ideas","org-activity",
  "reflections","inbox","budget","settings","timers","focus","game-best","schools","assets","letters","snippets",
  "sessions","shared-done","reviews","schema-version","profile","courses","activities","contacts","templates","aid-items","interview-qs","spaces","trash","last-backup"];

async function exportEverything() {
  const dump = { exportedAt: new Date().toISOString(), app: "scout-dashboard" };
  for (const k of ALL_KEYS) dump[k] = await loadKey(k, null);
  const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `scout-backup-${todayStr()}.json`; a.click();
  URL.revokeObjectURL(url);
}
async function importEverything(dump) {
  if (!dump || typeof dump !== "object") return 0;
  let n = 0;
  for (const k of ALL_KEYS) {
    if (dump[k] === undefined || dump[k] === null) continue;
    if (k === "checklist-done" && dump["checklist-done-v2"]) continue;
    await saveKey(k, dump[k]); n++;
  }
  return n;
}

/* ================= primitives ================= */

const fieldStyle = () => ({ background: INPUT_BG, border: `1px solid ${BORDER}`, color: TEXT });
const cardStyle = (extra = {}) => ({ background: CARD, border: `1.5px solid ${BORDER}`, boxShadow: CARD_SHADOW, ...extra });

function IconBtn({ label, onClick, children, color = MUTED, style = {}, ...rest }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className="icon-btn" style={{ color, ...style }} {...rest}>
      {children}
    </button>
  );
}
function SectionEmpty({ text, action }) {
  return (
    <div className="flex flex-col items-center gap-2 py-7 text-center">
      <Mascot state="sleepy" size={46} />
      <div className="text-sm" style={{ color: MUTED, maxWidth: 260 }}>{text}</div>
      {action}
    </div>
  );
}
function Segmented({ options, value, onChange, ariaLabel }) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="segmented" style={{ background: "var(--card-2)", border: `1px solid ${BORDER_SOFT}` }}>
      {options.map(([v, label]) => (
        <button key={v} role="tab" aria-selected={value === v} onClick={() => onChange(v)}
          className="segmented-btn" style={{ background: value === v ? CARD : "transparent", color: value === v ? TEXT : MUTED, boxShadow: value === v ? CARD_SHADOW : "none" }}>
          {label}
        </button>
      ))}
    </div>
  );
}
function Chip({ active, onClick, children, tone = SAGE }) {
  return (
    <button onClick={onClick} className="chip" style={{ background: active ? ACCENT : CARD, color: active ? ACCENT_TEXT : tone, border: `1px solid ${active ? ACCENT : BORDER}` }}>
      {children}
    </button>
  );
}
function Sheet({ open, title, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="sheet-scrim" onClick={onClose} style={{ background: "var(--scrim)" }}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} style={{ background: CARD, borderTop: `1.5px solid ${BORDER}`, boxShadow: SHADOW_LG }}>
        <div className="sheet-grip" style={{ background: BORDER }} />
        <div className="flex items-center justify-between px-5 pb-3">
          <div className="font-display text-base font-bold" style={{ color: TEXT }}>{title}</div>
          <IconBtn label="Close" onClick={onClose}><X size={18} /></IconBtn>
        </div>
        <div className="px-5 pb-8 overflow-y-auto" style={{ maxHeight: "70vh" }}>{children}</div>
      </div>
    </div>
  );
}
function Toasts({ items, onDismiss }) {
  return (
    <div className="toast-host">
      {items.map((t) => (
        <div key={t.id} className="toast" style={{ background: CARD, border: `1.5px solid ${t.tone === "bad" ? RED : BORDER}`, boxShadow: SHADOW_LG, color: TEXT }}>
          <span className="text-sm flex-1">{t.msg}</span>
          {t.actionLabel && (
            <button onClick={() => { t.onAction && t.onAction(); onDismiss(t.id); }} className="text-xs font-bold flex items-center gap-1 px-2 py-1 rounded-lg"
              style={{ background: ACCENT_SOFT, color: GOLD }}>
              <Undo2 size={12} /> {t.actionLabel}
            </button>
          )}
          <IconBtn label="Dismiss" onClick={() => onDismiss(t.id)}><X size={14} /></IconBtn>
        </div>
      ))}
    </div>
  );
}

function Mascot({ state = "neutral", size = 64 }) {
  const eyesClosed = state === "sleepy";
  const sparkle = state === "excited";
  const mouth = state === "happy" || state === "excited" ? "M 30 31 Q 38 37 46 31" : state === "sleepy" ? "M 32 31 L 44 31" : "M 31 31 Q 38 34 45 31";
  const fur = "#C97A3D", cream = "#F7EAD2", ink = "#3A2312";
  return (
    <div key={state} className="mascot-pop" style={{ width: size, height: size * 0.82 }}>
      <svg width={size} height={size * 0.82} viewBox="0 0 82 66" role="img" aria-label={`Scout looks ${state}`}>
        <ellipse cx="41" cy="60" rx="26" ry="4" fill="rgba(74,46,26,0.15)" />
        <ellipse cx={state === "excited" ? 72 : 70} cy="41" rx="6" ry="7" fill={fur} />
        <rect x="17" y="50" width="9" height="12" rx="4" fill={fur} />
        <rect x="17" y="58" width="9" height="4" rx="2" fill={cream} />
        <rect x="55" y="50" width="9" height="12" rx="4" fill={fur} />
        <rect x="55" y="58" width="9" height="4" rx="2" fill={cream} />
        <ellipse cx="41" cy="44" rx="29" ry="16" fill={fur} />
        <ellipse cx="41" cy="49" rx="15" ry="9" fill={cream} />
        <path d="M 22 14 L 11 1 L 29 10 Z" fill={fur} />
        <path d="M 60 14 L 71 1 L 53 10 Z" fill={fur} />
        <path d="M 24 13 L 18 5 L 27 9 Z" fill={cream} />
        <path d="M 58 13 L 64 5 L 55 9 Z" fill={cream} />
        <circle cx="41" cy="24" r="20" fill={fur} />
        <path d="M 41 8 Q 46 20 41 32 Q 36 20 41 8 Z" fill={cream} opacity="0.7" />
        <ellipse cx="41" cy="30" rx="12" ry="8" fill={cream} />
        <ellipse cx="41" cy="29" rx="2.8" ry="2.2" fill={ink} />
        {eyesClosed
          ? (<><path d="M31 21 Q35 24 39 21" stroke={ink} strokeWidth="2" fill="none" strokeLinecap="round" /><path d="M43 21 Q47 24 51 21" stroke={ink} strokeWidth="2" fill="none" strokeLinecap="round" /></>)
          : (<><circle cx="34" cy="21" r="2.5" fill={ink} /><circle cx="48" cy="21" r="2.5" fill={ink} /><circle cx="34.8" cy="20.2" r="0.8" fill="#fff" /><circle cx="48.8" cy="20.2" r="0.8" fill="#fff" /></>)}
        <path d={mouth} stroke={ink} strokeWidth="2" fill="none" strokeLinecap="round" />
        {(state === "happy" || state === "excited") && (<><circle cx="26" cy="29" r="2.8" fill="#D9714A" opacity="0.4" /><circle cx="56" cy="29" r="2.8" fill="#D9714A" opacity="0.4" /></>)}
        {sparkle && (<><text x="0" y="12" fontSize="11">✨</text><text x="68" y="14" fontSize="9">✨</text></>)}
      </svg>
    </div>
  );
}

function WalkingCompanion({ state, paused }) {
  return (
    <div className="walk-track" aria-hidden="true">
      <div className="walk-mover" style={{ animationPlayState: paused ? "paused" : "running" }}>
        <div className="walk-flip" style={{ animationPlayState: paused ? "paused" : "running" }}>
          <div className="walk-bob" style={{ animationPlayState: paused ? "paused" : "running" }}><Mascot state={state} size={40} /></div>
        </div>
      </div>
    </div>
  );
}

function Confetti({ active }) {
  if (!active) return null;
  const colors = ["#E8A93B", "#7A8F4F", "#D9714A", "#6B9080", "#8E7CC3"];
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 60, overflow: "hidden" }} aria-hidden="true">
      {Array.from({ length: 32 }, (_, i) => {
        const left = Math.random() * 100, delay = Math.random() * 0.4, dur = 1.3 + Math.random() * 0.9;
        const color = colors[i % colors.length], round = i % 2 === 0;
        return <div key={i} style={{ position: "absolute", top: -12, left: `${left}%`, width: 9, height: 9, background: color, borderRadius: round ? "50%" : "2px", animation: `confettiFall ${dur}s ease-in ${delay}s forwards` }} />;
      })}
    </div>
  );
}

/* ---- the signature element: a horizon that tracks the day ----
   The sun (or moon) rides the arc as real time passes; the ridge line fills
   left-to-right with the share of today's tasks you've actually finished. */
function DayArc({ now, done, total, dark }) {
  const W = 340, H = 116;
  const minutes = now.getHours() * 60 + now.getMinutes();
  const t = clamp(minutes / 1440, 0, 1);
  const angle = Math.PI * (1 - t);
  const cx = W / 2, cy = 96, rx = W / 2 - 26, ry = 66;
  const bodyX = cx + Math.cos(angle) * rx;
  const bodyY = cy - Math.sin(angle) * ry;
  const pct = total > 0 ? done / total : 0;
  const isNight = now.getHours() < 6 || now.getHours() >= 19;
  const label = total === 0 ? "Nothing on the list yet" : done === total ? "Everything's done" : `${done} of ${total} done today`;
  return (
    <div className="rounded-2xl overflow-hidden relative" style={{ border: `1.5px solid ${BORDER}`, boxShadow: CARD_SHADOW }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }} role="img" aria-label={`Day progress: ${label}`}>
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: "var(--sky-top)" }} />
            <stop offset="100%" style={{ stopColor: "var(--sky-bot)" }} />
          </linearGradient>
          <radialGradient id="sunGlow">
            <stop offset="0%" style={{ stopColor: "var(--sun)", stopOpacity: 0.85 }} />
            <stop offset="100%" style={{ stopColor: "var(--sun)", stopOpacity: 0 }} />
          </radialGradient>
          <clipPath id="ridgeClip"><path d="M0 96 L34 78 L74 90 L118 66 L166 88 L214 70 L262 86 L306 74 L340 90 L340 116 L0 116 Z" /></clipPath>
        </defs>
        <rect x="0" y="0" width={W} height={H} fill="url(#skyGrad)" />
        {isNight && [...Array(14)].map((_, i) => (
          <circle key={i} cx={(i * 37 + 13) % W} cy={8 + ((i * 19) % 44)} r={i % 3 === 0 ? 1.4 : 0.9} fill="#FFF4D8" opacity={0.35 + (i % 4) * 0.14} className="twinkle" style={{ animationDelay: `${i * 0.4}s` }} />
        ))}
        <path d={`M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`} fill="none" stroke="var(--sun)" strokeWidth="1" strokeDasharray="3 5" opacity="0.35" />
        <circle cx={bodyX} cy={bodyY} r="26" fill="url(#sunGlow)" />
        <circle cx={bodyX} cy={bodyY} r="9" style={{ fill: "var(--sun)" }} />
        {isNight && <circle cx={bodyX + 3.5} cy={bodyY - 2.5} r="8" style={{ fill: "var(--sky-top)" }} />}
        <g clipPath="url(#ridgeClip)">
          <rect x="0" y="60" width={W} height={H} style={{ fill: "var(--hill)" }} opacity="0.9" />
          <rect x="0" y="60" width={W * pct} height={H} style={{ fill: "var(--accent)" }} opacity={dark ? 0.55 : 0.75} className="ridge-fill" />
        </g>
        <path d="M0 96 L34 78 L74 90 L118 66 L166 88 L214 70 L262 86 L306 74 L340 90" fill="none" style={{ stroke: "var(--hill)" }} strokeWidth="2" />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-3 pb-2">
        <span className="text-xs font-display font-bold" style={{ color: "#FFF6E4", textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>{label}</span>
        <span className="text-xs font-display font-bold" style={{ color: "#FFF6E4", textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>{Math.round(pct * 100)}%</span>
      </div>
    </div>
  );
}

function FlipUnit({ value, big }) {
  return (
    <div key={value} className={`flip-digit rounded-xl font-display font-bold ${big ? "text-6xl px-4 py-3" : "text-4xl px-3 py-2"}`}
      style={{ background: CARD_2, border: `2px solid ${BORDER}`, color: TEXT, minWidth: big ? 92 : 64, textAlign: "center", boxShadow: CARD_SHADOW }}>
      {value}
    </div>
  );
}
function ImportanceSelect({ value, onChange }) {
  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label="Priority">
      {[3, 2, 1].map((lvl) => (
        <button key={lvl} type="button" role="radio" aria-checked={value === lvl} onClick={() => onChange(lvl)}
          aria-label={IMPORTANCE_LABELS[lvl]} title={IMPORTANCE_LABELS[lvl]} className="rounded-full transition-transform"
          style={{ width: 18, height: 18, background: IMPORTANCE_COLORS[lvl], border: value === lvl ? `2px solid ${TEXT}` : "2px solid transparent", opacity: value === lvl ? 1 : 0.4, transform: value === lvl ? "scale(1.12)" : "scale(1)" }} />
      ))}
    </div>
  );
}
function TabButton({ active, onClick, icon: Icon, label, dot }) {
  return (
    <button onClick={onClick} aria-current={active ? "page" : undefined} className="flex-1 flex flex-col items-center justify-center gap-1 py-2 relative" style={{ color: active ? GOLD : MUTED }}>
      {active && <span className="nav-pill" style={{ background: ACCENT_SOFT }} />}
      <span key={String(active)} className="relative pop" style={{ zIndex: 1 }}>
        <Icon size={20} strokeWidth={active ? 2.4 : 2} />
        {dot && <span className="rounded-full absolute" style={{ width: 7, height: 7, background: RED, top: -2, right: -3, border: `1.5px solid ${CARD}` }} />}
      </span>
      <span className="text-xs font-semibold" style={{ zIndex: 1 }}>{label}</span>
    </button>
  );
}
function CircularTimer({ timerKey, timers, setTimers, size = 96, color = ACCENT, presets = [15, 25, 50] }) {
  const t = timers[timerKey] || { seconds: 1500, duration: 1500, running: false };
  const r = size / 2 - 9; const c = 2 * Math.PI * r; const progress = 1 - t.seconds / t.duration;
  const toggle = () => setTimers((p) => ({ ...p, [timerKey]: { ...t, running: !t.running } }));
  const reset = () => setTimers((p) => ({ ...p, [timerKey]: { seconds: t.duration, duration: t.duration, running: false } }));
  const setLen = (min) => setTimers((p) => ({ ...p, [timerKey]: { seconds: min * 60, duration: min * 60, running: false } }));
  const mm = pad2(Math.floor(t.seconds / 60)), ss = pad2(t.seconds % 60);
  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }} aria-hidden="true">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" style={{ stroke: BORDER }} strokeWidth={9} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" style={{ stroke: color, transition: "stroke-dashoffset 1s linear" }} strokeWidth={9} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - progress)} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-display font-bold" style={{ fontSize: size / 4, color: TEXT }} aria-live="off">{mm}:{ss}</div>
      </div>
      <div className="flex items-center gap-3">
        <IconBtn label={t.running ? "Pause timer" : "Start timer"} onClick={toggle} color={GOLD}>{t.running ? <Pause size={22} /> : <Play size={22} />}</IconBtn>
        <IconBtn label="Reset timer" onClick={reset}><RotateCcw size={17} /></IconBtn>
      </div>
      <div className="flex gap-1">
        {presets.map((m) => (
          <button key={m} onClick={() => setLen(m)} className="text-xs px-2 py-0.5 rounded-full"
            style={{ border: `1px solid ${BORDER}`, color: t.duration === m * 60 ? GOLD : MUTED, background: t.duration === m * 60 ? ACCENT_SOFT : "transparent" }}>{m}m</button>
        ))}
      </div>
    </div>
  );
}
function ProgressRing({ percent, size = 40, color = SAGE, track = "rgba(255,255,255,0.35)" }) {
  const r = size / 2 - 4; const c = 2 * Math.PI * r; const p = clamp(percent, 0, 1);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" style={{ stroke: track }} strokeWidth={4} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" style={{ stroke: color, transition: "stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)" }} strokeWidth={4} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - p)} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-semibold" style={{ fontSize: size / 4, color: TEXT }}>{Math.round(p * 100)}%</div>
    </div>
  );
}
function MeterBar({ percent, color = ACCENT, height = 8 }) {
  return (
    <div className="rounded-full overflow-hidden w-full" style={{ height, background: BORDER_SOFT }}>
      <div className={`rounded-full ${clamp(percent, 0, 1) > 0.04 ? "sheen" : ""}`} style={{ height: "100%", width: `${clamp(percent, 0, 1) * 100}%`, background: color, transition: "width 0.7s cubic-bezier(0.22,1,0.36,1)" }} />
    </div>
  );
}
function EnergyBar({ value, onChange }) {
  return (
    <div className="flex items-end gap-1.5" role="radiogroup" aria-label="Energy level">
      {[1, 2, 3, 4, 5].map((lvl) => (
        <button key={lvl} type="button" role="radio" aria-checked={value === lvl} aria-label={`Energy ${lvl} of 5`} onClick={() => onChange(lvl)}
          className="rounded-md pop" style={{ width: 20, height: 12 + lvl * 6, background: lvl <= value ? ACCENT : BORDER }} />
      ))}
    </div>
  );
}
function StreakBadge({ streak, freezes, onDark }) {
  if (streak < 2) return null;
  return (
    <span className="flex items-center gap-0.5 text-xs font-semibold rounded-full px-1.5 py-0.5"
      title={freezes > 0 ? `${streak}-day streak — ${freezes} day forgiven` : `${streak}-day streak`}
      style={{ background: onDark ? "rgba(0,0,0,0.35)" : ACCENT_SOFT, color: onDark ? "#FCD34D" : CORAL }}>
      <Flame size={11} />{streak}{freezes > 0 && <Snowflake size={10} style={{ marginLeft: 2 }} />}
    </span>
  );
}

/* ================= tasks ================= */

function AddChecklistForm({ onAdd, compact }) {
  const [text, setText] = useState(""); const [imp, setImp] = useState(2);
  const [recurrence, setRecurrence] = useState("none"); const [link, setLink] = useState(""); const [showLink, setShowLink] = useState(false);
  const submit = (e) => {
    e.preventDefault(); if (!text.trim()) return;
    onAdd({ text: text.trim(), importance: imp, recurrence, link: link.trim() || null });
    setText(""); setLink(""); setShowLink(false);
  };
  return (
    <form onSubmit={submit} className="pt-2">
      <div className="flex items-center gap-2 flex-wrap">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a task…" aria-label="New task"
          className="flex-1 rounded-lg px-3 py-2 text-sm outline-none" style={{ ...fieldStyle(), minWidth: 140 }} />
        <ImportanceSelect value={imp} onChange={setImp} />
        <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)} aria-label="Repeat"
          className="rounded-lg px-2 py-2 text-xs outline-none" style={fieldStyle()}>
          {Object.entries(RECURRENCE_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        {!compact && (
          <IconBtn label="Attach a link" onClick={() => setShowLink((s) => !s)} color={showLink ? GOLD : MUTED}
            style={{ border: `1px solid ${showLink ? ACCENT : BORDER}`, borderRadius: 8, padding: 8 }}><Link2 size={16} /></IconBtn>
        )}
        <button type="submit" aria-label="Add task" className="rounded-lg p-2" style={{ background: ACCENT, color: ACCENT_TEXT }}><Plus size={16} /></button>
      </div>
      {showLink && <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Paste a link…" aria-label="Task link" className="w-full rounded-lg px-3 py-2 text-sm outline-none mt-2" style={fieldStyle()} />}
    </form>
  );
}

function TaskRowImpl({
  item, ds, doneMap, streakInfo, orgDot, dragging, reorderMode, canUp, canDown,
  onToggle, onToggleSub, onAddSub, onDelete, onEdit, onSchedule, onMove, dragHandlers,
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.text);
  const [subText, setSubText] = useState("");
  const [scheduling, setScheduling] = useState(false);
  const [slotTime, setSlotTime] = useState("09:00");
  const [slotLen, setSlotLen] = useState(45);
  const slot = taskSlot(item, ds);
  const done = isDone(doneMap, item.id, slot);
  const subs = item.subtasks || [];
  const subsDone = subs.filter((s) => isDone(doneMap, s.id, slot)).length;
  const rec = item.recurrence || (item.recurring ? "daily" : "none");

  const saveEdit = () => { const t = draft.trim(); if (t) onEdit({ text: t }); setEditing(false); };
  const addSub = (e) => { e.preventDefault(); if (!subText.trim()) return; onAddSub(subText.trim()); setSubText(""); setOpen(true); };
  const confirmSchedule = (e) => { e.preventDefault(); onSchedule(slotTime, slotLen); setScheduling(false); };

  return (
    <div className="task-row" style={{ borderBottom: `1px solid ${BORDER_SOFT}`, opacity: dragging ? 0.4 : 1 }} {...(dragHandlers || {})}>
      <div className="flex items-center gap-2 py-2">
        {reorderMode ? (
          <span className="flex flex-col" style={{ color: MUTED }}>
            <IconBtn label="Move up" onClick={() => onMove(-1)} disabled={!canUp} style={{ opacity: canUp ? 1 : 0.3, padding: 0 }}><ChevronUp size={14} /></IconBtn>
            <IconBtn label="Move down" onClick={() => onMove(1)} disabled={!canDown} style={{ opacity: canDown ? 1 : 0.3, padding: 0 }}><ChevronDown size={14} /></IconBtn>
          </span>
        ) : (
          <span className="drag-handle" aria-hidden="true" style={{ color: BORDER }}><GripVertical size={14} /></span>
        )}
        <button onClick={onToggle} aria-label={done ? `Mark "${item.text}" as not done` : `Mark "${item.text}" as done`} aria-pressed={done}>
          <span key={String(done)} className="pop" style={{ color: done ? GREEN : MUTED }}>{done ? <CheckCircle2 size={20} /> : <Circle size={20} />}</span>
        </button>
        {editing ? (
          <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={saveEdit}
            onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") { setDraft(item.text); setEditing(false); } }}
            aria-label="Edit task" className="flex-1 rounded-lg px-2 py-1 text-sm outline-none" style={fieldStyle()} />
        ) : (
          <button onClick={() => { setDraft(item.text); setEditing(true); }} className="flex-1 text-left text-sm task-text"
            style={{ color: done ? MUTED : TEXT, textDecoration: done ? "line-through" : "none" }}>
            {orgDot && <span className="rounded-full inline-block mr-1.5" style={{ width: 7, height: 7, background: orgDot, verticalAlign: "middle" }} />}
            {item.text}
          </button>
        )}
        {subs.length > 0 && (
          <button onClick={() => setOpen((o) => !o)} className="text-xs px-1.5 py-0.5 rounded-full" style={{ border: `1px solid ${BORDER}`, color: MUTED }}>
            {subsDone}/{subs.length}
          </button>
        )}
        {item.link && <a href={item.link} target="_blank" rel="noreferrer" aria-label="Open task link" style={{ color: GOLD }}><Link2 size={13} /></a>}
        <StreakBadge streak={streakInfo?.streak || 0} freezes={streakInfo?.freezes || 0} />
        {rec !== "none" && <span className="text-xs" style={{ color: MUTED }}>{RECURRENCE_META[rec].short}</span>}
        {rec === "none" && item.date && item.date < ds && <span className="text-xs" style={{ color: CORAL }} title={`Carried over from ${item.date}`}>carried over</span>}
        <span className="rounded-full" title={IMPORTANCE_LABELS[item.importance]} style={{ width: 9, height: 9, background: IMPORTANCE_COLORS[item.importance], flexShrink: 0 }} />
        <span className="row-actions flex items-center gap-1">
          <IconBtn label="Add a step" onClick={() => setOpen((o) => !o)}><CornerDownRight size={14} /></IconBtn>
          <IconBtn label="Put on the calendar" onClick={() => setScheduling((s) => !s)} color={scheduling ? GOLD : MUTED}><CalendarPlus size={14} /></IconBtn>
          <IconBtn label={`Delete "${item.text}"`} onClick={onDelete}><Trash2 size={14} /></IconBtn>
        </span>
      </div>
      {scheduling && (
        <form onSubmit={confirmSchedule} className="flex items-center gap-2 pb-2 pl-8 flex-wrap">
          <span className="text-xs" style={{ color: MUTED }}>Block time today at</span>
          <input type="time" value={slotTime} onChange={(e) => setSlotTime(e.target.value)} aria-label="Start time" className="rounded-lg px-2 py-1 text-xs outline-none" style={fieldStyle()} />
          <select value={slotLen} onChange={(e) => setSlotLen(Number(e.target.value))} aria-label="Length" className="rounded-lg px-2 py-1 text-xs outline-none" style={fieldStyle()}>
            {[15, 30, 45, 60, 90, 120].map((m) => <option key={m} value={m}>{m} min</option>)}
          </select>
          <button type="submit" className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ background: ACCENT, color: ACCENT_TEXT }}>Add to calendar</button>
        </form>
      )}
      {open && (
        <div className="pl-8 pb-2">
          {subs.map((s) => {
            const sDone = isDone(doneMap, s.id, slot);
            return (
              <div key={s.id} className="flex items-center gap-2 py-1">
                <button onClick={() => onToggleSub(s.id)} aria-label={`Step: ${s.text}`} aria-pressed={sDone} style={{ color: sDone ? GREEN : MUTED }}>
                  {sDone ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                </button>
                <span className="text-xs" style={{ color: sDone ? MUTED : TEXT, textDecoration: sDone ? "line-through" : "none" }}>{s.text}</span>
              </div>
            );
          })}
          <form onSubmit={addSub} className="flex gap-2 mt-1">
            <input value={subText} onChange={(e) => setSubText(e.target.value)} placeholder="Break it into a smaller step…" aria-label="New step"
              className="flex-1 rounded-lg px-2 py-1 text-xs outline-none" style={fieldStyle()} />
            <button type="submit" aria-label="Add step" className="rounded-lg px-2" style={{ background: INPUT_BG, color: MUTED, border: `1px solid ${BORDER}` }}><Plus size={12} /></button>
          </form>
        </div>
      )}
    </div>
  );
}

function TaskList({ items, ds, doneMap, orgById, freezeEnabled, reorderMode, onReorder, ...handlers }) {
  const [dragId, setDragId] = useState(null);
  const onDrop = (targetId) => {
    if (!dragId || dragId === targetId) { setDragId(null); return; }
    onReorder(dragId, targetId); setDragId(null);
  };
  return (
    <div>
      {items.map((item, idx) => (
        <TaskRow
          key={item.id} item={item} ds={ds} doneMap={doneMap}
          streakInfo={taskStreak(item, doneMap, freezeEnabled)}
          orgDot={handlers.showOrgDot ? orgById(item.orgId)?.color : null}
          dragging={dragId === item.id}
          reorderMode={reorderMode} canUp={idx > 0} canDown={idx < items.length - 1}
          onMove={(dir) => onReorder(item.id, items[idx + dir]?.id)}
          dragHandlers={{
            draggable: !reorderMode,
            onDragStart: () => setDragId(item.id),
            onDragOver: (e) => e.preventDefault(),
            onDrop: () => onDrop(item.id),
            onDragEnd: () => setDragId(null),
          }}
          onToggle={() => handlers.onToggle(item)}
          onToggleSub={(sid) => handlers.onToggleSub(item, sid)}
          onAddSub={(t) => handlers.onAddSub(item.id, t)}
          onDelete={() => handlers.onDelete(item.id)}
          onEdit={(patch) => handlers.onEdit(item.id, patch)}
          onSchedule={(time, len) => handlers.onSchedule(item, time, len)}
        />
      ))}
    </div>
  );
}

/* ================= calendar ================= */

function AddEventForm({ orgs, onAdd }) {
  const [title, setTitle] = useState(""); const [date, setDate] = useState(todayStr());
  const [start, setStart] = useState("09:00"); const [end, setEnd] = useState("10:00");
  const [orgId, setOrgId] = useState(""); const [location, setLocation] = useState("");
  const [meetingLink, setMeetingLink] = useState(""); const [contact, setContact] = useState("");
  const [notes, setNotes] = useState(""); const [travelBufferMin, setTravelBufferMin] = useState(""); const [more, setMore] = useState(false);
  const submit = (e) => {
    e.preventDefault(); if (!title.trim()) return;
    onAdd({ title: title.trim(), start: `${date}T${start}:00`, end: `${date}T${end}:00`, orgId: orgId || null, source: "manual", location: location.trim(), meetingLink: meetingLink.trim(), contact: contact.trim(), notes: notes.trim(), travelBufferMin: travelBufferMin ? Number(travelBufferMin) : null });
    setTitle(""); setLocation(""); setMeetingLink(""); setContact(""); setNotes(""); setTravelBufferMin(""); setMore(false);
  };
  return (
    <form onSubmit={submit} className="rounded-2xl p-4 flex flex-col gap-2" style={cardStyle()}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What's happening?" aria-label="Event title" className="rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
      <div className="flex gap-2">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Date" className="flex-1 rounded-lg px-2 py-2 text-sm outline-none" style={fieldStyle()} />
        <input type="time" value={start} onChange={(e) => setStart(e.target.value)} aria-label="Start time" className="flex-1 rounded-lg px-2 py-2 text-sm outline-none" style={fieldStyle()} />
        <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} aria-label="End time" className="flex-1 rounded-lg px-2 py-2 text-sm outline-none" style={fieldStyle()} />
      </div>
      <select value={orgId} onChange={(e) => setOrgId(e.target.value)} aria-label="List" className="rounded-lg px-2 py-2 text-sm outline-none" style={fieldStyle()}>
        <option value="">No list</option>{orgs.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
      </select>
      {!more ? <button type="button" onClick={() => setMore(true)} className="text-xs text-left" style={{ color: GOLD }}>Add a link, place, notes, or who to ask</button> : (
        <>
          <input value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} placeholder="Zoom / Meet link" aria-label="Meeting link" className="rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
          <div className="flex gap-2">
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Where" aria-label="Location" className="flex-1 rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
            <input type="number" value={travelBufferMin} onChange={(e) => setTravelBufferMin(e.target.value)} placeholder="Travel min" aria-label="Travel minutes" className="w-28 rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
          </div>
          <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Who to ask" aria-label="Contact" className="rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" aria-label="Notes" rows={2} className="rounded-lg px-3 py-2 text-sm outline-none resize-none" style={fieldStyle()} />
        </>
      )}
      <div className="flex justify-end"><button type="submit" className="rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: ACCENT, color: ACCENT_TEXT }}>Add event</button></div>
    </form>
  );
}

function EventCardImpl({ ev, org, onDelete }) {
  const leaveBy = ev.location && ev.travelBufferMin ? new Date(new Date(ev.start).getTime() - ev.travelBufferMin * 60000) : null;
  return (
    <div className="rounded-xl p-3 mb-2 lift" style={cardStyle({ borderLeft: `4px solid ${org ? org.color : MUTED}` })}>
      <div className="flex items-start gap-3">
        <div className="text-xs font-display font-bold" style={{ color: GOLD, minWidth: 44 }}>{fmtTime(ev.start)}</div>
        <div className="flex-1">
          <div className="text-sm font-medium">{ev.title}</div>
          <div className="text-xs" style={{ color: MUTED }}>{fmtDayShort(ev.start)} · until {fmtTime(ev.end)}</div>
        </div>
        {ev.source !== "google" && <IconBtn label={`Delete ${ev.title}`} onClick={onDelete}><Trash2 size={14} /></IconBtn>}
      </div>
      {(ev.meetingLink || ev.location || ev.contact || ev.notes) && (
        <div className="flex flex-col gap-1 mt-2 pt-2" style={{ borderTop: `1px dashed ${BORDER}` }}>
          {ev.meetingLink && <a href={ev.meetingLink} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1 font-semibold" style={{ color: GOLD }}><Link2 size={12} /> Join the call</a>}
          {ev.location && <div className="text-xs flex items-center gap-1" style={{ color: TEXT }}><MapPin size={12} /> {ev.location}{leaveBy && <span style={{ color: RED }}> · leave by {fmtTime(leaveBy)}</span>}</div>}
          {ev.contact && <div className="text-xs flex items-center gap-1" style={{ color: MUTED }}><User size={12} /> {ev.contact}</div>}
          {ev.notes && <div className="text-xs" style={{ color: MUTED, whiteSpace: "pre-wrap" }}>{ev.notes}</div>}
        </div>
      )}
    </div>
  );
}

const HOUR_H = 46;
function DayTimeline({ date, events, orgById, onDelete }) {
  const scroller = useRef(null);
  const isToday = sameDay(date, new Date());
  const items = events.filter((e) => sameDay(new Date(e.start), date)).sort((a, b) => new Date(a.start) - new Date(b.start));
  useEffect(() => {
    if (!scroller.current) return;
    const firstHour = items.length ? new Date(items[0].start).getHours() : (isToday ? new Date().getHours() : 8);
    scroller.current.scrollTop = Math.max(0, (firstHour - 1) * HOUR_H);
  }, [date]);
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
  const laneOf = (ev, idx) => {
    const s = new Date(ev.start).getTime();
    let lane = 0;
    for (let i = 0; i < idx; i++) if (new Date(items[i].end).getTime() > s) lane++;
    return Math.min(lane, 2);
  };
  return (
    <div className="rounded-2xl overflow-hidden" style={cardStyle()}>
      <div ref={scroller} className="overflow-y-auto relative" style={{ height: 420 }}>
        <div style={{ position: "relative", height: 24 * HOUR_H }}>
          {Array.from({ length: 24 }, (_, h) => (
            <div key={h} style={{ position: "absolute", top: h * HOUR_H, left: 0, right: 0, height: HOUR_H, borderTop: `1px solid ${BORDER_SOFT}` }}>
              <span className="text-xs font-display" style={{ position: "absolute", left: 8, top: 2, color: MUTED }}>{pad2(h)}:00</span>
            </div>
          ))}
          {isToday && (
            <div style={{ position: "absolute", top: (nowMin / 60) * HOUR_H, left: 44, right: 6, height: 2, background: RED, zIndex: 3 }}>
              <span style={{ position: "absolute", left: -6, top: -3, width: 8, height: 8, borderRadius: "50%", background: RED }} />
            </div>
          )}
          {items.map((ev, idx) => {
            const s = new Date(ev.start), e = new Date(ev.end);
            const top = (s.getHours() * 60 + s.getMinutes()) / 60 * HOUR_H;
            const mins = Math.max(24, (e - s) / 60000);
            const org = orgById(ev.orgId);
            const lane = laneOf(ev, idx);
            return (
              <button key={ev.id} onClick={() => onDelete && onDelete(ev)} title={ev.title}
                className="text-left rounded-lg px-2 py-1 overflow-hidden lift"
                style={{ position: "absolute", top: top + 1, height: (mins / 60) * HOUR_H - 3, left: 48 + lane * 10, right: 8 - lane * 4, zIndex: 2,
                  background: org ? `${org.color}22` : ACCENT_SOFT, borderLeft: `3px solid ${org ? org.color : ACCENT}`, color: TEXT }}>
                <div className="text-xs font-semibold truncate">{ev.title}</div>
                <div className="text-xs truncate" style={{ color: MUTED }}>{fmtTime(ev.start)}–{fmtTime(ev.end)}{ev.location ? ` · ${ev.location}` : ""}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
function DayView({ date, setDate, events, orgById, onDelete }) {
  const items = events.filter((e) => sameDay(new Date(e.start), date)).sort((a, b) => new Date(a.start) - new Date(b.start));
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <IconBtn label="Previous day" onClick={() => setDate(addDays(date, -1))} color={TEXT}><ChevronLeft size={20} /></IconBtn>
        <button onClick={() => setDate(new Date())} className="text-sm font-semibold" style={{ color: TEXT }}>{fmtFullDate(date)}</button>
        <IconBtn label="Next day" onClick={() => setDate(addDays(date, 1))} color={TEXT}><ChevronRight size={20} /></IconBtn>
      </div>
      <DayTimeline date={date} events={events} orgById={orgById} onDelete={null} />
      <div className="mt-3">
        {items.length === 0 && <SectionEmpty text="This day is wide open. Add something below if you want to hold the time." />}
        {items.map((ev) => <EventCard key={ev.id} ev={ev} org={orgById(ev.orgId)} onDelete={() => onDelete(ev.id)} />)}
      </div>
    </div>
  );
}
function WeekView({ date, setDate, events, setViewMode, orgById, onDelete }) {
  const start = startOfWeek(date); const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <IconBtn label="Previous week" onClick={() => setDate(addDays(date, -7))} color={TEXT}><ChevronLeft size={20} /></IconBtn>
        <div className="text-sm font-semibold" style={{ color: TEXT }}>{fmtDayShort(days[0])} – {fmtDayShort(days[6])}</div>
        <IconBtn label="Next week" onClick={() => setDate(addDays(date, 7))} color={TEXT}><ChevronRight size={20} /></IconBtn>
      </div>
      <div className="grid grid-cols-7 gap-1.5 mb-3">
        {days.map((d) => {
          const items = events.filter((e) => sameDay(new Date(e.start), d));
          const dots = items.slice(0, 3).map((e) => orgById(e.orgId)?.color || MUTED);
          return (
            <button key={todayStr(d)} onClick={() => { setDate(d); setViewMode("day"); }} className="rounded-xl py-3 flex flex-col items-center gap-1 lift"
              style={{ background: sameDay(d, new Date()) ? ACCENT_SOFT : CARD, border: `1.5px solid ${sameDay(d, date) ? ACCENT : BORDER}`, aspectRatio: "1" }}>
              <span className="text-xs" style={{ color: MUTED }}>{d.toLocaleDateString([], { weekday: "narrow" })}</span>
              <span className="text-sm font-semibold" style={{ color: TEXT }}>{d.getDate()}</span>
              <div className="flex gap-0.5">{dots.map((c, i) => <span key={i} className="rounded-full" style={{ width: 5, height: 5, background: c }} />)}</div>
              {items.length > 3 && <span className="text-xs" style={{ color: MUTED }}>+{items.length - 3}</span>}
            </button>
          );
        })}
      </div>
      {days.map((d) => {
        const items = events.filter((e) => sameDay(new Date(e.start), d)).sort((a, b) => new Date(a.start) - new Date(b.start));
        if (!items.length) return null;
        return (
          <div key={`list-${todayStr(d)}`} className="mb-3">
            <div className="text-xs font-semibold mb-1" style={{ color: GOLD }}>{fmtDayShort(d)}</div>
            {items.map((ev) => <EventCard key={ev.id} ev={ev} org={orgById(ev.orgId)} onDelete={() => onDelete(ev.id)} />)}
          </div>
        );
      })}
    </div>
  );
}
function MonthView({ date, setDate, events, setViewMode, orgById }) {
  const year = date.getFullYear(), month = date.getMonth();
  const gridStart = startOfWeek(new Date(year, month, 1));
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <IconBtn label="Previous month" onClick={() => setDate(new Date(year, month - 1, 1))} color={TEXT}><ChevronLeft size={20} /></IconBtn>
        <div className="text-sm font-semibold" style={{ color: TEXT }}>{date.toLocaleDateString([], { month: "long", year: "numeric" })}</div>
        <IconBtn label="Next month" onClick={() => setDate(new Date(year, month + 1, 1))} color={TEXT}><ChevronRight size={20} /></IconBtn>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i} className="text-xs text-center pb-1" style={{ color: MUTED }}>{d}</div>)}
        {cells.map((d, i) => {
          const dayEvents = events.filter((e) => sameDay(new Date(e.start), d));
          const inMonth = d.getMonth() === month;
          return (
            <button key={i} onClick={() => { setDate(d); setViewMode("day"); }} className="rounded-lg py-2 flex flex-col items-center gap-1"
              style={{ background: sameDay(d, new Date()) ? ACCENT_SOFT : CARD, opacity: inMonth ? 1 : 0.35, border: `1px solid ${sameDay(d, date) ? ACCENT : BORDER}`, minHeight: 46 }}>
              <span className="text-xs" style={{ color: TEXT }}>{d.getDate()}</span>
              <div className="flex gap-0.5 flex-wrap justify-center">
                {dayEvents.slice(0, 3).map((e) => <span key={e.id} className="rounded-full" style={{ width: 4, height: 4, background: orgById(e.orgId)?.color || GOLD }} />)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
function YearView({ date, setDate, events, setViewMode }) {
  const year = date.getFullYear();
  const countFor = (m) => events.filter((e) => { const d = new Date(e.start); return d.getFullYear() === year && d.getMonth() === m; }).length;
  const max = Math.max(1, ...Array.from({ length: 12 }, (_, m) => countFor(m)));
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <IconBtn label="Previous year" onClick={() => setDate(new Date(year - 1, date.getMonth(), 1))} color={TEXT}><ChevronLeft size={20} /></IconBtn>
        <div className="text-sm font-semibold" style={{ color: TEXT }}>{year}</div>
        <IconBtn label="Next year" onClick={() => setDate(new Date(year + 1, date.getMonth(), 1))} color={TEXT}><ChevronRight size={20} /></IconBtn>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 12 }, (_, m) => m).map((m) => (
          <button key={m} onClick={() => { setDate(new Date(year, m, 1)); setViewMode("month"); }} className="rounded-xl p-3 flex flex-col items-center justify-center gap-2 lift" style={{ ...cardStyle(), aspectRatio: "1" }}>
            <span className="text-sm font-semibold">{new Date(year, m, 1).toLocaleDateString([], { month: "short" })}</span>
            <MeterBar percent={countFor(m) / max} color={GOLD} height={5} />
            <span className="text-xs" style={{ color: MUTED }}>{countFor(m) ? `${countFor(m)} events` : "—"}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
function IcsImport({ onImport }) {
  const [open, setOpen] = useState(false); const [raw, setRaw] = useState(""); const [msg, setMsg] = useState("");
  const fileRef = useRef(null);
  const run = (text) => {
    const parsed = parseIcs(text);
    if (!parsed.length) { setMsg("No events found in that file. Export a .ics from Google Calendar and try again."); return; }
    onImport(parsed); setMsg(`Added ${parsed.length} event${parsed.length === 1 ? "" : "s"}.`); setRaw("");
  };
  const onFile = (e) => {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    const fr = new FileReader(); fr.onload = () => run(String(fr.result)); fr.readAsText(f);
  };
  return (
    <div className="rounded-2xl p-4 mb-3" style={cardStyle()}>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between text-left">
        <span className="text-sm font-semibold flex items-center gap-1.5"><Upload size={14} /> Bring in your Google Calendar</span>
        <ChevronDown size={16} style={{ color: MUTED, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && (
        <div className="mt-3 flex flex-col gap-2">
          <div className="text-xs" style={{ color: MUTED }}>
            In Google Calendar go to Settings → Import &amp; export → Export, then drop the .ics file here. Live two-way sync needs a server, so this is a snapshot you can refresh whenever.
          </div>
          <input ref={fileRef} type="file" accept=".ics,text/calendar" onChange={onFile} aria-label="Choose an .ics file" className="text-xs" style={{ color: MUTED }} />
          <textarea value={raw} onChange={(e) => setRaw(e.target.value)} rows={3} placeholder="…or paste the .ics text here" aria-label="Paste .ics text"
            className="rounded-lg px-3 py-2 text-xs outline-none resize-none" style={fieldStyle()} />
          <div className="flex items-center gap-2">
            <button onClick={() => run(raw)} className="rounded-lg px-3 py-1.5 text-xs font-semibold" style={{ background: ACCENT, color: ACCENT_TEXT }}>Import events</button>
            {msg && <span className="text-xs" style={{ color: SAGE }}>{msg}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= roadmap + applications ================= */

function RoadmapProgress({ milestones }) {
  const total = milestones.length || 1;
  const done = milestones.filter((m) => m.done).length;
  const phases = PHASE_ORDER.map((p) => {
    const items = milestones.filter((m) => m.phase === p);
    return { phase: p, done: items.filter((i) => i.done).length, total: items.length };
  });
  const current = phases.find((p) => p.total && p.done < p.total) || phases[phases.length - 1];
  return (
    <div className="rounded-2xl p-4 mb-3" style={cardStyle()}>
      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: GOLD }}>De Anza → LA</div>
          <div className="font-display text-2xl font-bold" style={{ color: TEXT }}>{Math.round((done / total) * 100)}%</div>
        </div>
        <div className="text-xs text-right" style={{ color: MUTED }}>{done} of {total} steps<br />Now: {current?.phase}</div>
      </div>
      <div className="flex gap-1">
        {phases.map((p) => (
          <div key={p.phase} className="flex-1" title={`${p.phase}: ${p.done}/${p.total}`}>
            <MeterBar percent={p.total ? p.done / p.total : 0} color={p.done === p.total && p.total ? GREEN : ACCENT} height={7} />
          </div>
        ))}
      </div>
      <div className="flex gap-1 mt-1">
        {phases.map((p) => <div key={p.phase} className="flex-1 text-center text-xs truncate" style={{ color: MUTED, fontSize: 9 }}>{p.phase.split(" ")[0]}</div>)}
      </div>
    </div>
  );
}

function MilestonePhaseCard({ phase, items, defaultOpen, onToggle, onAdd, onDelete }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const [text, setText] = useState("");
  const done = items.filter((i) => i.done).length;
  const submit = (e) => { e.preventDefault(); if (!text.trim()) return; onAdd(text.trim()); setText(""); };
  return (
    <div className="rounded-2xl mb-2 overflow-hidden" style={cardStyle()}>
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="w-full flex items-center justify-between p-3 text-left">
        <div>
          <div className="text-xs font-semibold" style={{ color: GOLD }}>{phase}</div>
          <div className="text-xs" style={{ color: MUTED }}>{PHASE_LABELS[phase] || ""}</div>
        </div>
        <div className="flex items-center gap-2" style={{ minWidth: 92 }}>
          <MeterBar percent={items.length ? done / items.length : 0} color={done === items.length && items.length ? GREEN : ACCENT} height={6} />
          <span className="text-xs whitespace-nowrap" style={{ color: MUTED }}>{done}/{items.length}</span>
          <ChevronDown size={16} style={{ color: MUTED, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
        </div>
      </button>
      {open && (
        <div className="px-3 pb-3">
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-2 py-1.5 task-row" style={{ borderTop: `1px solid ${BORDER_SOFT}` }}>
              <button onClick={() => onToggle(it.id)} aria-pressed={it.done} aria-label={it.text}>
                <span key={String(it.done)} className="pop" style={{ color: it.done ? GREEN : MUTED }}>{it.done ? <CheckCircle2 size={16} /> : <Circle size={16} />}</span>
              </button>
              <span className="text-sm flex-1" style={{ color: it.done ? MUTED : TEXT, textDecoration: it.done ? "line-through" : "none" }}>{it.text}</span>
              <span className="row-actions"><IconBtn label={`Delete ${it.text}`} onClick={() => onDelete(it.id)}><Trash2 size={13} /></IconBtn></span>
            </div>
          ))}
          <form onSubmit={submit} className="flex gap-2 mt-2">
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a step to this phase…" aria-label="New milestone" className="flex-1 rounded-lg px-2 py-1.5 text-xs outline-none" style={fieldStyle()} />
            <button type="submit" aria-label="Add milestone" className="rounded-lg px-2" style={{ background: ACCENT, color: ACCENT_TEXT }}><Plus size={14} /></button>
          </form>
        </div>
      )}
    </div>
  );
}

function AddApplicationForm({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(""); const [role, setRole] = useState(""); const [type, setType] = useState("internship");
  const [opens, setOpens] = useState(""); const [deadline, setDeadline] = useState(""); const [recheckBy, setRecheckBy] = useState("");
  const [link, setLink] = useState(""); const [priority, setPriority] = useState(2); const [tags, setTags] = useState("");
  const [amountLabel, setAmountLabel] = useState(""); const [amountValue, setAmountValue] = useState(""); const [autoRemind, setAutoRemind] = useState(true);
  const submit = (e) => {
    e.preventDefault(); if (!name.trim()) return;
    onAdd({ name: name.trim(), role: role.trim(), type, opens: opens || null, deadline: deadline || null, recheckBy: recheckBy || null, link: link.trim(), priority, tags: tags.split(",").map((t) => t.trim()).filter(Boolean), amountLabel: amountLabel.trim(), amountValue: amountValue ? Number(amountValue) : null, status: "not_started" }, autoRemind);
    setName(""); setRole(""); setOpens(""); setDeadline(""); setRecheckBy(""); setLink(""); setAmountLabel(""); setAmountValue(""); setTags(""); setOpen(false);
  };
  if (!open) return (
    <button onClick={() => setOpen(true)} className="w-full rounded-2xl py-3 flex items-center justify-center gap-2 text-sm font-semibold" style={{ border: `1.5px dashed ${BORDER}`, color: MUTED }}>
      <Plus size={16} /> Track another application
    </button>
  );
  return (
    <form onSubmit={submit} className="rounded-2xl p-4 flex flex-col gap-2" style={cardStyle()}>
      <div className="flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Company or org" aria-label="Company" className="flex-1 rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
        <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Type" className="rounded-lg px-2 py-2 text-sm outline-none" style={fieldStyle()}>
          <option value="internship">Internship</option><option value="scholarship">Scholarship</option>
        </select>
      </div>
      <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role or program" aria-label="Role" className="rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
      <div className="flex gap-2">
        <label className="flex-1 text-xs" style={{ color: MUTED }}>Opens<input type="date" value={opens} onChange={(e) => setOpens(e.target.value)} className="w-full rounded-lg px-2 py-2 text-sm outline-none mt-1" style={fieldStyle()} /></label>
        <label className="flex-1 text-xs" style={{ color: MUTED }}>Deadline<input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full rounded-lg px-2 py-2 text-sm outline-none mt-1" style={fieldStyle()} /></label>
      </div>
      <label className="text-xs" style={{ color: MUTED }}>Recheck by<input type="date" value={recheckBy} onChange={(e) => setRecheckBy(e.target.value)} className="w-full rounded-lg px-2 py-2 text-sm outline-none mt-1" style={fieldStyle()} /></label>
      {deadline && <label className="flex items-center gap-2 text-xs" style={{ color: MUTED }}><input type="checkbox" checked={autoRemind} onChange={(e) => setAutoRemind(e.target.checked)} /> Remind me a week before, and again the day before</label>}
      <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Application link" aria-label="Link" className="rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
      <div className="flex gap-2">
        <input value={amountLabel} onChange={(e) => setAmountLabel(e.target.value)} placeholder="Amount, e.g. $5,000" aria-label="Amount label" className="flex-1 rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
        <input type="number" value={amountValue} onChange={(e) => setAmountValue(e.target.value)} placeholder="5000" aria-label="Amount value" className="w-24 rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
      </div>
      <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags, comma separated" aria-label="Tags" className="rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
      <div className="flex items-center justify-between">
        <ImportanceSelect value={priority} onChange={setPriority} />
        <div className="flex gap-2">
          <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm" style={{ border: `1px solid ${BORDER}`, color: MUTED }}>Cancel</button>
          <button type="submit" className="rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: ACCENT, color: ACCENT_TEXT }}>Save</button>
        </div>
      </div>
    </form>
  );
}

function appChip(item) {
  const today = todayStr();
  const opensYet = !item.opens || today >= item.opens;
  const notClosed = !item.deadline || today <= item.deadline;
  const d = item.deadline ? daysUntil(item.deadline) : null;
  if (!opensYet) return { text: `Opens ${fmtDayShort(item.opens + "T12:00:00")}`, color: MUTED, isOpen: false };
  if (!notClosed) return { text: "Closed", color: MUTED, isOpen: false };
  if (d !== null) return { text: d <= 21 ? `${d}d left` : `Due ${fmtDayShort(item.deadline + "T12:00:00")}`, color: d <= 7 ? RED : MUTED, isOpen: true };
  if (item.recheckBy) return { text: `Recheck by ${fmtDayShort(item.recheckBy + "T12:00:00")}`, color: VIOLET, isOpen: true };
  return { text: "Open", color: GREEN, isOpen: true };
}

function ApplicationRowImpl({ item, onDelete, onStatus, onAddReq, onToggleReq, onDeleteReq, onOpenNote }) {
  const [open, setOpen] = useState(false);
  const [reqText, setReqText] = useState("");
  const chip = appChip(item);
  const reqDone = item.requirements.filter((r) => r.done).length;
  const reqSubmit = (e) => { e.preventDefault(); if (!reqText.trim()) return; onAddReq(reqText.trim()); setReqText(""); };
  return (
    <div className="rounded-xl p-3 mb-2 lift task-row" style={cardStyle({ borderLeft: `4px solid ${item.type === "scholarship" ? VIOLET : SAGE}` })}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="rounded-full" title={IMPORTANCE_LABELS[item.priority]} style={{ width: 8, height: 8, background: IMPORTANCE_COLORS[item.priority] }} />
            <div className="text-sm font-medium">{item.name}{item.role ? ` — ${item.role}` : ""}</div>
          </div>
          <div className="flex items-center flex-wrap gap-1.5 mt-1">
            <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: INPUT_BG, color: MUTED }}>{item.type}</span>
            {item.tags.map((t) => <span key={t} className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: INPUT_BG, color: SAGE }}>#{t}</span>)}
            <span className="text-xs font-semibold" style={{ color: chip.color }}>{chip.text}</span>
            {item.amountLabel && <span className="text-xs font-semibold" style={{ color: GREEN }}>{item.amountLabel}</span>}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <IconBtn label="Open linked note" onClick={onOpenNote} color={item.linkedNoteId ? GOLD : MUTED}><NoteIcon size={14} /></IconBtn>
          <span className="row-actions"><IconBtn label={`Delete ${item.name}`} onClick={onDelete}><Trash2 size={14} /></IconBtn></span>
        </div>
      </div>
      {item.requirements.length > 0 && <div className="mt-2"><MeterBar percent={reqDone / item.requirements.length} color={reqDone === item.requirements.length ? GREEN : ACCENT} height={5} /></div>}
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <select value={item.status} onChange={(e) => onStatus(e.target.value)} aria-label={`Status for ${item.name}`} className="text-xs rounded-lg px-2 py-1 outline-none font-semibold" style={{ ...fieldStyle(), color: STATUS_META[item.status].color }}>
          {Object.entries(STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <button onClick={() => setOpen((o) => !o)} className="text-xs" style={{ color: MUTED }} aria-expanded={open}>
          {item.requirements.length > 0 ? `${reqDone}/${item.requirements.length} things needed` : "What's needed?"}
        </button>
        {chip.isOpen && item.link && (
          <a href={item.link} target="_blank" rel="noreferrer" className="ml-auto text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: ACCENT, color: ACCENT_TEXT }}>
            Apply <ExternalLink size={12} />
          </a>
        )}
      </div>
      {open && (
        <div className="mt-2 pt-2" style={{ borderTop: `1px dashed ${BORDER}` }}>
          {item.requirements.map((r) => (
            <div key={r.id} className="flex items-center gap-2 py-1">
              <button onClick={() => onToggleReq(r.id)} aria-pressed={r.done} aria-label={r.text} style={{ color: r.done ? GREEN : MUTED }}>{r.done ? <CheckCircle2 size={14} /> : <Circle size={14} />}</button>
              <span className="text-xs flex-1" style={{ color: r.done ? MUTED : TEXT, textDecoration: r.done ? "line-through" : "none" }}>{r.text}</span>
              <IconBtn label={`Remove ${r.text}`} onClick={() => onDeleteReq(r.id)}><X size={12} /></IconBtn>
            </div>
          ))}
          <form onSubmit={reqSubmit} className="flex gap-2 mt-1">
            <input value={reqText} onChange={(e) => setReqText(e.target.value)} placeholder="Essay, transcript, two recs…" aria-label="New requirement" className="flex-1 rounded-lg px-2 py-1 text-xs outline-none" style={fieldStyle()} />
            <button type="submit" aria-label="Add requirement" className="rounded-lg px-2" style={{ background: ACCENT, color: ACCENT_TEXT }}><Plus size={12} /></button>
          </form>
          {item.notes && <div className="text-xs mt-2" style={{ color: MUTED }}>{item.notes}</div>}
        </div>
      )}
    </div>
  );
}

function ApplicationBoard({ applications, onStatus }) {
  const [dragId, setDragId] = useState(null);
  return (
    <div className="board-scroll flex gap-2 pb-2">
      {KANBAN_COLUMNS.map((col) => {
        const items = applications.filter((a) => a.status === col || (col === "not_started" && a.status === "watching"));
        return (
          <div key={col} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (dragId) { onStatus(dragId, col); setDragId(null); } }}
            className="rounded-2xl p-2 flex-shrink-0" style={{ width: 172, background: CARD_2, border: `1.5px solid ${BORDER_SOFT}`, minHeight: 140 }}>
            <div className="flex items-center justify-between px-1 pb-2">
              <span className="text-xs font-bold" style={{ color: STATUS_META[col].color }}>{STATUS_META[col].short}</span>
              <span className="text-xs" style={{ color: MUTED }}>{items.length}</span>
            </div>
            {items.map((a) => {
              const chip = appChip(a);
              return (
                <div key={a.id} draggable onDragStart={() => setDragId(a.id)} onDragEnd={() => setDragId(null)}
                  className="rounded-xl p-2 mb-2 cursor-grab" style={cardStyle({ borderLeft: `3px solid ${a.type === "scholarship" ? VIOLET : SAGE}`, opacity: dragId === a.id ? 0.4 : 1 })}>
                  <div className="text-xs font-semibold leading-snug">{a.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: chip.color }}>{chip.text}</div>
                  <select value={a.status} onChange={(e) => onStatus(a.id, e.target.value)} aria-label={`Move ${a.name}`} className="text-xs mt-1 w-full rounded px-1 py-0.5 outline-none" style={fieldStyle()}>
                    {Object.entries(STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
              );
            })}
            {items.length === 0 && <div className="text-xs text-center py-4" style={{ color: MUTED }}>Drop here</div>}
          </div>
        );
      })}
    </div>
  );
}

/* ================= reminders ================= */

function AddReminderForm({ orgs, onAdd }) {
  const [text, setText] = useState(""); const [due, setDue] = useState(""); const [orgId, setOrgId] = useState("");
  const [recurrence, setRecurrence] = useState("none"); const [listening, setListening] = useState(false); const [heard, setHeard] = useState("");
  const recogRef = useRef(null);
  const SpeechAPI = typeof window !== "undefined" ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
  const applyParse = (phrase) => {
    const parsed = parseReminderPhrase(phrase);
    if (parsed.text) setText(parsed.text);
    if (parsed.dueAt) setDue(parsed.dueAt);
    if (parsed.recurrence !== "none") setRecurrence(parsed.recurrence);
  };
  const toggleListen = () => {
    if (!SpeechAPI) return;
    if (listening) { recogRef.current && recogRef.current.stop(); setListening(false); return; }
    const recog = new SpeechAPI(); recog.lang = "en-US"; recog.interimResults = false; recog.maxAlternatives = 1;
    recog.onresult = (e) => { const t = e.results[0][0].transcript; setHeard(t); applyParse(t); };
    recog.onerror = () => setListening(false); recog.onend = () => setListening(false);
    recogRef.current = recog; setListening(true); recog.start();
  };
  const submit = (e) => { e.preventDefault(); if (!text.trim()) return; onAdd({ text: text.trim(), dueAt: due || null, orgId: orgId || null, recurrence }); setText(""); setDue(""); setHeard(""); setRecurrence("none"); };
  return (
    <form onSubmit={submit} className="rounded-2xl p-4 mb-3 flex flex-col gap-2" style={cardStyle()}>
      <div className="flex items-center gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Remind me to… (try “call mom tomorrow at 7”)" aria-label="Reminder text" className="flex-1 rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
        <IconBtn label="Read the date and time out of the text" onClick={() => applyParse(text)} color={GOLD} style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: 8 }}><Wand2 size={16} /></IconBtn>
        {SpeechAPI ? (
          <IconBtn label={listening ? "Stop listening" : "Say it instead"} onClick={toggleListen} color={listening ? "#fff" : MUTED}
            style={{ background: listening ? RED : INPUT_BG, border: `1px solid ${listening ? RED : BORDER}`, borderRadius: 8, padding: 8 }}><Mic size={16} /></IconBtn>
        ) : (
          <span title="Your browser can't do voice input" style={{ color: BORDER, padding: 8, border: `1px solid ${BORDER}`, borderRadius: 8 }}><MicOff size={16} /></span>
        )}
      </div>
      {listening && <div className="text-xs" style={{ color: RED }}>Listening…</div>}
      {!listening && heard && <div className="text-xs" style={{ color: MUTED }}>Heard: “{heard}”</div>}
      <div className="flex gap-2">
        <input type="datetime-local" value={due} onChange={(e) => setDue(e.target.value)} aria-label="When" className="flex-1 rounded-lg px-2 py-2 text-sm outline-none" style={fieldStyle()} />
        <select value={orgId} onChange={(e) => setOrgId(e.target.value)} aria-label="List" className="flex-1 rounded-lg px-2 py-2 text-sm outline-none" style={fieldStyle()}>
          <option value="">No list</option>{orgs.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
      </div>
      <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)} aria-label="Repeat" className="rounded-lg px-2 py-2 text-sm outline-none" style={fieldStyle()}>
        {Object.entries(RECURRENCE_META).map(([k, v]) => <option key={k} value={k}>{k === "none" ? "Doesn't repeat" : v.label}</option>)}
      </select>
      <div className="flex justify-end"><button type="submit" className="rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: ACCENT, color: ACCENT_TEXT }}>Add reminder</button></div>
    </form>
  );
}

function ReminderRowImpl({ r, org, onToggle, onDelete, onSnooze }) {
  const [copied, setCopied] = useState(false);
  const urgency = reminderUrgency(r.dueAt, r.done);
  const uColor = URGENCY_COLORS[urgency];
  const rec = r.recurrence || (r.recurring && r.recurring !== "none" ? r.recurring : "none");
  const copy = async () => {
    const msg = `Remind me: ${r.text}${r.dueAt ? " at " + new Date(r.dueAt).toLocaleString() : ""}`;
    try { await navigator.clipboard.writeText(msg); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };
  return (
    <div className="rounded-xl p-3 mb-2 task-row lift" style={cardStyle({ border: `1.5px solid ${urgency === "overdue" || urgency === "urgent" ? uColor : BORDER}`, borderLeft: `4px solid ${org ? org.color : MUTED}` })}>
      <div className="flex items-center gap-2">
        <button onClick={onToggle} aria-pressed={r.done} aria-label={rec !== "none" ? `Done for now — reschedule ${r.text}` : `Mark ${r.text} done`}>
          <span key={String(r.done) + r.dueAt} className="pop" style={{ color: r.done ? GREEN : MUTED }}>{r.done ? <CheckCircle2 size={18} /> : <Circle size={18} />}</span>
        </button>
        <div className="flex-1">
          <div className="text-sm flex items-center gap-1" style={{ textDecoration: r.done ? "line-through" : "none", color: r.done ? MUTED : TEXT }}>
            {r.text}{rec !== "none" && <span className="text-xs" style={{ color: MUTED }}>↻ {RECURRENCE_META[rec]?.short || rec}</span>}
          </div>
          {r.dueAt && (
            <div className="text-xs font-semibold" style={{ color: uColor }}>
              {new Date(r.dueAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })}{urgency === "overdue" ? " · overdue" : ""}
            </div>
          )}
        </div>
        <IconBtn label="Copy this reminder" onClick={copy} color={copied ? GREEN : MUTED}>{copied ? <Check size={16} /> : <Copy size={16} />}</IconBtn>
        <span className="row-actions"><IconBtn label={`Delete ${r.text}`} onClick={onDelete}><Trash2 size={14} /></IconBtn></span>
      </div>
      {r.dueAt && !r.done && (
        <div className="flex gap-2 mt-1 pl-7">
          {[[60, "1 hour"], [1440, "tomorrow"], [10080, "next week"]].map(([m, label]) => (
            <button key={m} onClick={() => onSnooze(m)} className="text-xs px-2 py-0.5 rounded-full" style={{ border: `1px solid ${BORDER}`, color: MUTED }}>+{label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= habits ================= */

function AddHabitForm({ orgs, onAdd }) {
  const [name, setName] = useState(""); const [orgId, setOrgId] = useState("");
  const submit = (e) => { e.preventDefault(); if (!name.trim()) return; onAdd({ name: name.trim(), orgId: orgId || null }); setName(""); };
  return (
    <form onSubmit={submit} className="rounded-2xl p-4 mb-3 flex gap-2" style={cardStyle()}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New habit, like “move for 20 minutes”" aria-label="New habit" className="flex-1 rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
      <select value={orgId} onChange={(e) => setOrgId(e.target.value)} aria-label="List" className="rounded-lg px-2 py-2 text-sm outline-none" style={fieldStyle()}>
        <option value="">Personal</option>{orgs.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
      </select>
      <button type="submit" aria-label="Add habit" className="rounded-lg px-3" style={{ background: ACCENT, color: ACCENT_TEXT }}><Plus size={16} /></button>
    </form>
  );
}
function HabitRowImpl({ habit, checkins, freezeEnabled, onToggleDay, onDelete }) {
  const start = startOfWeek(new Date());
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const { streak, freezes } = habitStreak(habit.id, checkins, freezeEnabled);
  const last30 = Array.from({ length: 30 }, (_, i) => todayStr(addDays(new Date(), -29 + i)));
  const hitRate = last30.filter((ds) => (checkins[habit.id] || []).includes(ds)).length / 30;
  return (
    <div className="rounded-2xl p-3 mb-2 task-row" style={cardStyle()}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold">{habit.name}</span>
        <div className="flex items-center gap-2">
          <StreakBadge streak={streak} freezes={freezes} />
          <span className="row-actions"><IconBtn label={`Delete ${habit.name}`} onClick={onDelete}><Trash2 size={14} /></IconBtn></span>
        </div>
      </div>
      <div className="flex justify-between mb-2">
        {days.map((d) => {
          const ds = todayStr(d);
          const done = (checkins[habit.id] || []).includes(ds);
          const isFuture = d > new Date() && !sameDay(d, new Date());
          return (
            <button key={ds} disabled={isFuture} onClick={() => onToggleDay(habit.id, ds)} aria-pressed={done} aria-label={`${habit.name} on ${fmtDayShort(ds + "T12:00:00")}`}
              className="rounded-full flex items-center justify-center pop" style={{ width: 32, height: 32, background: done ? ACCENT : INPUT_BG, border: `1.5px solid ${done ? ACCENT : BORDER}`, opacity: isFuture ? 0.3 : 1 }}>
              <span className="text-xs font-semibold" style={{ color: done ? ACCENT_TEXT : MUTED }}>{d.toLocaleDateString([], { weekday: "narrow" })}</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <MeterBar percent={hitRate} color={SAGE} height={5} />
        <span className="text-xs whitespace-nowrap" style={{ color: MUTED }}>{Math.round(hitRate * 100)}% of last 30</span>
      </div>
    </div>
  );
}

/* ================= budget ================= */

function BudgetPanel({ budget, onSave }) {
  const [name, setName] = useState(""); const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Rent"); const [kind, setKind] = useState("expense"); const [monthly, setMonthly] = useState(true);
  const items = budget.items || [];
  const monthIncome = items.filter((i) => i.kind === "income").reduce((s, i) => s + i.amount, 0);
  const monthSpend = items.filter((i) => i.kind === "expense").reduce((s, i) => s + i.amount, 0);
  const left = monthIncome - monthSpend;
  const byCat = BUDGET_CATEGORIES.map((c) => ({ c, total: items.filter((i) => i.kind === "expense" && i.category === c).reduce((s, i) => s + i.amount, 0) })).filter((x) => x.total > 0);
  const maxCat = Math.max(1, ...byCat.map((x) => x.total));
  const add = (e) => {
    e.preventDefault(); const amt = Number(amount); if (!name.trim() || !amt) return;
    onSave({ ...budget, items: [...items, { id: genId(), name: name.trim(), amount: amt, category, kind, monthly }] });
    setName(""); setAmount("");
  };
  const remove = (id) => onSave({ ...budget, items: items.filter((i) => i.id !== id) });
  return (
    <div>
      <div className="rounded-2xl p-4 mb-3" style={cardStyle()}>
        <div className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: GOLD }}>This month</div>
        <div className="font-display text-3xl font-bold" style={{ color: left >= 0 ? TEXT : RED }}>{money(left)}</div>
        <div className="text-xs mb-3" style={{ color: MUTED }}>left after {money(monthSpend)} of planned spending</div>
        <MeterBar percent={monthIncome ? monthSpend / monthIncome : 0} color={monthSpend > monthIncome ? RED : ACCENT} height={10} />
        <div className="flex justify-between text-xs mt-1" style={{ color: MUTED }}><span>Money in {money(monthIncome)}</span><span>Money out {money(monthSpend)}</span></div>
      </div>
      {byCat.length > 0 && (
        <div className="rounded-2xl p-4 mb-3" style={cardStyle()}>
          <div className="text-xs font-semibold mb-2" style={{ color: MUTED }}>Where it goes</div>
          {byCat.map((x) => (
            <div key={x.c} className="flex items-center gap-2 py-1">
              <span className="text-xs" style={{ color: TEXT, width: 66 }}>{x.c}</span>
              <div className="flex-1"><MeterBar percent={x.total / maxCat} color={ACCENT} height={7} /></div>
              <span className="text-xs font-semibold" style={{ color: MUTED, width: 58, textAlign: "right" }}>{money(x.total)}</span>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={add} className="rounded-2xl p-4 mb-3 flex flex-col gap-2" style={cardStyle()}>
        <div className="flex gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Rent, groceries, paycheck…" aria-label="Name" className="flex-1 rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" aria-label="Amount" className="w-24 rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
        </div>
        <div className="flex gap-2">
          <select value={kind} onChange={(e) => setKind(e.target.value)} aria-label="Money in or out" className="flex-1 rounded-lg px-2 py-2 text-sm outline-none" style={fieldStyle()}>
            <option value="expense">Money out</option><option value="income">Money in</option>
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category" className="flex-1 rounded-lg px-2 py-2 text-sm outline-none" style={fieldStyle()}>
            {BUDGET_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button type="submit" aria-label="Add line" className="rounded-lg px-3" style={{ background: ACCENT, color: ACCENT_TEXT }}><Plus size={16} /></button>
        </div>
      </form>
      {items.length === 0 ? <SectionEmpty text="Add what comes in and what goes out, and this fills in." /> : items.map((i) => (
        <div key={i.id} className="rounded-xl p-3 mb-2 flex items-center gap-2 task-row" style={cardStyle({ borderLeft: `4px solid ${i.kind === "income" ? GREEN : ACCENT}` })}>
          <span className="text-sm flex-1">{i.name}<span className="text-xs ml-2" style={{ color: MUTED }}>{i.category}</span></span>
          <span className="text-sm font-semibold" style={{ color: i.kind === "income" ? GREEN : TEXT }}>{i.kind === "income" ? "+" : "−"}{money(i.amount)}</span>
          <span className="row-actions"><IconBtn label={`Delete ${i.name}`} onClick={() => remove(i.id)}><Trash2 size={14} /></IconBtn></span>
        </div>
      ))}
    </div>
  );
}

/* ================= notes ================= */

function HexTile({ label, color, count, pinnedCount, onClick }) {
  const hexClip = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";
  return (
    <button onClick={onClick} className="relative hex-tile" style={{ aspectRatio: "0.87" }} aria-label={`${label}, ${count} notes`}>
      <div style={{ position: "absolute", inset: 0, clipPath: hexClip, background: color }} />
      <div className="flex flex-col items-center justify-center gap-1" style={{ position: "absolute", inset: 4, clipPath: hexClip, background: CARD }}>
        <span className="text-sm font-bold text-center px-2" style={{ color: TEXT }}>{label}</span>
        <span className="text-xs" style={{ color: MUTED }}>{count} note{count === 1 ? "" : "s"}</span>
        {pinnedCount > 0 && <span className="text-xs" style={{ color: GOLD }}>★ {pinnedCount}</span>}
      </div>
    </button>
  );
}
function AddFolderForm({ onAdd, onCancel }) {
  const [name, setName] = useState("");
  const submit = (e) => { e.preventDefault(); if (!name.trim()) return; onAdd(name.trim()); setName(""); };
  return (
    <form onSubmit={submit} className="flex items-center gap-1 rounded-full pl-2 pr-1 py-1" style={cardStyle()}>
      <FolderPlus size={12} style={{ color: MUTED }} />
      <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Folder name" aria-label="Folder name" className="text-xs outline-none w-24" style={{ background: "transparent", color: TEXT }} />
      <IconBtn label="Save folder" onClick={submit} color={GOLD}><Check size={13} /></IconBtn>
      <IconBtn label="Cancel" onClick={onCancel}><X size={12} /></IconBtn>
    </form>
  );
}
function AddNoteForm({ folders, onAdd }) {
  const [title, setTitle] = useState(""); const [text, setText] = useState(""); const [tags, setTags] = useState(""); const [folderId, setFolderId] = useState("");
  const submit = (e) => {
    e.preventDefault(); if (!title.trim() && !text.trim()) return;
    onAdd({ title: title.trim() || "Untitled", text: text.trim(), tags: tags.split(",").map((t) => t.trim()).filter(Boolean), folderId: folderId || null });
    setTitle(""); setText(""); setTags("");
  };
  return (
    <form onSubmit={submit} className="rounded-2xl p-4 mb-3 flex flex-col gap-2" style={cardStyle()}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" aria-label="Note title" className="rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Write something…" aria-label="Note body" rows={3} className="rounded-lg px-3 py-2 text-sm outline-none resize-none" style={fieldStyle()} />
      <div className="flex gap-2">
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags, comma separated" aria-label="Tags" className="flex-1 rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
        {folders.length > 0 && (
          <select value={folderId} onChange={(e) => setFolderId(e.target.value)} aria-label="Folder" className="rounded-lg px-2 py-2 text-sm outline-none" style={fieldStyle()}>
            <option value="">No folder</option>{folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        )}
      </div>
      <div className="flex justify-end"><button type="submit" className="rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: ACCENT, color: ACCENT_TEXT }}>Add note</button></div>
    </form>
  );
}
function NoteCard({ note, folders, onDelete, onPin, onEdit, onAddCheck, onToggleCheck, onDeleteCheck }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const [tags, setTags] = useState((note.tags || []).join(", "));
  const [checkText, setCheckText] = useState("");
  const checks = note.checklistItems || [];
  const save = () => {
    onEdit({ title: title.trim() || "Untitled", text: text.trim(), tags: tags.split(",").map((t) => t.trim()).filter(Boolean) });
    setEditing(false);
  };
  const submit = (e) => { e.preventDefault(); if (!checkText.trim()) return; onAddCheck(checkText.trim()); setCheckText(""); };
  const folder = folders.find((f) => f.id === note.folderId);
  return (
    <div className="rounded-xl p-3 mb-2 task-row lift" style={cardStyle({ borderLeft: note.pinned ? `4px solid ${ACCENT}` : `4px solid ${BORDER}` })}>
      {editing ? (
        <div className="flex flex-col gap-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Title" className="rounded-lg px-2 py-1.5 text-sm font-semibold outline-none" style={fieldStyle()} />
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} aria-label="Body" className="rounded-lg px-2 py-1.5 text-sm outline-none resize-none" style={fieldStyle()} />
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags" aria-label="Tags" className="rounded-lg px-2 py-1.5 text-xs outline-none" style={fieldStyle()} />
          <div className="flex justify-end gap-2">
            <button onClick={() => { setTitle(note.title); setText(note.text); setEditing(false); }} className="text-xs px-3 py-1.5 rounded-lg" style={{ border: `1px solid ${BORDER}`, color: MUTED }}>Cancel</button>
            <button onClick={save} className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ background: ACCENT, color: ACCENT_TEXT }}>Save note</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-2">
            <div className="text-sm font-semibold flex-1">{note.title}</div>
            <div className="flex items-center gap-1">
              <IconBtn label={note.pinned ? "Unpin note" : "Pin note"} onClick={onPin} color={note.pinned ? GOLD : MUTED}><span style={{ fontSize: 14, lineHeight: 1 }}>★</span></IconBtn>
              <IconBtn label="Edit note" onClick={() => setEditing(true)}><Pencil size={13} /></IconBtn>
              <span className="row-actions"><IconBtn label={`Delete ${note.title}`} onClick={onDelete}><Trash2 size={14} /></IconBtn></span>
            </div>
          </div>
          {note.text && <div className="text-sm mt-1" style={{ color: MUTED, whiteSpace: "pre-wrap" }}>{note.text}</div>}
        </>
      )}
      {checks.length > 0 && (
        <div className="mt-2">
          {checks.map((c) => (
            <div key={c.id} className="flex items-center gap-2 py-0.5">
              <button onClick={() => onToggleCheck(c.id)} aria-pressed={c.done} aria-label={c.text} style={{ color: c.done ? GREEN : MUTED }}>{c.done ? <CheckCircle2 size={14} /> : <Circle size={14} />}</button>
              <span className="text-xs flex-1" style={{ color: c.done ? MUTED : TEXT, textDecoration: c.done ? "line-through" : "none" }}>{c.text}</span>
              <IconBtn label={`Remove ${c.text}`} onClick={() => onDeleteCheck(c.id)}><X size={12} /></IconBtn>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={submit} className="flex gap-2 mt-2">
        <input value={checkText} onChange={(e) => setCheckText(e.target.value)} placeholder="Add a checklist item" aria-label="New checklist item" className="flex-1 rounded-lg px-2 py-1 text-xs outline-none" style={fieldStyle()} />
        <button type="submit" aria-label="Add checklist item" className="rounded-lg px-2" style={{ background: INPUT_BG, color: MUTED, border: `1px solid ${BORDER}` }}><Plus size={12} /></button>
      </form>
      <div className="flex flex-wrap gap-1 mt-2 items-center">
        {folder && <span className="text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1" style={{ background: INPUT_BG, color: MUTED }}><Folder size={10} />{folder.name}</span>}
        {(note.tags || []).map((t) => <span key={t} className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: INPUT_BG, color: SAGE }}>#{t}</span>)}
      </div>
    </div>
  );
}
function InboxRow({ item, onDelete, onConvert }) {
  return (
    <div className="rounded-xl p-3 mb-2 flex items-center gap-2 flex-wrap" style={cardStyle({ borderLeft: `4px solid ${ACCENT}` })}>
      <span className="flex-1 text-sm" style={{ minWidth: 120 }}>{item.text}</span>
      {[["task", "Make a task"], ["note", "Make a note"], ["reminder", "Set a reminder"]].map(([k, label]) => (
        <button key={k} onClick={() => onConvert(k)} className="text-xs px-2 py-1 rounded-full" style={{ border: `1px solid ${BORDER}`, color: MUTED }}>{label}</button>
      ))}
      <IconBtn label="Delete" onClick={onDelete}><X size={14} /></IconBtn>
    </div>
  );
}

/* ================= reflect ================= */

function BreathingGame() {
  const [phase, setPhase] = useState("in");
  const [running, setRunning] = useState(true);
  useEffect(() => {
    if (!running) return;
    let cancelled = false; const timers = [];
    function cycle() {
      if (cancelled) return;
      setPhase("in");
      timers.push(setTimeout(() => { if (cancelled) return; setPhase("hold"); timers.push(setTimeout(() => { if (cancelled) return; setPhase("out"); timers.push(setTimeout(() => { if (!cancelled) cycle(); }, 4000)); }, 2000)); }, 4000));
    }
    cycle();
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, [running]);
  const label = phase === "in" ? "Breathe in…" : phase === "hold" ? "Hold…" : "Breathe out…";
  return (
    <div className="rounded-2xl p-6 mb-3 flex flex-col items-center" style={cardStyle()}>
      <div className="text-sm font-semibold mb-4" style={{ color: MUTED }}>Four in, two hold, four out</div>
      <div style={{ width: 120, height: 120, position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT}, ${CORAL})`, animation: running ? "breatheCircle 10s ease-in-out infinite" : "none", opacity: 0.85 }} />
      </div>
      <div className="text-lg font-semibold mt-4" style={{ color: TEXT }} aria-live="polite">{running ? label : "Paused"}</div>
      <button onClick={() => setRunning((r) => !r)} className="text-xs px-3 py-1.5 rounded-full font-semibold mt-3" style={{ border: `1.5px solid ${BORDER}`, color: MUTED }}>{running ? "Pause" : "Resume"}</button>
    </div>
  );
}

function RunnerGame({ best, onBest }) {
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [jumping, setJumping] = useState(false);
  const [jumpY, setJumpY] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const distRef = useRef(0); const nextSpawnRef = useRef(120); const idRef = useRef(0); const jumpRef = useRef(false);

  const start = () => { setGameOver(false); setScore(0); setObstacles([]); distRef.current = 0; nextSpawnRef.current = 120; setRunning(true); };
  useEffect(() => {
    if (!running || gameOver) return;
    const speed = 6;
    const id = setInterval(() => {
      distRef.current += speed;
      setObstacles((prev) => {
        let next = prev.map((o) => ({ ...o, x: o.x - speed })).filter((o) => o.x > -30);
        if (distRef.current >= nextSpawnRef.current) {
          idRef.current += 1;
          next = [...next, { id: idRef.current, x: 300, type: idRef.current % 2 === 0 ? "rock" : "bush" }];
          nextSpawnRef.current = distRef.current + 90 + Math.random() * 60;
        }
        const hit = next.some((o) => o.x + 16 > 28 && o.x < 56);
        if (hit && !jumpRef.current) { setGameOver(true); setRunning(false); }
        return next;
      });
      setScore((s) => s + 1);
    }, 45);
    return () => clearInterval(id);
  }, [running, gameOver]);
  useEffect(() => { if (gameOver && score > best) onBest(score); }, [gameOver]);

  const jump = () => {
    if (jumpRef.current || !running || gameOver) return;
    jumpRef.current = true; setJumping(true); setJumpY(-55);
    setTimeout(() => setJumpY(0), 280);
    setTimeout(() => { jumpRef.current = false; setJumping(false); }, 560);
  };
  const act = () => (running ? jump() : start());
  return (
    <div className="rounded-2xl p-4 mb-3" style={cardStyle()}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold" style={{ color: MUTED }}>Take Scout for a run</div>
        <div className="text-xs" style={{ color: MUTED }}>Best {best}{running ? ` · Now ${score}` : ""}</div>
      </div>
      <div role="button" tabIndex={0} aria-label="Trail run game. Press space to jump." onClick={act}
        onKeyDown={(e) => { if (e.key === " " || e.key === "ArrowUp" || e.key === "Enter") { e.preventDefault(); act(); } }}
        style={{ position: "relative", height: 110, borderRadius: 12, background: INPUT_BG, overflow: "hidden", cursor: "pointer", border: `1px solid ${BORDER}` }}>
        <div style={{ position: "absolute", bottom: 18, left: 0, right: 0, height: 2, background: BORDER }} />
        <div style={{ position: "absolute", left: 24, bottom: 20, transform: `translateY(${jumpY}px)`, transition: "transform 0.28s ease-in-out" }}>
          <Mascot state={jumping ? "excited" : gameOver ? "sleepy" : "neutral"} size={34} />
        </div>
        {obstacles.map((o) => (
          <div key={o.id} style={{ position: "absolute", bottom: 18, left: o.x, width: o.type === "rock" ? 14 : 18, height: o.type === "rock" ? 14 : 12, borderRadius: o.type === "rock" ? "40%" : "50% 50% 20% 20%", background: o.type === "rock" ? "#8B6F52" : "#7A8C5A" }} />
        ))}
        {!running && !gameOver && <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold" style={{ color: MUTED }}>Tap or press space to start</div>}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1" style={{ background: "var(--card)", opacity: 0.94 }}>
            <div className="text-sm font-semibold" style={{ color: TEXT }}>Score {score}</div>
            <div className="text-xs" style={{ color: MUTED }}>Tap to run again</div>
          </div>
        )}
      </div>
      <div className="text-xs mt-2 text-center" style={{ color: MUTED }}>Space, arrow up, or tap to jump.</div>
    </div>
  );
}

function AdviceCard() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * ADVICE.length));
  const shuffle = () => setIdx((i) => { let n = i; while (n === i) n = Math.floor(Math.random() * ADVICE.length); return n; });
  return (
    <div className="rounded-2xl p-6 mb-4 text-center" style={cardStyle()}>
      <Sparkles size={28} color={GOLD} style={{ margin: "0 auto 10px" }} />
      <div key={idx} className="text-xl font-semibold leading-snug pop" style={{ color: TEXT }}>{ADVICE[idx]}</div>
      <button onClick={shuffle} className="text-xs px-3 py-1.5 rounded-full font-semibold mt-4" style={{ border: `1.5px solid ${BORDER}`, color: MUTED }}>Show me another</button>
    </div>
  );
}
function TrendBars({ reflections, days = 7 }) {
  const list = Array.from({ length: days }, (_, i) => addDays(new Date(), -(days - 1) + i));
  return (
    <div className="flex items-end gap-1 mt-2" style={{ height: 68 }}>
      {list.map((d) => {
        const ds = todayStr(d);
        const r = reflections.find((x) => x.date === ds);
        const h = r ? (r.energy / 5) * 100 : 6;
        return (
          <div key={ds} className="flex-1 flex flex-col items-center justify-end gap-1" style={{ height: "100%" }} title={r ? `${fmtDayShort(ds + "T12:00:00")} · energy ${r.energy}/5` : fmtDayShort(ds + "T12:00:00")}>
            {r && days <= 10 && <span style={{ fontSize: 12 }}>{r.mood}</span>}
            <div className="w-full rounded" style={{ height: `${h}%`, background: r ? ACCENT : BORDER, minHeight: 4, transition: "height 0.4s" }} />
            {days <= 10 && <span className="text-xs" style={{ color: MUTED }}>{d.toLocaleDateString([], { weekday: "narrow" })}</span>}
          </div>
        );
      })}
    </div>
  );
}
function WeeklyReview({ reflections, tasksThisWeek, milestonesDone, remindersDone, topMood }) {
  const week = reflections.filter((r) => new Date(r.date) >= addDays(new Date(), -6));
  const avgEnergy = week.length ? (week.reduce((s, r) => s + r.energy, 0) / week.length).toFixed(1) : "—";
  const wins = week.filter((r) => r.win).slice(0, 3);
  return (
    <div className="rounded-2xl p-4 mb-3" style={cardStyle()}>
      <div className="text-xs uppercase tracking-widest font-semibold mb-2 flex items-center gap-1" style={{ color: GOLD }}><TrendingUp size={13} /> Your week</div>
      <div className="grid grid-cols-4 gap-2 mb-3">
        {[[tasksThisWeek, "tasks"], [milestonesDone, "milestones"], [remindersDone, "reminders"], [avgEnergy, "avg energy"]].map(([v, l]) => (
          <div key={l} className="rounded-xl p-2 text-center" style={{ background: CARD_2, border: `1px solid ${BORDER_SOFT}` }}>
            <div className="font-display text-lg font-bold" style={{ color: TEXT }}>{v}</div>
            <div className="text-xs" style={{ color: MUTED }}>{l}</div>
          </div>
        ))}
      </div>
      {topMood && <div className="text-sm mb-2" style={{ color: MUTED }}>Mostly {topMood} kind of week.</div>}
      {wins.length > 0 && (
        <div>
          <div className="text-xs font-semibold mb-1" style={{ color: MUTED }}>Wins you wrote down</div>
          {wins.map((w) => <div key={w.id} className="text-sm py-0.5">· {w.win}</div>)}
        </div>
      )}
    </div>
  );
}
function ReflectionForm({ existing, onSave, saved }) {
  const [mood, setMood] = useState(existing?.mood || "🙂");
  const [energy, setEnergy] = useState(existing?.energy || 3);
  const [gratitude, setGratitude] = useState(existing?.gratitude || "");
  const [win, setWin] = useState(existing?.win || "");
  const [journalText, setJournalText] = useState(existing?.journalText || "");
  useEffect(() => {
    setMood(existing?.mood || "🙂"); setEnergy(existing?.energy || 3);
    setGratitude(existing?.gratitude || ""); setWin(existing?.win || ""); setJournalText(existing?.journalText || "");
  }, [existing]);
  const submit = (e) => { e.preventDefault(); onSave({ mood, energy, gratitude: gratitude.trim(), win: win.trim(), journalText: journalText.trim() }); };
  return (
    <form onSubmit={submit} className="rounded-2xl p-4 mb-3 flex flex-col gap-4" style={cardStyle()}>
      <div className="flex flex-col items-center">
        <div className="text-xs mb-2" style={{ color: MUTED }}>How did today feel?</div>
        <div className="flex gap-3 justify-center" role="radiogroup" aria-label="Mood">
          {MOODS.map((m) => (
            <button key={m} type="button" role="radio" aria-checked={mood === m} aria-label={`Mood ${m}`} onClick={() => setMood(m)} className="rounded-full pop"
              style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: mood === m ? ACCENT_SOFT : "transparent", border: mood === m ? `2px solid ${ACCENT}` : "2px solid transparent", fontSize: 26 }}>{m}</button>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center"><div className="text-xs mb-2" style={{ color: MUTED }}>Energy</div><EnergyBar value={energy} onChange={setEnergy} /></div>
      <input value={gratitude} onChange={(e) => setGratitude(e.target.value)} placeholder="One thing you're grateful for" aria-label="Gratitude" className="rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
      <input value={win} onChange={(e) => setWin(e.target.value)} placeholder="Small win of the day" aria-label="Win" className="rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
      <textarea value={journalText} onChange={(e) => setJournalText(e.target.value)} placeholder={`What happened today, ${fmtFullDate()}?`} aria-label="Journal" rows={3} className="rounded-lg px-3 py-2 text-sm outline-none resize-none" style={fieldStyle()} />
      <div className="flex justify-end items-center gap-2">
        {saved && <span className="text-xs" style={{ color: GREEN }}>Saved</span>}
        <button type="submit" className="rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: ACCENT, color: ACCENT_TEXT }}>Save today's reflection</button>
      </div>
    </form>
  );
}

/* ================= splash + lists ================= */

function Splash({ phase, onDismiss }) {
  if (phase === "hidden") return null;
  return (
    <div onClick={onDismiss} className="flex flex-col items-center justify-center"
      style={{ position: "fixed", inset: 0, zIndex: 70, background: BASE_GRADIENT, opacity: phase === "fading" ? 0 : 1, transition: "opacity 400ms ease", cursor: "pointer" }}>
      <div style={{ position: "absolute", top: "12%", left: "10%", width: 160, height: 160, borderRadius: "50%", background: "var(--glow-a)", filter: "blur(34px)" }} />
      <div style={{ position: "absolute", bottom: "18%", right: "12%", width: 200, height: 200, borderRadius: "50%", background: "var(--glow-b)", filter: "blur(40px)" }} />
      <Mascot state="excited" size={100} />
      <div className="font-display text-3xl font-bold mt-3 splash-title" style={{ color: TEXT }}>Scout By Daen</div>
      <div className="text-sm mt-1" style={{ color: MUTED }}>welcome home</div>
    </div>
  );
}

function OrgSquare({ org, doneCount, total, topTask, streakInfo, cover, neglected, reorderMode, canMoveLeft, canMoveRight, onOpen, onCheckin, onMoveLeft, onMoveRight, onArchive }) {
  const pct = total > 0 ? doneCount / total : 0;
  const hasCover = !!cover;
  return (
    <div onClick={() => !reorderMode && onOpen()} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" && !reorderMode) onOpen(); }}
      className="relative rounded-2xl overflow-hidden cursor-pointer lift" aria-label={`${org.name} list`}
      style={{ aspectRatio: "1", background: hasCover ? "#000" : CARD, border: `1.5px solid ${BORDER}`, boxShadow: CARD_SHADOW, opacity: neglected ? 0.62 : 1 }}>
      {hasCover && <img src={cover} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.85 }} />}
      {hasCover && <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.68) 100%)" }} />}
      {!hasCover && <div className="absolute top-0 left-0 right-0" style={{ height: 5, background: org.color }} />}
      <div className="absolute inset-0 p-3 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-1">
          <span className="text-sm font-semibold" style={{ color: hasCover ? "#fff" : TEXT }}>{org.name}</span>
          <StreakBadge streak={streakInfo.streak} freezes={streakInfo.freezes} onDark={hasCover} />
        </div>
        <div>
          <div className="text-xs truncate mb-2" style={{ color: hasCover ? "rgba(255,255,255,0.85)" : MUTED }}>{topTask || (total ? "All caught up" : "Nothing here yet")}</div>
          <div className="flex items-end justify-between">
            <ProgressRing percent={pct} size={40} color={hasCover ? "#fff" : org.color} track={hasCover ? "rgba(255,255,255,0.3)" : BORDER_SOFT} />
            <IconBtn label={`Check in with ${org.name}`} onClick={(e) => { e.stopPropagation(); onCheckin(); }} color={hasCover ? TEXT : GOLD}
              style={{ background: hasCover ? "rgba(255,255,255,0.85)" : ACCENT_SOFT, borderRadius: "50%", padding: 8 }}><Check size={16} /></IconBtn>
          </div>
        </div>
      </div>
      {reorderMode && (
        <div className="absolute inset-0 flex items-center justify-between px-2" style={{ background: "var(--scrim)" }}>
          <IconBtn label="Move left" onClick={(e) => { e.stopPropagation(); onMoveLeft(); }} disabled={!canMoveLeft} color="#fff" style={{ opacity: canMoveLeft ? 1 : 0.3 }}><ChevronLeft size={20} /></IconBtn>
          <IconBtn label="Archive list" onClick={(e) => { e.stopPropagation(); onArchive(); }} color="#fff"><Archive size={18} /></IconBtn>
          <IconBtn label="Move right" onClick={(e) => { e.stopPropagation(); onMoveRight(); }} disabled={!canMoveRight} color="#fff" style={{ opacity: canMoveRight ? 1 : 0.3 }}><ChevronRight size={20} /></IconBtn>
        </div>
      )}
    </div>
  );
}
function AddIdeaForm({ onAdd }) {
  const [text, setText] = useState("");
  const submit = (e) => { e.preventDefault(); if (!text.trim()) return; onAdd(text.trim()); setText(""); };
  return (
    <form onSubmit={submit} className="flex gap-2 mt-2">
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Something to try someday…" aria-label="New idea" className="flex-1 rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
      <button type="submit" aria-label="Add idea" className="rounded-lg px-3" style={{ background: ACCENT, color: ACCENT_TEXT }}><Plus size={16} /></button>
    </form>
  );
}

function OrgDashboard({
  org, items, doneMap, today, timers, setTimers, photos, ideas, activity, streakInfo, weekDone, nextDeadline,
  freezeEnabled, onBack, taskHandlers, onReorder, onAddPhoto, onDeletePhoto, onAddIdea, onPromoteIdea, onDeleteIdea, onRename,
}) {
  const [photoUrl, setPhotoUrl] = useState("");
  const [showDone, setShowDone] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(org.name);
  const submitPhoto = (e) => { e.preventDefault(); if (!photoUrl.trim()) return; onAddPhoto(photoUrl.trim()); setPhotoUrl(""); };
  const open = items.filter((i) => !taskIsDone(i, doneMap, today));
  const done = items.filter((i) => taskIsDone(i, doneMap, today));
  return (
    <div className="pt-1">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-3" style={{ color: MUTED }}><ArrowLeft size={16} /> All lists</button>
      <div className="rounded-2xl p-5 mb-3 flex flex-col items-center text-center" style={cardStyle({ borderTop: `4px solid ${org.color}` })}>
        <div className="flex items-center gap-2 mb-1">
          <span className="rounded-full" style={{ width: 10, height: 10, background: org.color }} />
          {renaming ? (
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} onBlur={() => { onRename(name.trim() || org.name); setRenaming(false); }}
              onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()} aria-label="List name" className="text-lg font-semibold rounded-lg px-2 py-1 outline-none text-center" style={fieldStyle()} />
          ) : (
            <button onClick={() => setRenaming(true)} className="text-lg font-semibold flex items-center gap-1.5">{org.name}<Pencil size={12} style={{ color: MUTED }} /></button>
          )}
        </div>
        <CircularTimer timerKey={org.id} timers={timers} setTimers={setTimers} size={130} color={org.color} />
      </div>
      <div className="rounded-2xl p-4 mb-3 grid grid-cols-3 gap-2 text-center" style={cardStyle()}>
        <div><div className="font-display text-xl font-bold">{weekDone}</div><div className="text-xs" style={{ color: MUTED }}>done this week</div></div>
        <div><div className="font-display text-xl font-bold flex items-center justify-center gap-1">{streakInfo.streak}{streakInfo.freezes > 0 && <Snowflake size={13} style={{ color: SAGE }} />}</div><div className="text-xs" style={{ color: MUTED }}>day streak</div></div>
        <div><div className="font-display text-sm font-bold pt-1">{nextDeadline || "—"}</div><div className="text-xs" style={{ color: MUTED }}>next deadline</div></div>
      </div>
      {items.length === 0 && <SectionEmpty text="Nothing on this list today. Add the first thing below." />}
      <TaskList items={open} ds={today} doneMap={doneMap} orgById={() => null} freezeEnabled={freezeEnabled} onReorder={onReorder} {...taskHandlers} />
      {done.length > 0 && (
        <div className="mt-2">
          <button onClick={() => setShowDone((s) => !s)} className="text-xs flex items-center gap-1" style={{ color: MUTED }} aria-expanded={showDone}>
            <CheckCircle2 size={12} /> Finished ({done.length}) <ChevronDown size={12} style={{ transform: showDone ? "rotate(180deg)" : "none" }} />
          </button>
          {showDone && <TaskList items={done} ds={today} doneMap={doneMap} orgById={() => null} freezeEnabled={freezeEnabled} onReorder={onReorder} {...taskHandlers} />}
        </div>
      )}
      <AddChecklistForm onAdd={(data) => taskHandlers.onAdd({ ...data, orgId: org.id })} />

      <div className="text-sm font-semibold mt-6 mb-2 flex items-center gap-1"><Lightbulb size={16} /> Ideas for someday</div>
      {ideas.length === 0 && <div className="text-xs mb-1" style={{ color: MUTED }}>Anything worth trying later goes here, no pressure attached.</div>}
      {ideas.map((i) => (
        <div key={i.id} className="flex items-center gap-2 py-1.5 task-row" style={{ borderBottom: `1px solid ${BORDER_SOFT}` }}>
          <span className="flex-1 text-sm">{i.text}</span>
          <button onClick={() => onPromoteIdea(i)} className="text-xs px-2 py-1 rounded-full" style={{ border: `1px solid ${BORDER}`, color: GOLD }}>Make it a task</button>
          <IconBtn label="Delete idea" onClick={() => onDeleteIdea(i.id)}><X size={14} /></IconBtn>
        </div>
      ))}
      <AddIdeaForm onAdd={onAddIdea} />

      {activity.length > 0 && (
        <div className="mt-6">
          <div className="text-sm font-semibold mb-2 flex items-center gap-1"><ActivityIcon size={16} /> Recently</div>
          {activity.slice(0, 6).map((a) => (
            <div key={a.id} className="text-xs py-1 flex justify-between gap-3" style={{ color: MUTED }}>
              <span style={{ color: TEXT }}>{a.text}</span><span className="whitespace-nowrap">{new Date(a.at).toLocaleDateString([], { month: "short", day: "numeric" })}</span>
            </div>
          ))}
        </div>
      )}

      <div className="text-sm font-semibold mt-6 mb-2 flex items-center gap-1"><ImageIcon size={16} /> Photos</div>
      <div className="text-xs mb-2 rounded-xl p-3" style={cardStyle({ color: MUTED })}>Paste an image link — the first one becomes this list's cover.</div>
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-2">
          {photos.map((p) => (
            <div key={p.id} className="relative rounded-lg overflow-hidden" style={{ aspectRatio: "1", border: `1px solid ${BORDER}` }}>
              <img src={p.url} alt="" className="w-full h-full object-cover" />
              <IconBtn label="Remove photo" onClick={() => onDeletePhoto(p.id)} color="#fff" style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.5)", borderRadius: "50%", padding: 2 }}><X size={12} /></IconBtn>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={submitPhoto} className="flex gap-2 mb-6">
        <input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="Paste image URL…" aria-label="Image URL" className="flex-1 rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
        <button type="submit" aria-label="Add photo" className="rounded-lg px-3 py-2" style={{ background: ACCENT, color: ACCENT_TEXT }}><Plus size={16} /></button>
      </form>
    </div>
  );
}

/* ================= command palette ================= */

function CommandPalette({ open, onClose, results, query, setQuery, onPick }) {
  const [cursor, setCursor] = useState(0);
  useEffect(() => { setCursor(0); }, [query, open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, results.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
      if (e.key === "Enter" && results[cursor]) { e.preventDefault(); onPick(results[cursor]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, cursor, onClose, onPick]);
  if (!open) return null;
  return (
    <div className="palette-scrim" onClick={onClose} style={{ background: "var(--scrim)" }}>
      <div className="palette" onClick={(e) => e.stopPropagation()} style={{ background: CARD, border: `1.5px solid ${BORDER}`, boxShadow: SHADOW_LG }}>
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: `1px solid ${BORDER_SOFT}` }}>
          <Search size={16} style={{ color: MUTED }} />
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search or jump to…" aria-label="Search everything"
            className="flex-1 text-sm outline-none" style={{ background: "transparent", color: TEXT }} />
          <kbd className="text-xs px-1.5 py-0.5 rounded" style={{ background: INPUT_BG, color: MUTED, border: `1px solid ${BORDER}` }}>esc</kbd>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: 340 }}>
          {results.length === 0 && <div className="px-4 py-6 text-sm text-center" style={{ color: MUTED }}>{query.length < 2 ? "Type to search tasks, notes, reminders, applications…" : "Nothing matched that."}</div>}
          {results.map((r, i) => (
            <button key={i} onMouseEnter={() => setCursor(i)} onClick={() => onPick(r)}
              className="w-full text-left px-4 py-2 text-sm flex items-center gap-2"
              style={{ background: i === cursor ? ACCENT_SOFT : "transparent" }}>
              <span className="text-xs px-1.5 py-0.5 rounded whitespace-nowrap" style={{ background: INPUT_BG, color: MUTED }}>{r.type}</span>
              <span className="flex-1 truncate" style={{ color: TEXT }}>{r.label}</span>
              {r.hint && <span className="text-xs" style={{ color: MUTED }}>{r.hint}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= settings ================= */

function SettingsPanel({ settings, onChange, onExport, onImport, notifyState, onAskNotify }) {
  const fileRef = useRef(null);
  const pick = (e) => {
    const files = Array.from(e.target.files || []); if (!files.length) return;
    Promise.all(files.map((f) => new Promise((res) => {
      const fr = new FileReader();
      fr.onload = () => { try { res(JSON.parse(String(fr.result))); } catch { res(null); } };
      fr.readAsText(f);
    }))).then((dumps) => onImport(dumps.filter(Boolean)));
  };
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-sm font-semibold mb-2">Palette</div>
        <div className="flex gap-2 mb-3">
          {PALETTES.map(([id, label]) => (
            <button key={id} onClick={() => onChange({ ...settings, palette: id })} aria-pressed={(settings.palette || "golden") === id}
              className="flex-1 rounded-xl p-2 flex flex-col items-center gap-1.5"
              style={{ border: `2px solid ${(settings.palette || "golden") === id ? ACCENT : BORDER}`, background: CARD_2 }}>
              <span className="rounded-full" data-palette={id} style={{ width: 26, height: 26, background: `linear-gradient(135deg, var(--a1), var(--a2))` }} />
              <span className="text-xs" style={{ color: MUTED }}>{label}</span>
            </button>
          ))}
        </div>
        <div className="text-sm font-semibold mb-2">Look</div>
        <Segmented ariaLabel="Theme" value={settings.theme} onChange={(v) => onChange({ ...settings, theme: v })}
          options={[["auto", "Auto"], ["light", "Day"], ["dark", "Night"]]} />
        <div className="text-xs mt-1" style={{ color: MUTED }}>Auto follows your device, so Scout dims when you do.</div>
      </div>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="text-sm font-semibold">Nudge me for reminders</div>
          <div className="text-xs" style={{ color: MUTED }}>
            {notifyState === "granted" ? "On — but a browser can only notify you while this page is open somewhere. Anything missed while it was closed is shown when you come back." : notifyState === "denied" ? "Your browser is blocking notifications — turn them back on in site settings." : "Scout will ask your browser for permission."}
          </div>
        </div>
        <button onClick={() => { if (notifyState !== "granted") onAskNotify(); onChange({ ...settings, notifications: !settings.notifications }); }}
          className="rounded-full px-3 py-1.5 text-xs font-semibold flex items-center gap-1"
          style={{ background: settings.notifications ? ACCENT : INPUT_BG, color: settings.notifications ? ACCENT_TEXT : MUTED, border: `1px solid ${BORDER}` }}>
          {settings.notifications ? <Bell size={13} /> : <BellOff size={13} />}{settings.notifications ? "On" : "Off"}
        </button>
      </div>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="text-sm font-semibold flex items-center gap-1"><Snowflake size={13} style={{ color: SAGE }} /> Forgive one missed day a week</div>
          <div className="text-xs" style={{ color: MUTED }}>Streaks survive a single skipped day, once every seven. Life happens.</div>
        </div>
        <button onClick={() => onChange({ ...settings, streakFreeze: !settings.streakFreeze })} className="rounded-full px-3 py-1.5 text-xs font-semibold"
          style={{ background: settings.streakFreeze ? ACCENT : INPUT_BG, color: settings.streakFreeze ? ACCENT_TEXT : MUTED, border: `1px solid ${BORDER}` }}>
          {settings.streakFreeze ? "On" : "Off"}
        </button>
      </div>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="text-sm font-semibold">Show Manila time</div>
          <div className="text-xs" style={{ color: MUTED }}>A second clock on the Today screen, for while you're home or calling home.</div>
        </div>
        <button onClick={() => onChange({ ...settings, manilaClock: !settings.manilaClock })} className="rounded-full px-3 py-1.5 text-xs font-semibold"
          style={{ background: settings.manilaClock ? ACCENT : INPUT_BG, color: settings.manilaClock ? ACCENT_TEXT : MUTED, border: `1px solid ${BORDER}` }}>
          {settings.manilaClock ? "On" : "Off"}
        </button>
      </div>
      <div>
        <div className="text-sm font-semibold mb-2">Your data</div>
        <div className="flex gap-2">
          <button onClick={onExport} className="flex-1 rounded-lg px-3 py-2 text-sm font-semibold flex items-center justify-center gap-1.5" style={{ border: `1.5px solid ${BORDER}`, color: TEXT }}>
            <Download size={14} /> Save a backup
          </button>
          <button onClick={() => fileRef.current && fileRef.current.click()} className="flex-1 rounded-lg px-3 py-2 text-sm font-semibold flex items-center justify-center gap-1.5" style={{ border: `1.5px solid ${BORDER}`, color: TEXT }}>
            <Upload size={14} /> Restore a backup
          </button>
        </div>
        <input ref={fileRef} type="file" accept="application/json" multiple onChange={pick} className="hidden" aria-label="Backup files" />
        <div className="text-xs mt-1" style={{ color: MUTED }}>
          You can pick several files at once — if you have separate exports from Scout Day, Journal and Apply, select all three and they merge.
        </div>
      </div>
    </div>
  );
}

/* ===================================================================== */

export default function Scout() {
  const [tab, setTab] = useState("today");
  const [loaded, setLoaded] = useState(false);
  const [splash, setSplash] = useState("visible");

  const [orgs, setOrgs] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [doneMap, setDoneMap] = useState({});
  const [events, setEvents] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [applications, setApplications] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [habits, setHabits] = useState([]);
  const [habitCheckins, setHabitCheckins] = useState({});
  const [orgCheckins, setOrgCheckins] = useState({});
  const [orgPhotos, setOrgPhotos] = useState({});
  const [orgIdeas, setOrgIdeas] = useState({});
  const [orgActivity, setOrgActivity] = useState({});
  const [reflections, setReflections] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [budget, setBudget] = useState({ items: [] });
  const [settings, setSettings] = useState({ theme: "auto", notifications: false, streakFreeze: true });
  const [timers, setTimers] = useState({});
  const [focus, setFocus] = useState("");
  const [gameBest, setGameBest] = useState(0);
  const [schools, setSchools] = useState([]);
  const [assets, setAssets] = useState([]);
  const [letters, setLetters] = useState([]);
  const [snippets, setSnippets] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [sharedDone, setSharedDone] = useState({});
  const [reviews, setReviews] = useState([]);
  const [applyView, setApplyView] = useState(null);
  const [applySub, setApplySub] = useState("schools");
  const [focusRoom, setFocusRoom] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [workshopId, setWorkshopId] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [noteLayout, setNoteLayout] = useState("board");
  const [profile, setProfile] = useState({ name: "", school: "", major: "", targetGpa: "", pronouns: "", email: "" });
  const [courses, setCourses] = useState([]);
  const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [aidItems, setAidItems] = useState([]);
  const [interviewQs, setInterviewQs] = useState([]);
  const [spaces, setSpaces] = useState({});
  const [campaignView, setCampaignView] = useState("overview");
  const [spaceView, setSpaceView] = useState("overview");
  const [activeSpace, setActiveSpace] = useState(null);
  const [tplPrefill, setTplPrefill] = useState(null);
  const [trash, setTrash] = useState([]);
  const [lastBackup, setLastBackup] = useState(null);
  const [dismissedBackup, setDismissedBackup] = useState(false);
  const [missed, setMissed] = useState([]);
  const [showRevisions, setShowRevisions] = useState(false);
  const [tod, setTod] = useState(todOf(new Date()));

  const [now, setNow] = useState(new Date());
  const [today, setToday] = useState(todayStr());
  const [confetti, setConfetti] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [systemDark, setSystemDark] = useState(false);

  const [activeOrg, setActiveOrg] = useState(null);
  const [reorderLists, setReorderLists] = useState(false);
  const [reorderTasks, setReorderTasks] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [showDoneToday, setShowDoneToday] = useState(false);
  const [calView, setCalView] = useState("day");
  const [calDate, setCalDate] = useState(new Date());
  const [goalView, setGoalView] = useState("remind");
  const [appView, setAppView] = useState("list");
  const [notesOrgView, setNotesOrgView] = useState(null);
  const [notesFolder, setNotesFolder] = useState(null);
  const [addingFolder, setAddingFolder] = useState(false);
  const [trendRange, setTrendRange] = useState(7);
  const [reflectSaved, setReflectSaved] = useState(false);
  const [quickCapture, setQuickCapture] = useState("");

  const notifiedRef = useRef({});
  const dark = settings.theme === "dark" || (settings.theme === "auto" && systemDark);

  /* ---------- load ---------- */
  useEffect(() => {
    (async () => {
      const [
        so, sc, sdNew, sdOld, se, sr, sn, sf, sa, sm, sh, shc, soc, sop, soi, soa, srf, si, sb, sset, st, sfoc, sg, sver,
      ] = await Promise.all([
        loadKey("orgs", null), loadKey("checklist", []), loadKey("checklist-done-v2", null), loadKey("checklist-done", {}),
        loadKey("events", null), loadKey("reminders", []), loadKey("notes", null), loadKey("note-folders", []),
        loadKey("applications", null), loadKey("milestones", null), loadKey("habits", []), loadKey("habit-checkins", {}),
        loadKey("org-checkins", {}), loadKey("org-photos", {}), loadKey("org-ideas", {}), loadKey("org-activity", {}),
        loadKey("reflections", []), loadKey("inbox", []), loadKey("budget", { items: [] }), loadKey("settings", null),
        loadKey("timers", {}), loadKey("focus", ""), loadKey("game-best", 0), loadKey("schema-version", 0),
      ]);

      const orgsSeeded = so && so.version === ORG_VERSION ? so.list : SEED_ORGS;
      if (!so || so.version !== ORG_VERSION) saveKey("orgs", { version: ORG_VERSION, list: SEED_ORGS });
      const eventsSeeded = se && se.version === "v1" ? se.list : SEED_EVENTS;
      if (!se || se.version !== "v1") saveKey("events", { version: "v1", list: SEED_EVENTS });
      const notesSeeded = sn && sn.version === NOTES_VERSION ? sn.list : SEED_NOTES;
      if (!sn || sn.version !== NOTES_VERSION) saveKey("notes", { version: NOTES_VERSION, list: SEED_NOTES });
      const appsSeeded = sa && sa.version === APPS_VERSION ? sa.list : SEED_APPLICATIONS;
      if (!sa || sa.version !== APPS_VERSION) saveKey("applications", { version: APPS_VERSION, list: SEED_APPLICATIONS });
      const msSeeded = sm && sm.version === MILESTONES_VERSION ? sm.list : SEED_MILESTONES;
      if (!sm || sm.version !== MILESTONES_VERSION) saveKey("milestones", { version: MILESTONES_VERSION, list: SEED_MILESTONES });

      /* one-time migrations */
      let doneNext = sdNew;
      if (!doneNext) { doneNext = migrateDoneMap(sdOld); saveKey("checklist-done-v2", doneNext); }
      let listNext = sc || [];
      if (sver < SCHEMA_VERSION) {
        listNext = listNext.map((i, idx) => ({
          subtasks: [], link: null, ...i,
          recurrence: i.recurrence || (i.recurring ? "daily" : "none"),
          order: typeof i.order === "number" ? i.order : idx,
        }));
        saveKey("checklist", listNext);
        saveKey("schema-version", SCHEMA_VERSION);
      }

      setOrgs(orgsSeeded); setChecklist(listNext); setDoneMap(doneNext);
      setEvents(eventsSeeded); setReminders(sr.map((r) => ({ recurrence: r.recurrence || (r.recurring === true ? "daily" : r.recurring || "none"), ...r })));
      setNotes(notesSeeded); setFolders(sf); setApplications(appsSeeded); setMilestones(msSeeded);
      setHabits(sh); setHabitCheckins(shc); setOrgCheckins(soc); setOrgPhotos(sop); setOrgIdeas(soi); setOrgActivity(soa);
      setReflections(srf); setInbox(si); setBudget(sb || { items: [] });
      const [ssch, sass, slet, ssnip, ssess, sshared, srev] = await Promise.all([
        loadKey("schools", null), loadKey("assets", null), loadKey("letters", []),
        loadKey("snippets", []), loadKey("sessions", []), loadKey("shared-done", {}), loadKey("reviews", []),
      ]);
      const schoolsSeeded = ssch && ssch.version === SCHOOLS_VERSION ? ssch.list : SEED_SCHOOLS;
      if (!ssch || ssch.version !== SCHOOLS_VERSION) saveKey("schools", { version: SCHOOLS_VERSION, list: SEED_SCHOOLS });
      const assetsSeeded = sass && sass.version === ASSETS_VERSION ? sass.list : SEED_ASSETS;
      if (!sass || sass.version !== ASSETS_VERSION) saveKey("assets", { version: ASSETS_VERSION, list: SEED_ASSETS });
      setSchools(schoolsSeeded); setAssets(assetsSeeded); setLetters(slet); setSnippets(ssnip);
      setSessions(ssess); setSharedDone(sshared); setReviews(srev);
      const [sprof, scou, sact, scon, stpl, said, siq, ssp] = await Promise.all([
        loadKey("profile", null), loadKey("courses", []), loadKey("activities", []), loadKey("contacts", []),
        loadKey("templates", null), loadKey("aid-items", null), loadKey("interview-qs", []), loadKey("spaces", {}),
      ]);
      const [strash, slb] = await Promise.all([loadKey("trash", []), loadKey("last-backup", null)]);
      const fresh = (strash || []).filter((t) => Date.now() - t.at < 30 * 86400000);
      setTrash(fresh); if (fresh.length !== (strash || []).length) saveKey("trash", fresh);
      setLastBackup(slb);
      setProfile(sprof || { name: "", school: "", major: "", targetGpa: "", pronouns: "", email: "" });
      setCourses(scou); setActivities(sact); setContacts(scon); setInterviewQs(siq); setSpaces(ssp || {});
      setTemplates(stpl && stpl.length ? stpl : SEED_TEMPLATES.map((t) => ({ ...t, seeded: true })));
      if (!stpl) saveKey("templates", SEED_TEMPLATES.map((t) => ({ ...t, seeded: true })));
      setAidItems(said && said.length ? said : SEED_AID);
      if (!said) saveKey("aid-items", SEED_AID);
      setSettings(sset || { theme: "auto", notifications: false, streakFreeze: true, manilaClock: false });
      setTimers(st || {}); setFocus(sfoc || ""); setGameBest(sg || 0);
      setLoaded(true);
      setTimeout(() => setSplash("fading"), 1100);
      setTimeout(() => setSplash("hidden"), 1550);
    })();
  }, []);

  /* ---------- clocks + system theme ---------- */
  useEffect(() => {
    const id = setInterval(() => { const d = new Date(); setNow(d); const ds = todayStr(d); setToday((p) => (p === ds ? p : ds)); }, 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => setSystemDark(mq.matches);
    apply(); mq.addEventListener ? mq.addEventListener("change", apply) : mq.addListener(apply);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", apply) : mq.removeListener(apply); };
  }, []);
  useEffect(() => {
    if (!loaded) return;
    const id = setInterval(() => {
      setTimers((prev) => {
        let changed = false; const next = { ...prev };
        Object.keys(next).forEach((k) => {
          const t = next[k];
          if (t.running && t.seconds > 0) { next[k] = { ...t, seconds: t.seconds - 1 }; changed = true; }
          else if (t.running && t.seconds === 0) { next[k] = { ...t, running: false }; changed = true; }
        });
        if (changed) saveKey("timers", next);
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [loaded]);

  /* ---------- toasts ---------- */
  const pushToast = useCallback((msg, opts = {}) => {
    const id = genId();
    setToasts((p) => [...p.slice(-2), { id, msg, ...opts }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), opts.actionLabel ? 7000 : 3200);
  }, []);
  const dismissToast = (id) => setToasts((p) => p.filter((t) => t.id !== id));
  const celebrate = () => { setConfetti(true); setTimeout(() => setConfetti(false), 2400); };

  /* ---------- persistence helpers ---------- */
  const persist = {
    checklist: (v) => { setChecklist(v); saveKey("checklist", v); },
    doneMap: (v) => { setDoneMap(v); saveKey("checklist-done-v2", v); },
    orgs: (v) => { setOrgs(v); saveKey("orgs", { version: ORG_VERSION, list: v }); },
    events: (v) => { setEvents(v); saveKey("events", { version: "v1", list: v }); },
    notes: (v) => { setNotes(v); saveKey("notes", { version: NOTES_VERSION, list: v }); },
    applications: (v) => { setApplications(v); saveKey("applications", { version: APPS_VERSION, list: v }); },
    milestones: (v) => { setMilestones(v); saveKey("milestones", { version: MILESTONES_VERSION, list: v }); },
    reminders: (v) => { setReminders(v); saveKey("reminders", v); },
    folders: (v) => { setFolders(v); saveKey("note-folders", v); },
    habits: (v) => { setHabits(v); saveKey("habits", v); },
    habitCheckins: (v) => { setHabitCheckins(v); saveKey("habit-checkins", v); },
    orgCheckins: (v) => { setOrgCheckins(v); saveKey("org-checkins", v); },
    orgPhotos: (v) => { setOrgPhotos(v); saveKey("org-photos", v); },
    orgIdeas: (v) => { setOrgIdeas(v); saveKey("org-ideas", v); },
    orgActivity: (v) => { setOrgActivity(v); saveKey("org-activity", v); },
    reflections: (v) => { setReflections(v); saveKey("reflections", v); },
    inbox: (v) => { setInbox(v); saveKey("inbox", v); },
    budget: (v) => { setBudget(v); saveKey("budget", v); },
    settings: (v) => { setSettings(v); saveKey("settings", v); },
    focus: (v) => { setFocus(v); saveKey("focus", v); },
    profile: (v) => { setProfile(v); saveKey("profile", v); },
    courses: (v) => { setCourses(v); saveKey("courses", v); },
    activities: (v) => { setActivities(v); saveKey("activities", v); },
    contacts: (v) => { setContacts(v); saveKey("contacts", v); },
    templates: (v) => { setTemplates(v); saveKey("templates", v); },
    aidItems: (v) => { setAidItems(v); saveKey("aid-items", v); },
    interviewQs: (v) => { setInterviewQs(v); saveKey("interview-qs", v); },
    spaces: (v) => { setSpaces(v); saveKey("spaces", v); },
    trash: (v) => { setTrash(v); saveKey("trash", v); },
    schools: (v) => { setSchools(v); saveKey("schools", { version: SCHOOLS_VERSION, list: v }); },
    assets: (v) => { setAssets(v); saveKey("assets", { version: ASSETS_VERSION, list: v }); },
    letters: (v) => { setLetters(v); saveKey("letters", v); },
    snippets: (v) => { setSnippets(v); saveKey("snippets", v); },
    sessions: (v) => { setSessions(v); saveKey("sessions", v); },
    sharedDone: (v) => { setSharedDone(v); saveKey("shared-done", v); },
    reviews: (v) => { setReviews(v); saveKey("reviews", v); },
  };

  const logActivity = (orgId, text) => {
    if (!orgId) return;
    const next = { ...orgActivity, [orgId]: [{ id: genId(), text, at: Date.now() }, ...(orgActivity[orgId] || [])].slice(0, 30) };
    persist.orgActivity(next);
  };

  /* ---------- notifications ---------- */
  const notifyState = typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unsupported";
  const askNotify = () => { if (typeof window !== "undefined" && "Notification" in window) Notification.requestPermission(); };
  useEffect(() => {
    if (!loaded) return;
    const id = setInterval(() => {
      const nowMs = Date.now();
      reminders.forEach((r) => {
        if (!r.dueAt || r.done) return;
        const due = new Date(r.dueAt).getTime();
        const key = `${r.id}:${r.dueAt}`;
        if (due <= nowMs && !notifiedRef.current[key]) {
          notifiedRef.current[key] = true;
          if (settings.notifications && typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            try { new Notification("Scout", { body: r.text }); } catch {}
          }
          pushToast(`Reminder: ${r.text}`);
        }
      });
    }, 20000);
    return () => clearInterval(id);
  }, [loaded, reminders, settings.notifications, pushToast]);

  /* ---------- task actions ---------- */
  const addTask = ({ text, importance, recurrence, link, orgId = null }) => {
    const item = { id: genId(), text, importance, recurrence: recurrence || "none", orgId, link: link || null, date: today, order: checklist.length, subtasks: [], createdAt: Date.now() };
    persist.checklist([...checklist, item]);
    logActivity(orgId, `Added “${text}”`);
  };
  const toggleTask = (item) => {
    const slot = taskSlot(item, today);
    const currently = isDone(doneMap, item.id, slot);
    const next = withDone(doneMap, item.id, slot, !currently);
    persist.doneMap(next);
    if (!currently) {
      logActivity(item.orgId, `Finished “${item.text}”`);
      const siblings = checklist.filter((i) => i.orgId === item.orgId && taskShowsOn(i, today, doneMap));
      if (siblings.length > 1 && siblings.every((i) => isDone(next, i.id, taskSlot(i, today)))) celebrate();
    }
  };
  const toggleSub = (item, subId) => {
    const slot = taskSlot(item, today);
    persist.doneMap(withDone(doneMap, subId, slot, !isDone(doneMap, subId, slot)));
  };
  const addSub = (itemId, text) => {
    persist.checklist(checklist.map((i) => (i.id === itemId ? { ...i, subtasks: [...(i.subtasks || []), { id: genId(), text }] } : i)));
  };
  const editTask = (itemId, patch) => persist.checklist(checklist.map((i) => (i.id === itemId ? { ...i, ...patch } : i)));
  const toTrash = (kind, label, restore) => {
    const entry = { id: genId(), kind, label, at: Date.now(), payload: restore };
    persist.trash([entry, ...trash].slice(0, 300));
    return entry;
  };
  const deleteTask = (itemId) => {
    const prev = checklist; const item = checklist.find((i) => i.id === itemId);
    persist.checklist(checklist.filter((i) => i.id !== itemId));
    toTrash("Task", item?.text ?? "task", { store: "checklist", item });
    pushToast(`Deleted “${item?.text ?? "task"}” — it's in the trash`, { actionLabel: "Undo", onAction: () => persist.checklist(prev) });
  };
  const restoreFromTrash = (t) => {
    const p = t.payload || {};
    if (p.store === "checklist" && p.item) persist.checklist([...checklist, p.item]);
    if (p.store === "notes" && p.item) persist.notes([p.item, ...notes]);
    persist.trash(trash.filter((x) => x.id !== t.id));
    pushToast("Put back");
  };
  const reorderTask = (dragId, targetId) => {
    if (!targetId || dragId === targetId) return;
    const list = [...checklist];
    const from = list.findIndex((i) => i.id === dragId);
    const to = list.findIndex((i) => i.id === targetId);
    if (from < 0 || to < 0) return;
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    persist.checklist(list.map((i, idx) => ({ ...i, order: idx })));
  };
  const scheduleTask = (item, time, lengthMin) => {
    const start = `${today}T${time}:00`;
    const end = new Date(new Date(start).getTime() + lengthMin * 60000);
    const ev = { id: genId(), title: item.text, start, end: toLocalInputValue(end) + ":00", orgId: item.orgId, source: "manual", location: "", meetingLink: "", contact: "", notes: "", travelBufferMin: null, taskId: item.id };
    const prev = events;
    persist.events([...events, ev]);
    pushToast(`“${item.text}” is on your calendar at ${time}`, { actionLabel: "Undo", onAction: () => persist.events(prev) });
  };
  const taskHandlers = { onAdd: addTask, onToggle: toggleTask, onToggleSub: toggleSub, onAddSub: addSub, onEdit: editTask, onDelete: deleteTask, onSchedule: scheduleTask };

  /* ---------- everything else ---------- */
  const addEvent = (data) => { persist.events([...events, { id: genId(), ...data }]); logActivity(data.orgId, `Scheduled “${data.title}”`); };
  const deleteEvent = (id) => { const prev = events; persist.events(events.filter((e) => e.id !== id)); pushToast("Event deleted", { actionLabel: "Undo", onAction: () => persist.events(prev) }); };
  const importIcs = (list) => {
    const existing = new Set(events.map((e) => e.uid).filter(Boolean));
    const fresh = list.filter((e) => !e.uid || !existing.has(e.uid));
    persist.events([...events, ...fresh]);
    pushToast(`Imported ${fresh.length} event${fresh.length === 1 ? "" : "s"}`);
  };
  const addReminder = (data) => persist.reminders([...reminders, { id: genId(), done: false, ...data }]);
  const toggleReminder = (r) => {
    const rec = r.recurrence || "none";
    if (rec !== "none" && r.dueAt && !r.done) {
      const nextDue = bumpRecurring(r.dueAt, rec);
      persist.reminders(reminders.map((x) => (x.id === r.id ? { ...x, dueAt: nextDue } : x)));
      pushToast(`Done — next one ${new Date(nextDue).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}`);
      return;
    }
    persist.reminders(reminders.map((x) => (x.id === r.id ? { ...x, done: !x.done } : x)));
  };
  const snoozeReminder = (r, mins) => {
    const base = new Date(r.dueAt || Date.now());
    const next = new Date(Math.max(base.getTime(), Date.now()) + mins * 60000);
    persist.reminders(reminders.map((x) => (x.id === r.id ? { ...x, dueAt: toLocalInputValue(next) } : x)));
  };
  const deleteReminder = (id) => { const prev = reminders; persist.reminders(reminders.filter((r) => r.id !== id)); pushToast("Reminder deleted", { actionLabel: "Undo", onAction: () => persist.reminders(prev) }); };
  const addNote = (data) => {
    const orgId = notesOrgView === "__general" ? null : notesOrgView;
    persist.notes([{ id: genId(), pinned: false, updatedAt: Date.now(), checklistItems: [], linkedApplicationId: null, orgId, ...data }, ...notes]);
  };
  const editNote = (id, patch) => {
    const next = notes.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n));
    persist.notes(next);
    const n = next.find((x) => x.id === id);
    if (n && n.suppId && patch.text !== undefined) {
      const w = wordCount(patch.text);
      persist.schools(schools.map((sc) => (sc.id === n.schoolId
        ? { ...sc, supplements: (sc.supplements || []).map((sp) => (sp.id === n.suppId ? { ...sp, words: w } : sp)) } : sc)));
    }
  };
  const deleteNote = (id) => {
    const prev = notes; const item = notes.find((n) => n.id === id);
    persist.notes(notes.filter((n) => n.id !== id));
    toTrash("Note", item?.title ?? "note", { store: "notes", item });
    pushToast("Note moved to the trash", { actionLabel: "Undo", onAction: () => persist.notes(prev) });
  };
  const addApplication = (data, autoRemind) => {
    const app = { ...mkApp(data) };
    persist.applications([...applications, app]);
    if (autoRemind && data.deadline) {
      const wk = new Date(`${data.deadline}T09:00:00`); wk.setDate(wk.getDate() - 7);
      const dayBefore = new Date(`${data.deadline}T09:00:00`); dayBefore.setDate(dayBefore.getDate() - 1);
      persist.reminders([...reminders,
        { id: genId(), text: `${data.name} closes in a week`, dueAt: toLocalInputValue(wk), orgId: null, recurrence: "none", done: false, sourceApplicationId: app.id },
        { id: genId(), text: `${data.name} is due tomorrow`, dueAt: toLocalInputValue(dayBefore), orgId: null, recurrence: "none", done: false, sourceApplicationId: app.id },
      ]);
    }
  };
  const setAppStatus = (id, status) => {
    persist.applications(applications.map((a) => (a.id === id ? { ...a, status } : a)));
    if (status === "accepted") { celebrate(); pushToast("That's huge. Congratulations."); }
  };
  const deleteApplication = (id) => { const prev = applications; persist.applications(applications.filter((a) => a.id !== id)); pushToast("Application removed", { actionLabel: "Undo", onAction: () => persist.applications(prev) }); };
  const openAppNote = (app) => {
    if (app.linkedNoteId && notes.find((n) => n.id === app.linkedNoteId)) { setTab("notes"); setNotesOrgView("__general"); return; }
    const note = { id: genId(), title: `${app.name} — notes`, text: app.notes || "", tags: [app.type], pinned: false, updatedAt: Date.now(), checklistItems: [], linkedApplicationId: app.id, orgId: null, folderId: null };
    persist.notes([note, ...notes]);
    persist.applications(applications.map((a) => (a.id === app.id ? { ...a, linkedNoteId: note.id } : a)));
    setTab("notes"); setNotesOrgView("__general");
  };
  const toggleMilestone = (id) => {
    const next = milestones.map((m) => (m.id === id ? { ...m, done: !m.done } : m));
    persist.milestones(next);
    const target = next.find((m) => m.id === id);
    if (target?.done) {
      const phaseItems = next.filter((m) => m.phase === target.phase);
      if (phaseItems.every((m) => m.done)) { celebrate(); pushToast(`Whole phase done: ${target.phase}`); }
    }
  };
  const toggleHabitDay = (id, ds) => {
    const list = habitCheckins[id] || [];
    persist.habitCheckins({ ...habitCheckins, [id]: list.includes(ds) ? list.filter((d) => d !== ds) : [...list, ds] });
  };
  const checkinOrg = (orgId) => {
    const list = orgCheckins[orgId] || [];
    if (list.includes(today)) { pushToast("Already checked in today"); return; }
    persist.orgCheckins({ ...orgCheckins, [orgId]: [...list, today] });
    pushToast("Checked in");
  };
  const saveReflection = (data) => {
    const existing = reflections.find((r) => r.date === today);
    persist.reflections(existing ? reflections.map((r) => (r.date === today ? { ...r, ...data } : r)) : [...reflections, { id: genId(), date: today, ...data }]);
    setReflectSaved(true); setTimeout(() => setReflectSaved(false), 2000);
  };
  const captureToInbox = (e) => {
    e.preventDefault(); if (!quickCapture.trim()) return;
    persist.inbox([{ id: genId(), text: quickCapture.trim(), at: Date.now() }, ...inbox]);
    setQuickCapture(""); pushToast("Caught it — sort it out later");
  };
  const convertInbox = (item, kind) => {
    if (kind === "task") addTask({ text: item.text, importance: 2, recurrence: "none" });
    if (kind === "note") persist.notes([{ id: genId(), title: item.text.slice(0, 40), text: item.text, tags: [], pinned: false, updatedAt: Date.now(), checklistItems: [], linkedApplicationId: null, orgId: null, folderId: null }, ...notes]);
    if (kind === "reminder") { const p = parseReminderPhrase(item.text); addReminder({ text: p.text || item.text, dueAt: p.dueAt || null, orgId: null, recurrence: p.recurrence }); }
    persist.inbox(inbox.filter((i) => i.id !== item.id));
  };
  const exportData = () => {
    exportEverything();
    const t = Date.now(); setLastBackup(t); saveKey("last-backup", t); setDismissedBackup(true);
    pushToast("Backup saved to your downloads");
  };
  const legacyExport = () => {
    const dump = { exportedAt: new Date().toISOString(), schema: SCHEMA_VERSION, orgs, checklist, doneMap, events, reminders, notes, folders, applications, milestones, habits, habitCheckins, orgCheckins, orgPhotos, orgIdeas, orgActivity, reflections, inbox, budget, settings, focus, schools, assets, letters, snippets, sessions, sharedDone, reviews };
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `scout-backup-${today}.json`; a.click(); URL.revokeObjectURL(url);
    pushToast("Backup saved to your downloads");
  };
  const importData = async (dumps) => {
    const list = Array.isArray(dumps) ? dumps : [dumps];
    let keys = 0;
    for (const d of list) keys += await importEverything(d);
    if (!keys) { pushToast("Nothing readable in those files", { tone: "bad" }); return; }
    setSettingsOpen(false);
    pushToast(`Restored ${keys} sets of data — reloading`);
    setTimeout(() => { if (typeof window !== "undefined" && window.location) window.location.reload(); }, 900);
  };

  const tidyFinished = (stale) => {
    const ids = new Set(stale.map((i) => i.id));
    const prev = checklist;
    persist.checklist(checklist.filter((i) => !ids.has(i.id)));
    pushToast(`Cleared ${stale.length} finished task${stale.length === 1 ? "" : "s"}`, { actionLabel: "Undo", onAction: () => persist.checklist(prev) });
  };

  /* Catch anything that came due while the app was closed. */
  useEffect(() => {
    if (!loaded) return;
    const overdue = reminders.filter((r) => !r.done && r.dueAt && new Date(r.dueAt) < new Date() && new Date(r.dueAt) > new Date(Date.now() - 14 * 86400000));
    if (overdue.length) setMissed(overdue);
  }, [loaded]);

  useEffect(() => {
    const id = setInterval(() => setTod(todOf(new Date())), 60000);
    return () => clearInterval(id);
  }, []);

  /* ---------- transfer + apply handlers ---------- */
  const updateSchool = (id, patch) => {
    const next = schools.map((x) => (x.id === id ? { ...x, ...patch } : x));
    persist.schools(next);
    if (patch.status === "submitted") { celebrate(); pushToast("Sent. That's one out the door."); }
    if (patch.status === "accepted") { celebrate(); pushToast("You got in. Read that again."); }
  };
  const deleteSchool = (id) => { const prev = schools; persist.schools(schools.filter((x) => x.id !== id)); pushToast("School removed", { actionLabel: "Undo", onAction: () => persist.schools(prev) }); };
  const toggleSupp = (schoolId, suppId) => persist.schools(schools.map((x) => (x.id === schoolId ? { ...x, supplements: x.supplements.map((sp) => (sp.id === suppId ? { ...sp, done: !sp.done } : sp)) } : x)));
  const addSupp = (schoolId, text) => persist.schools(schools.map((x) => (x.id === schoolId ? { ...x, supplements: [...(x.supplements || []), { id: genId(), text, done: false }] } : x)));
  const toggleShared = (id) => persist.sharedDone({ ...sharedDone, [id]: !sharedDone[id] });
  const writeSupplement = (school, supp) => {
    let note = notes.find((n) => n.suppId === supp.id);
    if (!note) {
      note = { id: genId(), title: `${school.name} — ${supp.text}`, text: "", tags: ["essay", "supplement"], pinned: false,
        updatedAt: Date.now(), checklistItems: [], linkedApplicationId: null, orgId: null, folderId: null,
        kind: "essay", wordTarget: supp.target || 250, paper: "essay", suppId: supp.id, schoolId: school.id, revisions: [] };
      persist.notes([note, ...notes]);
    }
    setWorkshopId(note.id);
  };
  const setAssetStatus = (id, status) => {
    persist.assets(assets.map((a) => (a.id === id ? { ...a, status } : a)));
    if (status === "ready") {
      const n = schools.filter((sc) => (sc.requires || []).includes(id)).length;
      celebrate(); pushToast(n > 0 ? `Ready — that clears the way for ${n} application${n === 1 ? "" : "s"}` : "Ready to send");
    }
  };
  const setAssetNote = (id, notes) => persist.assets(assets.map((a) => (a.id === id ? { ...a, notes } : a)));
  const openAssetEssay = (asset) => {
    let note = notes.find((n) => n.assetId === asset.id);
    if (!note) {
      note = { id: genId(), title: asset.name, text: "", tags: ["essay"], pinned: false, updatedAt: Date.now(), checklistItems: [], linkedApplicationId: null, orgId: null, folderId: null, kind: "essay", wordTarget: asset.target || 650, paper: "essay", assetId: asset.id };
      persist.notes([note, ...notes]);
    }
    setWorkshopId(note.id);
  };
  const addSnippet = (text, label) => { persist.snippets([{ id: genId(), text, label: label || "Blurb", at: Date.now() }, ...snippets]); pushToast("Saved as a reusable blurb"); };
  const logSession = (session) => {
    persist.sessions([session, ...sessions].slice(0, 500));
    pushToast(`${session.minutes} minutes logged${session.taskText !== "Unassigned" ? ` on “${session.taskText}”` : ""}`);
  };
  const newEssay = () => {
    const note = { id: genId(), title: "New essay", text: "", tags: ["essay"], pinned: false, updatedAt: Date.now(), checklistItems: [], linkedApplicationId: null, orgId: notesOrgView === "__general" ? null : notesOrgView, folderId: null, kind: "essay", wordTarget: 650, paper: "essay" };
    persist.notes([note, ...notes]); setWorkshopId(note.id);
  };

  /* ---------- campaign + spaces handlers ---------- */
  const addActivity = (data) => persist.activities([{ id: genId(), category: "Extracurricular", role: "", org: "", ucDescription: "", caDescription: "", ucSelected: false, caSelected: false, ...data }, ...activities]);
  const updateActivity = (id, patch) => persist.activities(activities.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  const deleteActivity = (id) => { const prev = activities; persist.activities(activities.filter((a) => a.id !== id)); pushToast("Removed from the bank", { actionLabel: "Undo", onAction: () => persist.activities(prev) }); };
  const addCourse = (c) => persist.courses([...courses, { id: genId(), ...c }]);
  const updateCourse = (id, patch) => persist.courses(courses.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const deleteCourse = (id) => { const prev = courses; persist.courses(courses.filter((c) => c.id !== id)); pushToast("Course removed", { actionLabel: "Undo", onAction: () => persist.courses(prev) }); };
  const draftEmailTo = (c) => {
    setTplPrefill({ templateId: c.kind === "Professor" ? "tpl_rec" : "tpl_cold", fills: { name: c.name.split(" ")[0], company: c.org || "", school: profile.school || "" } });
    setCampaignView("templates");
  };
  const spaceOf = (orgId) => spaces[orgId] || { logo: "", links: [], vault: [], activities: [], hours: [], plans: [] };
  const setSpace = (orgId, patch) => persist.spaces({ ...spaces, [orgId]: { ...spaceOf(orgId), ...patch } });
  const spaceList = (orgId, key, updater) => setSpace(orgId, { [key]: updater(spaceOf(orgId)[key] || []) });

  /* ---------- derived ---------- */
  const orgById = useCallback((id) => orgs.find((o) => o.id === id) || null, [orgs]);
  const activeOrgs = orgs.filter((o) => !o.archived);
  const archivedOrgs = orgs.filter((o) => o.archived);
  const sortByImportance = (a, b) => (b.importance - a.importance) || ((a.order ?? 0) - (b.order ?? 0));

  const todaysTasks = useMemo(() => checklist.filter((i) => taskShowsOn(i, today, doneMap)).sort(sortByImportance), [checklist, today, doneMap]);
  const openTasks = todaysTasks.filter((i) => !taskIsDone(i, doneMap, today));
  const doneTasks = todaysTasks.filter((i) => taskIsDone(i, doneMap, today));
  const staleFinished = useMemo(() => checklist.filter((i) => {
    const rec = i.recurrence || (i.recurring ? "daily" : "none");
    return rec === "none" && i.date && i.date < todayStr(addDays(new Date(), -14)) && isDone(doneMap, i.id, i.date);
  }), [checklist, doneMap, today]);

  const upcomingEvents = useMemo(() => events.filter((e) => new Date(e.end) >= now).sort((a, b) => new Date(a.start) - new Date(b.start)), [events, now]);
  const nextEvent = upcomingEvents[0];
  const todayEvents = events.filter((e) => sameDay(new Date(e.start), now)).sort((a, b) => new Date(a.start) - new Date(b.start));
  const overdueCount = reminders.filter((r) => !r.done && reminderUrgency(r.dueAt, r.done) === "overdue").length;
  const closingSoon = useMemo(() => applications
    .filter((a) => a.deadline && !["accepted", "rejected"].includes(a.status) && daysUntil(a.deadline) >= 0 && daysUntil(a.deadline) <= 45)
    .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline)), [applications, today]);

  const weekStart = todayStr(addDays(new Date(), -6));
  const weekTaskCount = useMemo(() => Object.values(doneMap).reduce((sum, days) => sum + Object.keys(days).filter((d) => d >= weekStart && d <= today).length, 0), [doneMap, today]);
  const weekMilestones = milestones.filter((m) => m.done).length;
  const weekReminders = reminders.filter((r) => r.done).length;
  const activeStreak = useMemo(() => streakWithFreeze((ds) => checklist.some((i) => taskAppliesOn(i, ds) && isDone(doneMap, i.id, taskSlot(i, ds))), settings.streakFreeze), [checklist, doneMap, settings.streakFreeze]);
  const topMood = useMemo(() => {
    const week = reflections.filter((r) => r.date >= weekStart);
    if (!week.length) return null;
    const counts = {}; week.forEach((r) => { counts[r.mood] = (counts[r.mood] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }, [reflections, weekStart]);

  const hour = now.getHours();
  const who = (profile.name || "").trim().split(" ")[0];
  const greeting = (hour < 5 ? "Still up" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : hour < 22 ? "Good evening" : "Winding down") + (who ? `, ${who}` : "") + (hour < 5 ? "?" : "");
  const mascotState = confetti ? "excited" : overdueCount > 0 ? "neutral" : hour >= 22 || hour < 5 ? "sleepy" : openTasks.length === 0 && todaysTasks.length > 0 ? "happy" : "neutral";

  /* ---------- search ---------- */
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const actions = [
      { type: "go", label: "Open today", hint: "", run: () => setTab("today") },
      { type: "go", label: "Open calendar", hint: "", run: () => setTab("calendar") },
      { type: "go", label: "Open goals", hint: "", run: () => setTab("goals") },
      { type: "go", label: "Open notes", hint: "", run: () => setTab("notes") },
      { type: "go", label: "Open reflect", hint: "", run: () => setTab("reflect") },
      { type: "do", label: dark ? "Switch to day mode" : "Switch to night mode", run: () => persist.settings({ ...settings, theme: dark ? "light" : "dark" }) },
      { type: "do", label: "Save a backup", run: exportData },
      { type: "do", label: "Enter the focus room", run: () => setFocusRoom(true) },
      { type: "do", label: "Close out the week", run: () => setReviewOpen(true) },
      { type: "go", label: "Open transfer applications", run: () => { setTab("apply"); setApplyView("transfer"); setApplySub("schools"); } },
      { type: "do", label: "Open settings", run: () => setSettingsOpen(true) },
    ];
    if (q.length < 2) return actions.slice(0, 6);
    const hit = (s) => (s || "").toLowerCase().includes(q);
    return [
      ...actions.filter((a) => hit(a.label)),
      ...checklist.filter((i) => hit(i.text)).slice(0, 6).map((i) => ({ type: "task", label: i.text, hint: orgById(i.orgId)?.name || "", run: () => { setTab("today"); if (i.orgId) setActiveOrg(i.orgId); } })),
      ...notes.filter((n) => hit(n.title) || hit(n.text) || (n.tags || []).some(hit)).slice(0, 6).map((n) => ({ type: "note", label: n.title, hint: (n.tags || [])[0] ? `#${n.tags[0]}` : "", run: () => { setTab("notes"); setNotesOrgView(n.orgId || "__general"); setNotesFolder(n.folderId || null); } })),
      ...reminders.filter((r) => hit(r.text)).slice(0, 5).map((r) => ({ type: "reminder", label: r.text, hint: r.dueAt ? fmtDayShort(r.dueAt) : "", run: () => { setTab("goals"); setGoalView("remind"); } })),
      ...applications.filter((a) => hit(a.name) || hit(a.role) || a.tags.some(hit)).slice(0, 6).map((a) => ({ type: a.type, label: a.name, hint: a.deadline ? `${daysUntil(a.deadline)}d` : "", run: () => { setTab("goals"); setGoalView("deadlines"); } })),
      ...events.filter((e) => hit(e.title)).slice(0, 5).map((e) => ({ type: "event", label: e.title, hint: fmtDayShort(e.start), run: () => { setTab("calendar"); setCalDate(new Date(e.start)); setCalView("day"); } })),
      ...milestones.filter((m) => hit(m.text)).slice(0, 5).map((m) => ({ type: "step", label: m.text, hint: m.phase.split(" ")[0], run: () => { setTab("apply"); setApplyView(null); } })),
      ...schools.filter((sc) => hit(sc.name)).slice(0, 6).map((sc) => ({ type: "school", label: sc.name, hint: PORTAL_META[sc.portal].name.split(" ")[0], run: () => { setTab("apply"); setApplyView("transfer"); setApplySub("schools"); } })),
      ...assets.filter((a) => hit(a.name)).slice(0, 4).map((a) => ({ type: "needed", label: a.name, hint: ASSET_STATUS[a.status].label, run: () => { setTab("apply"); setApplyView("transfer"); setApplySub("assets"); } })),
      ...letters.filter((l) => hit(l.name)).slice(0, 3).map((l) => ({ type: "letter", label: l.name, hint: LETTER_STATUS[l.status].label, run: () => { setTab("apply"); setApplyView("transfer"); setApplySub("letters"); } })),
    ];
  }, [query, checklist, notes, reminders, applications, events, milestones, schools, assets, letters, dark, settings, orgById]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPaletteOpen((p) => !p); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const notesOrgs = [...activeOrgs.map((o) => ({ id: o.id, name: o.name, color: o.color })), { id: "__general", name: "General", color: MUTED }];
  const notesForOrg = (id) => notes.filter((n) => (id === "__general" ? !n.orgId : n.orgId === id));
  const visibleNotes = notesOrgView
    ? notesForOrg(notesOrgView).filter((n) => (notesFolder ? n.folderId === notesFolder : true)).sort((a, b) => (b.pinned - a.pinned) || (b.updatedAt - a.updatedAt))
    : [];
  const currentReflection = reflections.find((r) => r.date === today);
  const weekSessions = sessions.filter((x) => x.at >= Date.now() - 7 * 86400000);
  const weekHours = Math.round(weekSessions.reduce((a, x) => a + x.minutes, 0) / 6) / 10;
  const schoolsByPortal = (pid) => schools.filter((sc) => sc.portal === pid);
  const transferSent = schools.filter((sc) => ["submitted", "accepted", "waitlisted", "denied"].includes(sc.status)).length;
  const assetsReady = assets.filter((a) => a.status === "ready").length;
  const scholarships = applications.filter((a) => a.type === "scholarship");
  const internships = applications.filter((a) => a.type === "internship");
  const doneOf = (list) => list.filter((a) => ["applied", "accepted", "waitlisted", "rejected"].includes(a.status)).length;
  const nextTransferDeadline = schools.map((sc) => (sc.deadline ? daysUntil(sc.deadline) : null)).filter((d) => d !== null && d >= 0).sort((a, b) => a - b)[0];
  const workshopNote = notes.find((n) => n.id === workshopId) || null;
  const backlinksFor = (note) => notes.filter((n) => n.id !== note.id && linkTitles(n.text).some((t) => t.toLowerCase() === note.title.toLowerCase()));
  const unfinishedThisWeek = checklist.filter((i) => {
    const rec = i.recurrence || (i.recurring ? "daily" : "none");
    return rec === "none" && i.date && i.date <= today && i.date >= weekStart && !isDone(doneMap, i.id, i.date);
  });
  const gpaInfo = computeGpa(courses);
  const ucPicks = activities.filter((a) => a.ucSelected).length;
  const caPicks = activities.filter((a) => a.caSelected).length;
  const staleContacts = contacts.filter((c) => c.lastContact && daysUntil(c.lastContact) < -21).length;
  const aidOpen = aidItems.filter((a) => a.status !== "done" && a.status !== "submitted").length;
  const spaceObj = activeSpace === "__notes" ? { id: "__notes", name: "Everything else", color: MUTED } : activeSpace ? orgById(activeSpace) : null;
  const hoursThisWeek = (orgId) => (spaceOf(orgId).hours || []).filter((h) => h.weekStart === todayStr(startOfWeek(new Date()))).reduce((s2, h) => s2 + Number(h.hours || 0), 0);
  const manilaTime = now.toLocaleTimeString([], { timeZone: "Asia/Manila", hour: "2-digit", minute: "2-digit", hour12: false });
  const isSunday = now.getDay() === 0;
  const reviewedToday = reviews.some((r) => r.week === today);
  const activeOrgObj = activeOrg ? orgById(activeOrg) : null;

  const hh = pad2(now.getHours()), mm = pad2(now.getMinutes()), ss = pad2(now.getSeconds());

  if (!loaded) return <div style={{ minHeight: "100vh", background: BASE_GRADIENT }} className="scout-root" />;

  return (
    <div className="scout-root" data-theme={dark ? "dark" : "light"} data-palette={settings.palette || "golden"} data-tod={tod} style={{ minHeight: "100vh", background: BASE_GRADIENT, color: TEXT, fontFamily: "'Manrope', system-ui, sans-serif" }} data-shell="1">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Manrope:wght@400;500;600;700;800&display=swap');`}{THEME_CSS}{`
        .font-display { font-family: 'Space Mono', ui-monospace, monospace; letter-spacing: -0.02em; }
        .scout-root * { -webkit-tap-highlight-color: transparent; }
        .scout-root ::selection { background: var(--accent-soft); }
        button:focus-visible, a:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible, [role="button"]:focus-visible {
          outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 6px;
        }
        input:focus, textarea:focus, select:focus { border-color: var(--accent) !important; }
        .icon-btn { display: inline-flex; align-items: center; justify-content: center; padding: 4px; border-radius: 8px; transition: background 0.15s, transform 0.15s; }
        .icon-btn:hover { background: var(--accent-soft); }
        .icon-btn:active { transform: scale(0.92); }
        .lift { transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s; }
        .lift:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
        .task-row .row-actions { opacity: 0; transition: opacity 0.15s; }
        .task-row:hover .row-actions, .task-row:focus-within .row-actions { opacity: 1; }
        @media (hover: none) { .task-row .row-actions { opacity: 1; } }
        .drag-handle { cursor: grab; opacity: 0; transition: opacity 0.15s; }
        .task-row:hover .drag-handle { opacity: 1; }
        .segmented { display: flex; gap: 2px; padding: 3px; border-radius: 12px; }
        .segmented-btn { flex: 1; padding: 6px 10px; border-radius: 9px; font-size: 12px; font-weight: 700; transition: all 0.18s; }
        .chip { padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; transition: all 0.15s; white-space: nowrap; }
        .hex-tile { transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1); }
        .hex-tile:hover { transform: scale(1.06) rotate(-1.5deg); }
        .board-scroll { overflow-x: auto; scrollbar-width: thin; }
        .nav-pill { position: absolute; inset: 2px 10px; border-radius: 12px; animation: pillIn 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .tab-panel { animation: panelIn 0.28s cubic-bezier(0.22,1,0.36,1); }
        .flip-digit { animation: flipIn 0.4s cubic-bezier(0.34,1.56,0.64,1); }
        .mascot-pop { animation: popIn 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .pop { display: inline-flex; animation: popIn 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .splash-title { animation: panelIn 0.6s cubic-bezier(0.22,1,0.36,1); }
        .ridge-fill { transition: width 0.8s cubic-bezier(0.22,1,0.36,1); }
        .twinkle { animation: twinkle 3s ease-in-out infinite; }
        .toast-host { position: fixed; left: 0; right: 0; bottom: 84px; z-index: 65; display: flex; flex-direction: column; align-items: center; gap: 8px; pointer-events: none; padding: 0 16px; }
        .toast { pointer-events: auto; display: flex; align-items: center; gap: 10px; border-radius: 14px; padding: 10px 12px; max-width: 440px; width: 100%; animation: toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .sheet-scrim { position: fixed; inset: 0; z-index: 66; display: flex; align-items: flex-end; justify-content: center; animation: fadeIn 0.2s; backdrop-filter: blur(3px); }
        .sheet { width: 100%; max-width: 520px; border-radius: 24px 24px 0 0; padding-top: 10px; animation: sheetUp 0.3s cubic-bezier(0.22,1,0.36,1); }
        .sheet-grip { width: 38px; height: 4px; border-radius: 99px; margin: 0 auto 12px; }
        .palette-scrim { position: fixed; inset: 0; z-index: 68; display: flex; align-items: flex-start; justify-content: center; padding: 12vh 16px 0; animation: fadeIn 0.15s; backdrop-filter: blur(4px); }
        .palette { width: 100%; max-width: 520px; border-radius: 18px; overflow: hidden; animation: sheetDown 0.22s cubic-bezier(0.22,1,0.36,1); }
        .walk-track { position: relative; height: 44px; overflow: hidden; }
        .walk-mover { position: absolute; bottom: 0; animation: walkAcross 26s linear infinite; }
        .walk-flip { animation: walkFlip 26s steps(1) infinite; }
        .walk-bob { animation: walkBob 0.5s ease-in-out infinite; }
        @keyframes walkAcross { 0% { left: -8%; } 50% { left: 92%; } 100% { left: -8%; } }
        @keyframes walkFlip { 0%, 49.9% { transform: scaleX(1); } 50%, 100% { transform: scaleX(-1); } }
        @keyframes walkBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes popIn { 0% { transform: scale(0.7); opacity: 0.4; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes pillIn { 0% { transform: scale(0.6); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes panelIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: none; } }
        @keyframes flipIn { 0% { transform: rotateX(-70deg); opacity: 0.3; } 100% { transform: none; opacity: 1; } }
        @keyframes toastIn { 0% { transform: translateY(16px); opacity: 0; } 100% { transform: none; opacity: 1; } }
        @keyframes sheetUp { 0% { transform: translateY(100%); } 100% { transform: none; } }
        @keyframes sheetDown { 0% { transform: translateY(-14px); opacity: 0; } 100% { transform: none; opacity: 1; } }
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes confettiFall { 0% { transform: translateY(0) rotate(0); opacity: 1; } 100% { transform: translateY(105vh) rotate(680deg); opacity: 0; } }
        @keyframes breatheCircle { 0%, 100% { transform: scale(0.62); } 40% { transform: scale(1); } 60% { transform: scale(1); } }
        @keyframes twinkle { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.9; } }
        .focus-room { position: fixed; inset: 0; z-index: 80; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 26px; padding: 24px;
          background: linear-gradient(180deg, #2A1F35 0%, #1C1520 45%, #100C12 100%); animation: fadeIn 0.35s ease; overflow-y: auto; }
        .focus-stars { position: absolute; inset: 0; pointer-events: none; }
        .focus-stars span { position: absolute; width: 2px; height: 2px; border-radius: 50%; background: #F7EAD2; opacity: 0.4; animation: twinkle 4s ease-in-out infinite; }
        .focus-picker { position: absolute; top: 96px; left: 16px; right: 16px; max-height: 42vh; overflow-y: auto; border-radius: 16px;
          background: rgba(30,22,38,0.97); border: 1px solid rgba(247,234,210,0.16); padding: 6px 0; backdrop-filter: blur(8px); }
        .workshop { position: fixed; inset: 0; z-index: 78; display: flex; flex-direction: column; background: var(--card); animation: fadeIn 0.25s ease; }
        .workshop-bar { display: flex; align-items: center; gap: 10px; padding: 10px 14px; backdrop-filter: blur(12px); }
        .workshop-body { flex: 1; overflow-y: auto; display: flex; justify-content: center; }
        .workshop-area { width: 100%; max-width: 660px; padding: 32px 22px 80px; background: transparent; border: 0; outline: none; resize: none;
          font-family: 'Manrope', Georgia, serif; font-size: 17px; line-height: 1.85; color: var(--text); }
        .workshop-foot { display: flex; align-items: center; gap: 10px; padding: 10px 14px; backdrop-filter: blur(12px); }
        .workshop-drawer { position: absolute; left: 0; right: 0; bottom: 52px; max-height: 46vh; overflow-y: auto; border-radius: 18px 18px 0 0; animation: sheetUp 0.25s cubic-bezier(0.22,1,0.36,1); }
        .review-room { position: fixed; inset: 0; z-index: 76; display: flex; align-items: center; justify-content: center; padding: 16px;
          background: var(--scrim); backdrop-filter: blur(5px); animation: fadeIn 0.25s; }
        .review-card { width: 100%; max-width: 460px; border-radius: 24px; animation: sheetDown 0.3s cubic-bezier(0.22,1,0.36,1); }
        .note-board { column-count: 2; column-gap: 12px; }
        @media (min-width: 640px) { .note-board { column-count: 3; } }
        .board-note { border-radius: 4px; display: inline-block; width: 100%; transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s; position: relative; }
        .board-note:hover { transform: rotate(0deg) translateY(-3px) !important; box-shadow: var(--shadow-lg); z-index: 2; }
        .note-tape { position: absolute; top: -9px; left: 50%; width: 58px; height: 20px; transform: translateX(-50%) rotate(-3deg);
          background: rgba(232,169,59,0.42); border-left: 1px dashed rgba(255,255,255,0.35); border-right: 1px dashed rgba(255,255,255,0.35); }
        .wiki-link { font-weight: 700; text-decoration: underline; text-underline-offset: 2px; }
        .transfer-world, .world-header { animation: panelIn 0.32s cubic-bezier(0.22,1,0.36,1); }
        .subnav { overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
        .subnav::-webkit-scrollbar { display: none; }
        .subnav-btn { display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; white-space: nowrap; flex-shrink: 0; transition: all 0.16s; }
        .space-tile { min-height: 150px; }
        @keyframes floatBlob { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(14px,-18px); } }
        .aurora { position: fixed; inset: -18%; pointer-events: none; z-index: 0; overflow: hidden; filter: blur(58px); opacity: 0.85; }
        .aurora-blob { position: absolute; border-radius: 50%; mix-blend-mode: normal; }
        .aurora .b1 { width: 46vmax; height: 46vmax; left: -12%; top: -8%; background: var(--a1); opacity: 0.30; animation: drift1 34s ease-in-out infinite; }
        .aurora .b2 { width: 40vmax; height: 40vmax; right: -14%; top: 18%; background: var(--a2); opacity: 0.24; animation: drift2 41s ease-in-out infinite; }
        .aurora .b3 { width: 52vmax; height: 52vmax; left: 18%; bottom: -22%; background: var(--a3); opacity: 0.22; animation: drift3 47s ease-in-out infinite; }
        .aurora .b4 { width: 30vmax; height: 30vmax; right: 12%; bottom: 6%; background: var(--accent); opacity: 0.18; animation: drift1 38s ease-in-out infinite reverse; }
        .scout-root[data-theme="dark"] .aurora { opacity: 0.55; }
        .aurora-grain { position: absolute; inset: 0; opacity: 0.05;
          background-image: radial-gradient(currentColor 0.5px, transparent 0.5px); background-size: 4px 4px; color: var(--text); }
        @keyframes drift1 { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(7vmax,5vmax) scale(1.12); } 66% { transform: translate(-4vmax,8vmax) scale(0.94); } }
        @keyframes drift2 { 0%,100% { transform: translate(0,0) scale(1); } 40% { transform: translate(-8vmax,6vmax) scale(1.09); } 75% { transform: translate(5vmax,-5vmax) scale(0.92); } }
        @keyframes drift3 { 0%,100% { transform: translate(0,0) scale(1); } 45% { transform: translate(6vmax,-7vmax) scale(1.07); } 80% { transform: translate(-7vmax,-3vmax) scale(0.96); } }
        .stagger-item { animation: riseIn 0.42s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes riseIn { 0% { opacity: 0; transform: translateY(12px); } 100% { opacity: 1; transform: none; } }
        .pulse-dot { animation: pulseRing 2.6s ease-in-out infinite; transform-origin: center; }
        @keyframes pulseRing { 0%,100% { opacity: 0.16; r: 9; } 50% { opacity: 0.34; r: 13; } }
        .scout-main, .scout-header, .scout-nav, .toast-host { position: relative; z-index: 1; }
        .scout-header, .scout-nav { z-index: 20; }
        button, a, [role="button"] { transition: transform 0.14s cubic-bezier(0.34,1.56,0.64,1); }
        button:active, [role="button"]:active { transform: scale(0.975); }
        .lift:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
        .sheen { position: relative; overflow: hidden; }
        .sheen::after { content: ""; position: absolute; inset: 0; transform: translateX(-100%);
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent); animation: sheenSweep 3.4s ease-in-out infinite; }
        @keyframes sheenSweep { 0%,60% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .scout-root[data-shell] { padding-bottom: 90px; }
        @media (min-width: 900px) {
          .scout-root[data-shell] { padding-bottom: 32px; }
          .scout-nav { top: 0; bottom: 0; right: auto; width: 196px; border-top: 0 !important; border-right: 1px solid var(--border); }
          .scout-navinner { flex-direction: column; max-width: none; padding-top: 78px; gap: 2px; }
          .scout-navinner > button { flex: 0 0 auto; flex-direction: row; justify-content: flex-start; gap: 12px; padding: 11px 18px; }
          .scout-navinner > button > span:last-child { font-size: 13px; }
          .scout-nav .nav-pill { inset: 3px 8px; }
          .scout-header { padding-left: 196px; }
          .scout-main { padding-left: 220px; padding-right: 24px; max-width: 1180px; margin-left: 0; }
          .note-board { column-count: 3; }
          .toast-host { bottom: 24px; padding-left: 220px; }
        }
        @media (min-width: 1240px) { .note-board { column-count: 4; } }
        @media (prefers-reduced-motion: reduce) {
          .scout-root *, .scout-root *::before, .scout-root *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
        }
      `}</style>

      <Aurora />
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", background: TAB_TINTS[tab] || "transparent", transition: "background 0.6s" }} />
      <div aria-hidden="true" style={{ position: "fixed", top: "6%", left: "-12%", width: 260, height: 260, borderRadius: "50%", background: "var(--glow-a)", filter: "blur(52px)", pointerEvents: "none", animation: "floatBlob 15s ease-in-out infinite" }} />
      <div aria-hidden="true" style={{ position: "fixed", bottom: "12%", right: "-14%", width: 300, height: 300, borderRadius: "50%", background: "var(--glow-c)", filter: "blur(60px)", pointerEvents: "none", animation: "floatBlob 19s ease-in-out infinite reverse" }} />

      <Splash phase={splash} onDismiss={() => setSplash("hidden")} />
      <Confetti active={confetti} />
      <Toasts items={toasts} onDismiss={dismissToast} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} results={results} query={query} setQuery={setQuery}
        onPick={(r) => { r.run(); setPaletteOpen(false); setQuery(""); }} />
      <FocusRoom open={focusRoom} onClose={() => setFocusRoom(false)} tasks={openTasks} sessions={sessions} onLog={logSession} orgById={orgById} />
      <EssayWorkshop open={!!workshopNote} note={workshopNote} onClose={() => setWorkshopId(null)}
        onSave={(patch) => {
          if (!workshopId) return;
          const n = notes.find((x) => x.id === workshopId);
          const revisions = n && patch.text !== undefined ? pushRevision(n, patch.text) : (n && n.revisions) || [];
          editNote(workshopId, { ...patch, revisions });
        }} snippets={snippets}
        onAddSnippet={addSnippet} onDeleteSnippet={(id) => persist.snippets(snippets.filter((x) => x.id !== id))} />
      <SundayReview open={reviewOpen} onClose={() => setReviewOpen(false)}
        stats={{ tasks: weekTaskCount, sessions: weekSessions.length, hours: weekHours }}
        unfinished={unfinishedThisWeek} reflections={reflections}
        onRollForward={(t) => editTask(t.id, { date: today })}
        onDrop={(t) => persist.checklist(checklist.filter((x) => x.id !== t.id))}
        onSetFocus={(v) => persist.focus(v)} onSave={(r) => persist.reviews([r, ...reviews])} />
      {editingNote && (
        <NoteEditor note={editingNote} notes={notes} folders={folders}
          onSave={(patch) => { editNote(editingNote.id, patch); setEditingNote((n) => ({ ...n, ...patch })); }}
          onClose={() => setEditingNote(null)} onOpenWorkshop={() => { setWorkshopId(editingNote.id); setEditingNote(null); }} />
      )}
      <Sheet open={settingsOpen} title="Settings" onClose={() => setSettingsOpen(false)}>
        <SettingsPanel settings={settings} onChange={persist.settings} onExport={exportData} onImport={importData} notifyState={notifyState} onAskNotify={askNotify} />
      </Sheet>

      <header className="scout-header sticky top-0 z-20" style={{ background: HEADER_BG, backdropFilter: "blur(14px)", borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-lg mx-auto px-4 py-2.5 flex items-center gap-2">
          <Mascot state={mascotState} size={34} />
          <div className="flex-1">
            <div className="font-display text-base font-bold leading-none" style={{ color: TEXT }}>Scout</div>
            <div className="text-xs" style={{ color: MUTED }}>{fmtFullDate(now)}</div>
          </div>
          <button onClick={() => setPaletteOpen(true)} aria-label="Search everything" className="rounded-full px-3 py-1.5 flex items-center gap-2 text-xs"
            style={{ background: CARD, border: `1px solid ${BORDER}`, color: MUTED }}>
            <Search size={14} /> <span className="hidden sm:inline">Search</span>
            <kbd className="text-xs px-1 rounded" style={{ background: INPUT_BG, border: `1px solid ${BORDER}` }}>⌘K</kbd>
          </button>
          <IconBtn label={dark ? "Switch to day mode" : "Switch to night mode"} onClick={() => persist.settings({ ...settings, theme: dark ? "light" : "dark" })} color={GOLD}>
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </IconBtn>
          <IconBtn label="Settings" onClick={() => setSettingsOpen(true)}><SettingsIcon size={17} /></IconBtn>
        </div>
      </header>

      <main key={tab} className="scout-main max-w-lg mx-auto px-4 pt-3 tab-panel">

        {/* ================= TODAY ================= */}
        {tab === "today" && !activeOrgObj && (
          <>
            <div className="rounded-2xl p-5 mb-3 text-center" style={cardStyle()}>
              <div className="text-sm mb-3" style={{ color: MUTED }}>{greeting}</div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <FlipUnit value={hh} big /><span className="font-display text-4xl font-bold" style={{ color: BORDER }}>:</span><FlipUnit value={mm} big />
                <span className="font-display text-lg font-bold self-end pb-2" style={{ color: MUTED }}>{ss}</span>
              </div>
              {settings.manilaClock && (
                <div className="text-xs mb-1" style={{ color: MUTED }}>Manila <span className="font-display font-bold" style={{ color: TEXT }}>{manilaTime}</span></div>
              )}
              <WalkingCompanion state={mascotState} paused={confetti} />
              <div className="flex items-center gap-2 mt-2">
                <Target size={15} style={{ color: GOLD, flexShrink: 0 }} />
                <input value={focus} onChange={(e) => persist.focus(e.target.value)} placeholder="What's the one thing today?" aria-label="Today's focus"
                  className="flex-1 rounded-lg px-3 py-2 text-sm outline-none text-center" style={fieldStyle()} />
              </div>
              {nextEvent && (
                <div className="text-xs mt-2" style={{ color: MUTED }}>
                  Next: <span style={{ color: TEXT, fontWeight: 600 }}>{nextEvent.title}</span> · {sameDay(new Date(nextEvent.start), now) ? fmtTime(nextEvent.start) : fmtDayShort(nextEvent.start)}
                </div>
              )}
            </div>

            <div className="mb-3"><DayArc now={now} done={doneTasks.length} total={todaysTasks.length} dark={dark} /></div>

            <div className="rounded-2xl p-4 mb-3" style={cardStyle({ borderLeft: `5px solid ${ACCENT}` })}>
              <div className="text-xs uppercase font-semibold mb-2" style={{ color: GOLD, letterSpacing: "0.24em" }}>Lock in</div>
              <div className="flex gap-2">
                <button onClick={() => setFocusRoom(true)} className="flex-1 rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2" style={{ background: ACCENT, color: ACCENT_TEXT }}>
                  <Play size={15} /> Focus room
                </button>
                <button onClick={() => { setTab("apply"); setApplyView("transfer"); setApplySub("essays"); }} className="flex-1 rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2" style={{ border: `1.5px solid ${BORDER}`, color: TEXT }}>
                  <Pencil size={15} /> Write
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                {[[openTasks.length, "left today"], [`${weekHours}h`, "focused this week"], [activeStreak.streak, "day streak"]].map(([v, l]) => (
                  <div key={l} className="rounded-xl p-2 text-center" style={{ background: CARD_2, border: `1px solid ${BORDER_SOFT}` }}>
                    <div className="font-display text-base font-bold">{v}</div><div className="text-xs" style={{ color: MUTED }}>{l}</div>
                  </div>
                ))}
              </div>
              {closingSoon.length > 0 && (
                <button onClick={() => { setTab("apply"); setApplyView(null); }} className="w-full text-left mt-3 pt-3 flex items-center gap-2" style={{ borderTop: `1px dashed ${BORDER}` }}>
                  <span className="font-display text-lg font-bold" style={{ color: daysUntil(closingSoon[0].deadline) <= 7 ? RED : GOLD, minWidth: 40 }}>{daysUntil(closingSoon[0].deadline)}d</span>
                  <span className="flex-1 text-sm">{closingSoon[0].name}</span>
                  <ChevronRight size={15} style={{ color: MUTED }} />
                </button>
              )}
            </div>

            <MissedReminders items={missed} onDismiss={() => setMissed([])} onOpen={() => { setMissed([]); setTab("goals"); setCampaignView("remind"); }} />
            {!dismissedBackup && (!lastBackup || Date.now() - lastBackup > 7 * 86400000) && (
              <BackupNudge lastBackup={lastBackup} onBackup={exportData} onDismiss={() => setDismissedBackup(true)} />
            )}
            <form onSubmit={captureToInbox} className="flex gap-2 mb-3">
              <input value={quickCapture} onChange={(e) => setQuickCapture(e.target.value)} placeholder="Quick capture — get it out of your head" aria-label="Quick capture"
                className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none" style={{ ...fieldStyle(), background: CARD }} />
              <button type="submit" aria-label="Save to inbox" className="rounded-xl px-3" style={{ background: ACCENT, color: ACCENT_TEXT }}><InboxIcon size={16} /></button>
            </form>
            {inbox.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-semibold mb-1 flex items-center gap-1" style={{ color: MUTED }}><InboxIcon size={12} /> Inbox ({inbox.length})</div>
                {inbox.map((i) => <InboxRow key={i.id} item={i} onDelete={() => persist.inbox(inbox.filter((x) => x.id !== i.id))} onConvert={(k) => convertInbox(i, k)} />)}
              </div>
            )}

            <div className="rounded-2xl p-4 mb-3" style={cardStyle()}>
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-semibold flex items-center gap-1.5"><ListChecks size={15} /> Today
                  {activeStreak.streak > 1 && <StreakBadge streak={activeStreak.streak} freezes={activeStreak.freezes} />}
                </div>
                <button onClick={() => setReorderTasks((r) => !r)} className="text-xs" style={{ color: reorderTasks ? GOLD : MUTED }}>{reorderTasks ? "Done" : "Reorder"}</button>
              </div>
              {todaysTasks.length === 0 ? (
                <SectionEmpty text="Nothing scheduled for today. Add one small thing and start there." />
              ) : (
                <TaskList items={openTasks} ds={today} doneMap={doneMap} orgById={orgById} freezeEnabled={settings.streakFreeze}
                  reorderMode={reorderTasks} onReorder={reorderTask} showOrgDot {...taskHandlers} />
              )}
              {doneTasks.length > 0 && (
                <div className="mt-2">
                  <button onClick={() => setShowDoneToday((s) => !s)} aria-expanded={showDoneToday} className="text-xs flex items-center gap-1" style={{ color: MUTED }}>
                    <CheckCircle2 size={12} /> Finished today ({doneTasks.length}) <ChevronDown size={12} style={{ transform: showDoneToday ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                  </button>
                  {showDoneToday && <TaskList items={doneTasks} ds={today} doneMap={doneMap} orgById={orgById} freezeEnabled={settings.streakFreeze} onReorder={reorderTask} showOrgDot {...taskHandlers} />}
                </div>
              )}
              <AddChecklistForm onAdd={addTask} />
              {staleFinished.length > 0 && (
                <button onClick={() => tidyFinished(staleFinished)} className="text-xs mt-3 flex items-center gap-1" style={{ color: MUTED }}>
                  <Archive size={12} /> Clear {staleFinished.length} task{staleFinished.length === 1 ? "" : "s"} finished over two weeks ago
                </button>
              )}
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold flex items-center gap-1.5"><LayoutGrid size={15} /> Your lists</div>
              <div className="flex items-center gap-2">
                {archivedOrgs.length > 0 && <button onClick={() => setShowArchived((s) => !s)} className="text-xs" style={{ color: MUTED }}>{showArchived ? "Hide" : "Show"} archived</button>}
                <button onClick={() => setReorderLists((r) => !r)} className="text-xs" style={{ color: reorderLists ? GOLD : MUTED }}>{reorderLists ? "Done" : "Edit"}</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5 mb-3">
              {activeOrgs.map((org, idx) => {
                const items = checklist.filter((i) => i.orgId === org.id && taskShowsOn(i, today, doneMap));
                const doneCount = items.filter((i) => taskIsDone(i, doneMap, today)).length;
                const top = items.filter((i) => !taskIsDone(i, doneMap, today)).sort(sortByImportance)[0];
                const idle = daysSinceOrgActivity(org.id, orgCheckins, checklist, doneMap);
                return (
                  <OrgSquare key={org.id} org={org} doneCount={doneCount} total={items.length} topTask={top?.text}
                    streakInfo={orgStreak(org.id, orgCheckins, checklist, doneMap, settings.streakFreeze)}
                    cover={(orgPhotos[org.id] || [])[0]?.url} neglected={idle >= 5} reorderMode={reorderLists}
                    canMoveLeft={idx > 0} canMoveRight={idx < activeOrgs.length - 1}
                    onOpen={() => setActiveOrg(org.id)} onCheckin={() => checkinOrg(org.id)}
                    onMoveLeft={() => { const l = [...orgs]; const i = l.findIndex((o) => o.id === org.id); [l[i - 1], l[i]] = [l[i], l[i - 1]]; persist.orgs(l); }}
                    onMoveRight={() => { const l = [...orgs]; const i = l.findIndex((o) => o.id === org.id); [l[i + 1], l[i]] = [l[i], l[i + 1]]; persist.orgs(l); }}
                    onArchive={() => { persist.orgs(orgs.map((o) => (o.id === org.id ? { ...o, archived: true } : o))); pushToast(`${org.name} archived`, { actionLabel: "Undo", onAction: () => persist.orgs(orgs) }); }} />
                );
              })}
              <form onSubmit={(e) => { e.preventDefault(); if (!newOrgName.trim()) return; persist.orgs([...orgs, { id: genId(), name: newOrgName.trim(), color: ORG_COLORS[orgs.length % ORG_COLORS.length], archived: false }]); setNewOrgName(""); }}
                className="rounded-2xl flex flex-col items-center justify-center gap-2 p-3" style={{ border: `1.5px dashed ${BORDER}`, aspectRatio: "1" }}>
                <Plus size={20} style={{ color: MUTED }} />
                <input value={newOrgName} onChange={(e) => setNewOrgName(e.target.value)} placeholder="New list" aria-label="New list name"
                  className="w-full rounded-lg px-2 py-1.5 text-xs outline-none text-center" style={fieldStyle()} />
              </form>
            </div>
            {showArchived && archivedOrgs.map((org) => (
              <div key={org.id} className="rounded-xl p-3 mb-2 flex items-center gap-2" style={cardStyle({ opacity: 0.75 })}>
                <span className="rounded-full" style={{ width: 8, height: 8, background: org.color }} />
                <span className="text-sm flex-1">{org.name}</span>
                <button onClick={() => persist.orgs(orgs.map((o) => (o.id === org.id ? { ...o, archived: false } : o)))} className="text-xs px-2 py-1 rounded-full" style={{ border: `1px solid ${BORDER}`, color: GOLD }}>Bring it back</button>
              </div>
            ))}

            <button onClick={() => setFocusRoom(true)} className="w-full rounded-2xl p-4 mb-3 flex items-center gap-3 text-left lift" style={cardStyle({ borderLeft: `5px solid ${ACCENT}` })}>
              <span className="rounded-xl flex items-center justify-center" style={{ width: 44, height: 44, background: ACCENT_SOFT, color: GOLD }}><Play size={20} /></span>
              <div className="flex-1">
                <div className="text-sm font-semibold">Enter the focus room</div>
                <div className="text-xs" style={{ color: MUTED }}>
                  {weekSessions.length > 0 ? `${weekHours}h focused this week across ${weekSessions.length} sessions` : "Full screen, one task, rain if you want it"}
                </div>
              </div>
              <ChevronRight size={18} style={{ color: MUTED }} />
            </button>

            {closingSoon.length > 0 && (
              <>
                <div className="text-sm font-semibold mb-2 flex items-center gap-1.5"><GraduationCap size={15} /> Closing soon</div>
                {closingSoon.slice(0, 4).map((a) => {
                  const d = daysUntil(a.deadline);
                  return (
                    <button key={a.id} onClick={() => { setTab("goals"); setGoalView("deadlines"); }} className="w-full text-left rounded-xl p-3 mb-2 flex items-center gap-3 lift"
                      style={cardStyle({ borderLeft: `4px solid ${d <= 7 ? RED : ACCENT}` })}>
                      <div className="font-display text-lg font-bold" style={{ color: d <= 7 ? RED : GOLD, minWidth: 42 }}>{d}d</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{a.name}</div>
                        <div className="text-xs" style={{ color: MUTED }}>{a.role || a.type}{a.amountLabel ? ` · ${a.amountLabel}` : ""}</div>
                      </div>
                      <ChevronRight size={16} style={{ color: MUTED }} />
                    </button>
                  );
                })}
              </>
            )}

            <div className="text-sm font-semibold mb-2 mt-4 flex items-center gap-1.5"><CalendarDays size={15} /> Today's schedule</div>
            {todayEvents.length === 0 ? <SectionEmpty text="No events today. A clear calendar is a kind of luxury." /> : todayEvents.map((ev) => <EventCard key={ev.id} ev={ev} org={orgById(ev.orgId)} onDelete={() => deleteEvent(ev.id)} />)}

            <div className="rounded-2xl p-4 mt-4 mb-2 grid grid-cols-4 gap-2 text-center" style={cardStyle()}>
              {[[weekTaskCount, "tasks this week"], [activeStreak.streak, "day streak"], [overdueCount, "overdue"], [closingSoon.length, "closing soon"]].map(([v, l]) => (
                <div key={l}><div className="font-display text-xl font-bold" style={{ color: l === "overdue" && v > 0 ? RED : TEXT }}>{v}</div><div className="text-xs" style={{ color: MUTED }}>{l}</div></div>
              ))}
            </div>
          </>
        )}

        {tab === "today" && activeOrgObj && (
          <OrgDashboard
            org={activeOrgObj}
            items={checklist.filter((i) => i.orgId === activeOrgObj.id && taskShowsOn(i, today, doneMap)).sort(sortByImportance)}
            doneMap={doneMap} today={today} timers={timers} setTimers={setTimers}
            photos={orgPhotos[activeOrgObj.id] || []} ideas={orgIdeas[activeOrgObj.id] || []} activity={orgActivity[activeOrgObj.id] || []}
            streakInfo={orgStreak(activeOrgObj.id, orgCheckins, checklist, doneMap, settings.streakFreeze)}
            weekDone={Object.entries(doneMap).filter(([id, days]) => checklist.find((i) => i.id === id && i.orgId === activeOrgObj.id) && Object.keys(days).some((d) => d >= weekStart)).length}
            nextDeadline={(() => { const e = upcomingEvents.find((x) => x.orgId === activeOrgObj.id); return e ? fmtDayShort(e.start) : null; })()}
            freezeEnabled={settings.streakFreeze}
            onBack={() => setActiveOrg(null)} taskHandlers={taskHandlers} onReorder={reorderTask}
            onRename={(name) => persist.orgs(orgs.map((o) => (o.id === activeOrgObj.id ? { ...o, name } : o)))}
            onAddPhoto={(url) => persist.orgPhotos({ ...orgPhotos, [activeOrgObj.id]: [...(orgPhotos[activeOrgObj.id] || []), { id: genId(), url }] })}
            onDeletePhoto={(id) => persist.orgPhotos({ ...orgPhotos, [activeOrgObj.id]: (orgPhotos[activeOrgObj.id] || []).filter((p) => p.id !== id) })}
            onAddIdea={(text) => persist.orgIdeas({ ...orgIdeas, [activeOrgObj.id]: [...(orgIdeas[activeOrgObj.id] || []), { id: genId(), text }] })}
            onPromoteIdea={(idea) => { addTask({ text: idea.text, importance: 2, recurrence: "none", orgId: activeOrgObj.id }); persist.orgIdeas({ ...orgIdeas, [activeOrgObj.id]: (orgIdeas[activeOrgObj.id] || []).filter((i) => i.id !== idea.id) }); }}
            onDeleteIdea={(id) => persist.orgIdeas({ ...orgIdeas, [activeOrgObj.id]: (orgIdeas[activeOrgObj.id] || []).filter((i) => i.id !== id) })}
          />
        )}

        {/* ================= CALENDAR ================= */}
        {tab === "calendar" && (
          <>
            <div className="mb-3"><Segmented ariaLabel="Calendar view" value={calView} onChange={setCalView} options={[["day", "Day"], ["week", "Week"], ["month", "Month"], ["year", "Year"]]} /></div>
            {calView === "day" && <DayView date={calDate} setDate={setCalDate} events={events} orgById={orgById} onDelete={deleteEvent} />}
            {calView === "week" && <WeekView date={calDate} setDate={setCalDate} events={events} setViewMode={setCalView} orgById={orgById} onDelete={deleteEvent} />}
            {calView === "month" && <MonthView date={calDate} setDate={setCalDate} events={events} setViewMode={setCalView} orgById={orgById} />}
            {calView === "year" && <YearView date={calDate} setDate={setCalDate} events={events} setViewMode={setCalView} />}
            <div className="mt-4"><IcsImport onImport={importIcs} /><AddEventForm orgs={activeOrgs} onAdd={addEvent} /></div>
          </>
        )}

        {/* ================= CAMPAIGN ================= */}
        {tab === "goals" && (
          <>
            <ProfileCard profile={profile} courses={courses} onSave={persist.profile} />
            <SubNav accent="#4A7BA7" value={campaignView} onChange={setCampaignView} items={[
              ["overview", "Overview", LayoutGrid], ["activities", "Activities", Sparkles], ["transcript", "Transcript", GraduationCap],
              ["aid", "Aid", Wallet], ["people", "People", User], ["packets", "Packets", NoteIcon],
              ["templates", "Templates", Mail], ["interview", "Interview", Mic], ["decisions", "Decisions", TrendingUp],
              ["remind", "Reminders", Bell], ["habits", "Habits", Flame], ["money", "Budget", Wallet], ["trash", "Trash", Trash2]]} />

            {campaignView === "overview" && (
              <>
                <div className="mb-3"><StatRow items={[
                  [gpaInfo.gpa !== null ? gpaInfo.gpa.toFixed(2) : "—", "GPA"],
                  [gpaInfo.units || 0, "units"],
                  [activities.length, "activities"],
                  [contacts.length, "contacts"]]} /></div>
                <div className="mb-3"><StatRow items={[
                  [`${ucPicks}/${UC_LIMIT}`, "UC picks", ucPicks > UC_LIMIT ? RED : "#4A7BA7"],
                  [`${caPicks}/${CA_LIMIT}`, "Common App", caPicks > CA_LIMIT ? RED : "#C4703F"],
                  [aidOpen, "aid to-dos", aidOpen ? CORAL : GREEN],
                  [overdueCount, "overdue", overdueCount ? RED : TEXT]]} /></div>

                {staleContacts > 0 && (
                  <button onClick={() => setCampaignView("people")} className="w-full text-left rounded-2xl p-4 mb-3 lift" style={cardStyle({ borderLeft: `5px solid ${CORAL}` })}>
                    <div className="text-sm font-semibold">{staleContacts} {staleContacts === 1 ? "person has" : "people have"} gone quiet</div>
                    <div className="text-xs" style={{ color: MUTED }}>Three weeks or more. A two-line check-in is enough.</div>
                  </button>
                )}

                <div className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Target size={15} /> What's next</div>
                {[["Build the activity bank", `${activities.length} logged`, activities.length >= 15, () => setCampaignView("activities")],
                  ["Enter your transcript", gpaInfo.gpa !== null ? `GPA ${gpaInfo.gpa.toFixed(2)}` : "not started", gpaInfo.gpa !== null, () => setCampaignView("transcript")],
                  ["File financial aid", `${aidOpen} open`, aidOpen === 0, () => setCampaignView("aid")],
                  ["Line up recommenders", `${letters.length} asked`, letters.length >= 2, () => setCampaignView("packets")]
                ].map(([label, hint, done, go]) => (
                  <button key={label} onClick={go} className="w-full text-left rounded-xl p-3 mb-2 flex items-center gap-3 lift" style={cardStyle()}>
                    <span style={{ color: done ? GREEN : MUTED }}>{done ? <CheckCircle2 size={18} /> : <Circle size={18} />}</span>
                    <span className="text-sm flex-1">{label}</span>
                    <span className="text-xs" style={{ color: MUTED }}>{hint}</span>
                    <ChevronRight size={15} style={{ color: MUTED }} />
                  </button>
                ))}
              </>
            )}
            {campaignView === "activities" && <ActivityBank activities={activities} onAdd={addActivity} onUpdate={updateActivity} onDelete={deleteActivity} />}
            {campaignView === "transcript" && <TranscriptPanel courses={courses} onAdd={addCourse} onUpdate={updateCourse} onDelete={deleteCourse} />}
            {campaignView === "aid" && <FinancialAid items={aidItems} onUpdate={(id, patch) => persist.aidItems(aidItems.map((a) => (a.id === id ? { ...a, ...patch } : a)))} />}
            {campaignView === "people" && <NetworkingLog contacts={contacts} onDraft={draftEmailTo}
              onAdd={(c) => persist.contacts([{ id: genId(), ...c }, ...contacts])}
              onUpdate={(id, patch) => persist.contacts(contacts.map((c) => (c.id === id ? { ...c, ...patch } : c)))}
              onDelete={(id) => { const prev = contacts; persist.contacts(contacts.filter((c) => c.id !== id)); pushToast("Contact removed", { actionLabel: "Undo", onAction: () => persist.contacts(prev) }); }} />}
            {campaignView === "packets" && <RecommenderPackets letters={letters} schools={schools} assets={assets} profile={profile}
              onUpdate={(id, patch) => persist.letters(letters.map((l) => (l.id === id ? { ...l, ...patch } : l)))} />}
            {campaignView === "templates" && <TemplateVault templates={templates} profile={profile} prefill={tplPrefill} onClearPrefill={() => setTplPrefill(null)}
              onAdd={(t) => persist.templates([...templates, { id: genId(), ...t }])}
              onUpdate={(id, patch) => persist.templates(templates.map((t) => (t.id === id ? { ...t, ...patch } : t)))}
              onDelete={(id) => persist.templates(templates.filter((t) => t.id !== id))} />}
            {campaignView === "interview" && <InterviewPrep questions={interviewQs} activities={activities}
              onAdd={(q) => persist.interviewQs([{ id: genId(), ...q }, ...interviewQs])}
              onUpdate={(id, patch) => persist.interviewQs(interviewQs.map((q) => (q.id === id ? { ...q, ...patch } : q)))}
              onDelete={(id) => persist.interviewQs(interviewQs.filter((q) => q.id !== id))} />}
            {campaignView === "decisions" && <DecisionTracker schools={schools} onUpdate={updateSchool} />}
            {campaignView === "remind" && (
              <>
                <AddReminderForm orgs={activeOrgs} onAdd={addReminder} />
                {reminders.length === 0 && <SectionEmpty text="No reminders yet. Try “call mom tomorrow at 7” — Scout reads the date out of it." />}
                {[...reminders].sort((a, b) => (a.done - b.done) || (new Date(a.dueAt || "2099") - new Date(b.dueAt || "2099"))).map((r) => (
                  <ReminderRow key={r.id} r={r} org={orgById(r.orgId)} onToggle={() => toggleReminder(r)} onSnooze={(m) => snoozeReminder(r, m)} onDelete={() => deleteReminder(r.id)} />
                ))}
              </>
            )}
            {campaignView === "habits" && (
              <>
                <AddHabitForm orgs={activeOrgs} onAdd={(h) => persist.habits([...habits, { id: genId(), ...h }])} />
                {habits.length === 0 && <SectionEmpty text="Habits live here. Start with one you could do on your worst day." />}
                {habits.map((h) => (
                  <HabitRow key={h.id} habit={h} checkins={habitCheckins} freezeEnabled={settings.streakFreeze} onToggleDay={toggleHabitDay}
                    onDelete={() => { const prev = habits; persist.habits(habits.filter((x) => x.id !== h.id)); pushToast("Habit deleted", { actionLabel: "Undo", onAction: () => persist.habits(prev) }); }} />
                ))}
              </>
            )}
            {campaignView === "money" && <BudgetPanel budget={budget} onSave={persist.budget} />}
            {campaignView === "trash" && <TrashPanel trash={trash} onRestore={restoreFromTrash}
              onPurge={(id) => persist.trash(trash.filter((t) => t.id !== id))} onEmpty={() => { persist.trash([]); pushToast("Trash emptied"); }} />}
          </>
        )}

        {/* ================= APPLY ================= */}
        {tab === "apply" && !applyView && (
          <>
            <Timeline now={now} schools={schools} applications={applications} milestones={milestones} />
            <div className="text-sm font-semibold mb-2 flex items-center gap-1.5"><GraduationCap size={15} /> Three different games</div>
            <ApplyDoor title="Transfer" subtitle="15 schools · 4 portals" icon={GraduationCap} color="#4A7BA7"
              stat={nextTransferDeadline !== undefined ? `${nextTransferDeadline}d` : "—"} statLabel="next close"
              percent={schools.length ? transferSent / schools.length : 0} onClick={() => { setApplyView("transfer"); setApplySub("schools"); }} />
            <ApplyDoor title="Scholarships" subtitle={`${scholarships.length} tracked`} icon={Wallet} color="#8B5E83"
              stat={money(scholarships.filter((a) => a.status !== "rejected").reduce((t, a) => t + (a.amountValue || 0), 0))} statLabel="on the table"
              percent={scholarships.length ? doneOf(scholarships) / scholarships.length : 0} onClick={() => { setApplyView("scholarships"); setApplySub("list"); }} />
            <ApplyDoor title="Internships" subtitle={`${internships.length} tracked`} icon={ActivityIcon} color="#C4703F"
              stat={doneOf(internships)} statLabel="applied" percent={internships.length ? doneOf(internships) / internships.length : 0}
              onClick={() => { setApplyView("internships"); setApplySub("list"); }} />

            <button onClick={() => { setApplyView("transfer"); setApplySub("assets"); }} className="w-full rounded-2xl p-4 mb-3 text-left lift" style={cardStyle({ borderLeft: `5px solid ${GREEN}` })}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Shared requirements</div>
                  <div className="text-xs" style={{ color: MUTED }}>The pieces every application asks for</div>
                </div>
                <div className="text-right"><div className="font-display text-xl font-bold">{assetsReady}/{assets.length}</div><div className="text-xs" style={{ color: MUTED }}>ready</div></div>
              </div>
              <div className="mt-2"><MeterBar percent={assets.length ? assetsReady / assets.length : 0} color={GREEN} height={6} /></div>
            </button>

            <div className="text-sm font-semibold mb-2 mt-4 flex items-center gap-1.5"><Target size={15} /> The roadmap</div>
            <RoadmapProgress milestones={milestones} />
            {PHASE_ORDER.map((phase, i) => {
              const items = milestones.filter((m) => m.phase === phase);
              if (!items.length) return null;
              return (
                <MilestonePhaseCard key={phase} phase={phase} items={items} defaultOpen={i === 0} onToggle={toggleMilestone}
                  onAdd={(text) => persist.milestones([...milestones, { id: genId(), phase, text, done: false }])}
                  onDelete={(id) => persist.milestones(milestones.filter((m) => m.id !== id))} />
              );
            })}
          </>
        )}

        {tab === "apply" && applyView === "transfer" && (
          <div className="transfer-world">
            <button onClick={() => setApplyView(null)} className="flex items-center gap-1 text-sm mb-3" style={{ color: MUTED }}><ArrowLeft size={16} /> Apply</button>
            <div className="rounded-2xl p-5 mb-3 text-center" style={cardStyle({ borderTop: `4px solid #4A7BA7` })}>
              <div className="text-xs uppercase tracking-[0.3em] mb-1" style={{ color: "#4A7BA7" }}>Transfer</div>
              <div className="font-display text-2xl font-bold" style={{ color: TEXT }}>De Anza → somewhere new</div>
              <div className="text-sm mt-1" style={{ color: MUTED }}>15 schools, 4 portals, one story told four ways.</div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {[[transferSent, "sent"], [nextTransferDeadline !== undefined ? `${nextTransferDeadline}d` : "—", "next close"], [`${assetsReady}/${assets.length}`, "pieces ready"]].map(([v, l]) => (
                  <div key={l} className="rounded-xl p-2" style={{ background: CARD_2, border: `1px solid ${BORDER_SOFT}` }}>
                    <div className="font-display text-lg font-bold">{v}</div><div className="text-xs" style={{ color: MUTED }}>{l}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => setFocusRoom(true)} className="mt-4 w-full rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2" style={{ background: ACCENT, color: ACCENT_TEXT }}>
                <Play size={14} /> Lock in for 50 minutes
              </button>
            </div>
            <div className="mb-3"><Segmented ariaLabel="Transfer view" value={applySub} onChange={setApplySub}
              options={[["schools", "Schools"], ["assets", "What's needed"], ["letters", "Letters"], ["essays", "Essays"]]} /></div>

            {applySub === "schools" && (
              <>
                <div className="text-xs rounded-xl p-3 mb-3" style={cardStyle({ color: MUTED })}>
                  Deadlines here are starting points, not gospel — application cycles shift every year. Each one is marked <span style={{ color: CORAL }}>verify date</span> until you check it against the official site.
                </div>
                {PORTAL_ORDER.map((pid, i) => (
                  <PortalGroup key={pid} portalId={pid} schools={schoolsByPortal(pid)} assets={assets} sharedDone={sharedDone}
                    onToggleShared={toggleShared} defaultOpen={i === 0} onUpdate={updateSchool} onDelete={deleteSchool}
                    onToggleSupp={toggleSupp} onAddSupp={addSupp} onWriteSupp={writeSupplement} />
                ))}
              </>
            )}
            {applySub === "assets" && <AssetsPanel assets={assets} schools={schools} applications={applications} onStatus={setAssetStatus} onNote={setAssetNote} onOpenEssay={openAssetEssay} />}
            {applySub === "letters" && <LetterTracker letters={letters} schools={schools}
              onAdd={(l) => persist.letters([...letters, { id: genId(), ...l }])}
              onUpdate={(id, patch) => persist.letters(letters.map((x) => (x.id === id ? { ...x, ...patch } : x)))}
              onDelete={(id) => { const prev = letters; persist.letters(letters.filter((x) => x.id !== id)); pushToast("Recommender removed", { actionLabel: "Undo", onAction: () => persist.letters(prev) }); }} />}
            {applySub === "essays" && (
              <>
                <div className="rounded-2xl p-4 mb-3" style={cardStyle()}>
                  <div className="text-sm font-semibold mb-1">Write once, reuse everywhere</div>
                  <div className="text-xs mb-2" style={{ color: MUTED }}>You have roughly fifteen essays ahead of you and most of them are the same material rearranged. Save any paragraph as a blurb and pull it into the next one.</div>
                  <div className="flex gap-2">
                    <button onClick={newEssay} className="flex-1 rounded-lg py-2 text-sm font-semibold" style={{ background: ACCENT, color: ACCENT_TEXT }}>Start a new essay</button>
                    <button onClick={() => setFocusRoom(true)} className="rounded-lg px-3 py-2 text-sm font-semibold" style={{ border: `1px solid ${BORDER}`, color: TEXT }}>Focus</button>
                  </div>
                  <div className="text-xs mt-2" style={{ color: MUTED }}>{snippets.length} blurb{snippets.length === 1 ? "" : "s"} saved</div>
                </div>
                {notes.filter((n) => n.kind === "essay").length === 0 && <SectionEmpty text="No essays yet. The UC personal insight questions are the ones that get reused the most — start there." />}
                {notes.filter((n) => n.kind === "essay").map((n) => {
                  const wc = wordCount(n.text);
                  return (
                    <button key={n.id} onClick={() => setWorkshopId(n.id)} className="w-full text-left rounded-xl p-3 mb-2 lift" style={cardStyle()}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold">{n.title}</span>
                        <span className="text-xs font-display" style={{ color: wc > (n.wordTarget || 0) ? RED : MUTED }}>{wc}/{n.wordTarget || "?"}</span>
                      </div>
                      <div className="mt-2"><MeterBar percent={n.wordTarget ? clamp(wc / n.wordTarget, 0, 1) : 0} color={wc > (n.wordTarget || 0) ? RED : ACCENT} height={5} /></div>
                    </button>
                  );
                })}
              </>
            )}
          </div>
        )}

        {tab === "apply" && (applyView === "scholarships" || applyView === "internships") && (
          <>
            <button onClick={() => setApplyView(null)} className="flex items-center gap-1 text-sm mb-3" style={{ color: MUTED }}><ArrowLeft size={16} /> Apply</button>
            {applyView === "scholarships" ? <MoneyCounter applications={applications} /> : (
              <div className="rounded-2xl p-5 mb-3 text-center" style={cardStyle({ borderTop: `4px solid #C4703F` })}>
                <div className="text-xs uppercase tracking-[0.3em] mb-1" style={{ color: "#C4703F" }}>Internships</div>
                <div className="font-display text-2xl font-bold">{doneOf(internships)} of {internships.length} applied</div>
                <div className="text-sm mt-1" style={{ color: MUTED }}>Entertainment, tech and arts in LA. Most open October through February.</div>
              </div>
            )}
            <ApplicationsSection
              list={(applyView === "scholarships" ? scholarships : internships).sort((a, b) => (b.priority - a.priority) || ((a.deadline ? daysUntil(a.deadline) : 9999) - (b.deadline ? daysUntil(b.deadline) : 9999)))}
              view={appView} setView={setAppView} onDelete={deleteApplication} onStatus={setAppStatus} onOpenNote={openAppNote}
              onAddReq={(id, text) => persist.applications(applications.map((x) => (x.id === id ? { ...x, requirements: [...x.requirements, { id: genId(), text, done: false }] } : x)))}
              onToggleReq={(id, rid) => persist.applications(applications.map((x) => (x.id === id ? { ...x, requirements: x.requirements.map((r) => (r.id === rid ? { ...r, done: !r.done } : r)) } : x)))}
              onDeleteReq={(id, rid) => persist.applications(applications.map((x) => (x.id === id ? { ...x, requirements: x.requirements.filter((r) => r.id !== rid) } : x)))}
              onAdd={addApplication}
              emptyText={applyView === "scholarships" ? "No scholarships tracked yet." : "No internships tracked yet."} />
          </>
        )}

        {/* ================= SPACES ================= */}
        {tab === "notes" && !spaceObj && (
          <>
            <WorldHeader world="spaces" title="Where the work lives"
              subtitle="Every group you're part of gets its own room — its links, its people, its calendar, its hours."
              stats={[[activeOrgs.length, "spaces"], [checklist.filter((i2) => i2.orgId && !taskIsDone(i2, doneMap, today) && taskShowsOn(i2, today, doneMap)).length, "open tasks"], [notes.length, "notes"]]} />
            <div className="grid grid-cols-2 gap-2.5 mb-3">
              {activeOrgs.map((org) => (
                <LogoTile key={org.id} org={org} logo={spaceOf(org.id).logo}
                  taskCount={checklist.filter((i2) => i2.orgId === org.id && taskShowsOn(i2, today, doneMap) && !taskIsDone(i2, doneMap, today)).length}
                  streak={orgStreak(org.id, orgCheckins, checklist, doneMap, settings.streakFreeze).streak}
                  hoursThisWeek={hoursThisWeek(org.id)}
                  onClick={() => { setActiveSpace(org.id); setSpaceView("overview"); }} />
              ))}
              <form onSubmit={(e) => { e.preventDefault(); if (!newOrgName.trim()) return; persist.orgs([...orgs, { id: genId(), name: newOrgName.trim(), color: ORG_COLORS[orgs.length % ORG_COLORS.length], archived: false }]); setNewOrgName(""); }}
                className="rounded-2xl flex flex-col items-center justify-center gap-2 p-4" style={{ border: `1.5px dashed ${BORDER}`, minHeight: 150 }}>
                <Plus size={20} style={{ color: MUTED }} />
                <input value={newOrgName} onChange={(e) => setNewOrgName(e.target.value)} placeholder="New space" aria-label="New space name"
                  className="w-full rounded-lg px-2 py-1.5 text-xs outline-none text-center" style={fieldStyle()} />
              </form>
            </div>
            <button onClick={() => { setNotesOrgView("__general"); setActiveSpace("__notes"); setSpaceView("notes"); }}
              className="w-full rounded-2xl p-4 text-left lift flex items-center gap-3" style={cardStyle({ borderLeft: `5px solid ${MUTED}` })}>
              <span className="rounded-xl flex items-center justify-center" style={{ width: 42, height: 42, background: INPUT_BG, color: MUTED }}><StickyNote size={19} /></span>
              <div className="flex-1">
                <div className="text-sm font-semibold">Everything else</div>
                <div className="text-xs" style={{ color: MUTED }}>Loose notes that don't belong to a group</div>
              </div>
              <ChevronRight size={17} style={{ color: MUTED }} />
            </button>
          </>
        )}

        {tab === "notes" && spaceObj && (
          <div className="transfer-world">
            <button onClick={() => { setActiveSpace(null); setNotesOrgView(null); }} className="flex items-center gap-1 text-sm mb-3" style={{ color: MUTED }}><ArrowLeft size={16} /> All spaces</button>
            <div className="rounded-2xl p-5 mb-3" style={cardStyle({ borderTop: `4px solid ${spaceObj.color}` })}>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl overflow-hidden flex items-center justify-center" style={{ width: 56, height: 56, background: `${spaceObj.color}1F`, border: `1px solid ${spaceObj.color}44` }}>
                  {spaceOf(spaceObj.id).logo ? <img src={spaceOf(spaceObj.id).logo} alt="" className="w-full h-full object-cover" />
                    : <span className="font-display font-bold" style={{ color: spaceObj.color, fontSize: 20 }}>{spaceObj.name.trim().slice(0, 2).toUpperCase()}</span>}
                </div>
                <div className="flex-1">
                  <div className="font-display text-xl font-bold leading-tight" style={{ color: TEXT }}>{spaceObj.name}</div>
                  <div className="text-xs" style={{ color: MUTED }}>{hoursThisWeek(spaceObj.id) ? `${hoursThisWeek(spaceObj.id)}h logged this week` : "Your room for this group"}</div>
                </div>
                <IconBtn label="Check in" onClick={() => checkinOrg(spaceObj.id)} color={GOLD} style={{ background: ACCENT_SOFT, borderRadius: "50%", padding: 9 }}><Check size={16} /></IconBtn>
              </div>
              <input defaultValue={spaceOf(spaceObj.id).logo} onBlur={(e) => setSpace(spaceObj.id, { logo: e.target.value.trim() })}
                placeholder="Paste a logo image URL" aria-label="Logo URL" className="w-full rounded-lg px-2 py-1.5 text-xs outline-none mt-3" style={fieldStyle()} />
            </div>
            <SubNav accent={spaceObj.color} value={spaceView} onChange={setSpaceView} items={[
              ["overview", "Overview", LayoutGrid], ["tasks", "Tasks", ListChecks], ["calendar", "Calendar", CalendarDays],
              ["hours", "Hours", ActivityIcon], ["vault", "Vault", Folder], ["notes", "Notes", StickyNote]]} />

            {spaceView === "overview" && (
              <>
                <LinkList label="Links and socials" items={spaceOf(spaceObj.id).links || []}
                  placeholder="LinkedIn, Instagram, the website, the shared drive — whatever you keep opening."
                  onAdd={(l) => spaceList(spaceObj.id, "links", (x) => [...x, l])}
                  onDelete={(id) => spaceList(spaceObj.id, "links", (x) => x.filter((y) => y.id !== id))} />
                <PlanList title="Future plans" placeholder="The things you keep meaning to do for this group."
                  items={spaceOf(spaceObj.id).plans || []}
                  onAdd={(i2) => spaceList(spaceObj.id, "plans", (x) => [...x, i2])}
                  onToggle={(id) => spaceList(spaceObj.id, "plans", (x) => x.map((y) => (y.id === id ? { ...y, done: !y.done } : y)))}
                  onDelete={(id) => spaceList(spaceObj.id, "plans", (x) => x.filter((y) => y.id !== id))} />
                <div className="rounded-2xl p-4 mb-3" style={cardStyle()}>
                  <div className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Lightbulb size={15} /> Ideas for someday</div>
                  {(orgIdeas[spaceObj.id] || []).map((i2) => (
                    <div key={i2.id} className="flex items-center gap-2 py-1.5 task-row" style={{ borderTop: `1px solid ${BORDER_SOFT}` }}>
                      <span className="flex-1 text-sm">{i2.text}</span>
                      <button onClick={() => { addTask({ text: i2.text, importance: 2, recurrence: "none", orgId: spaceObj.id }); persist.orgIdeas({ ...orgIdeas, [spaceObj.id]: (orgIdeas[spaceObj.id] || []).filter((z) => z.id !== i2.id) }); }}
                        className="text-xs px-2 py-1 rounded-full" style={{ border: `1px solid ${BORDER}`, color: GOLD }}>Make it a task</button>
                      <IconBtn label="Delete idea" onClick={() => persist.orgIdeas({ ...orgIdeas, [spaceObj.id]: (orgIdeas[spaceObj.id] || []).filter((z) => z.id !== i2.id) })}><X size={13} /></IconBtn>
                    </div>
                  ))}
                  <AddIdeaForm onAdd={(text) => persist.orgIdeas({ ...orgIdeas, [spaceObj.id]: [...(orgIdeas[spaceObj.id] || []), { id: genId(), text }] })} />
                </div>
              </>
            )}
            {spaceView === "tasks" && (
              <>
                <TaskList items={checklist.filter((i2) => i2.orgId === spaceObj.id && taskShowsOn(i2, today, doneMap)).sort(sortByImportance)}
                  ds={today} doneMap={doneMap} orgById={orgById} freezeEnabled={settings.streakFreeze} onReorder={reorderTask} {...taskHandlers} />
                <AddChecklistForm onAdd={(data) => addTask({ ...data, orgId: spaceObj.id })} />
              </>
            )}
            {spaceView === "calendar" && <SpaceActivities accent={spaceObj.color} items={spaceOf(spaceObj.id).activities || []}
              onAdd={(a) => spaceList(spaceObj.id, "activities", (x) => [...x, a])}
              onToggle={(id) => spaceList(spaceObj.id, "activities", (x) => x.map((y) => (y.id === id ? { ...y, done: !y.done } : y)))}
              onDelete={(id) => spaceList(spaceObj.id, "activities", (x) => x.filter((y) => y.id !== id))} />}
            {spaceView === "hours" && <HoursLog accent={spaceObj.color} entries={spaceOf(spaceObj.id).hours || []}
              onAdd={(h) => spaceList(spaceObj.id, "hours", (x) => [...x, h])}
              onDelete={(id) => spaceList(spaceObj.id, "hours", (x) => x.filter((y) => y.id !== id))} />}
            {spaceView === "vault" && (
              <>
                <LinkList label="The vault" items={spaceOf(spaceObj.id).vault || []}
                  placeholder="Files, decks, brand assets, drive folders, receipts — anything you'd hate to lose."
                  onAdd={(l) => spaceList(spaceObj.id, "vault", (x) => [...x, l])}
                  onDelete={(id) => spaceList(spaceObj.id, "vault", (x) => x.filter((y) => y.id !== id))} />
                <div className="text-sm font-semibold mb-2 flex items-center gap-1.5"><ImageIcon size={15} /> Photos</div>
                {(orgPhotos[spaceObj.id] || []).length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {(orgPhotos[spaceObj.id] || []).map((ph) => (
                      <div key={ph.id} className="relative rounded-lg overflow-hidden" style={{ aspectRatio: "1", border: `1px solid ${BORDER}` }}>
                        <img src={ph.url} alt="" className="w-full h-full object-cover" />
                        <IconBtn label="Remove photo" onClick={() => persist.orgPhotos({ ...orgPhotos, [spaceObj.id]: (orgPhotos[spaceObj.id] || []).filter((z) => z.id !== ph.id) })}
                          color="#fff" style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.5)", borderRadius: "50%", padding: 2 }}><X size={12} /></IconBtn>
                      </div>
                    ))}
                  </div>
                )}
                <form onSubmit={(e) => { e.preventDefault(); const v = e.target.elements.photo.value.trim(); if (!v) return; persist.orgPhotos({ ...orgPhotos, [spaceObj.id]: [...(orgPhotos[spaceObj.id] || []), { id: genId(), url: v }] }); e.target.reset(); }} className="flex gap-2 mb-3">
                  <input name="photo" placeholder="Paste image URL…" aria-label="Image URL" className="flex-1 rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
                  <button type="submit" aria-label="Add photo" className="rounded-lg px-3" style={{ background: ACCENT, color: ACCENT_TEXT }}><Plus size={16} /></button>
                </form>
              </>
            )}
            {spaceView === "notes" && (
              <>
                <AddNoteForm folders={folders} onAdd={(d) => { const orgId = spaceObj.id === "__notes" ? null : spaceObj.id; persist.notes([{ id: genId(), pinned: false, updatedAt: Date.now(), checklistItems: [], linkedApplicationId: null, orgId, ...d }, ...notes]); }} />
                <div className="note-board">
                  {notes.filter((n) => (spaceObj.id === "__notes" ? !n.orgId : n.orgId === spaceObj.id)).sort((a, b) => (b.pinned - a.pinned) || (b.updatedAt - a.updatedAt)).map((n) => (
                    <BoardNote key={n.id} note={n} notes={notes} folders={folders} backlinks={backlinksFor(n)}
                      onOpen={() => setEditingNote(n)} onPin={() => editNote(n.id, { pinned: !n.pinned })}
                      onDelete={() => deleteNote(n.id)} onOpenNote={(t) => setEditingNote(t)} onOpenWorkshop={() => setWorkshopId(n.id)} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ================= REFLECT ================= */}
        {tab === "reflect" && (
          <>
            <AdviceCard />
            {(isSunday || reviews.length === 0) && !reviewedToday && (
              <button onClick={() => setReviewOpen(true)} className="w-full rounded-2xl p-4 mb-3 text-left lift" style={cardStyle({ borderLeft: `5px solid ${ACCENT}` })}>
                <div className="flex items-center gap-3">
                  <Mascot state="happy" size={40} />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">Close out the week</div>
                    <div className="text-xs" style={{ color: MUTED }}>Four minutes. Look back, clear the loose ends, pick one thing.</div>
                  </div>
                  <ChevronRight size={18} style={{ color: MUTED }} />
                </div>
              </button>
            )}
            <OnThisDay reflections={reflections} now={now} />
            <WeeklyReview reflections={reflections} tasksThisWeek={weekTaskCount} milestonesDone={weekMilestones} remindersDone={weekReminders} topMood={topMood} />
            <div className="rounded-2xl p-4 mb-3" style={cardStyle()}>
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-semibold">Mood and energy</div>
                <div style={{ width: 150 }}><Segmented ariaLabel="Range" value={trendRange} onChange={setTrendRange} options={[[7, "Week"], [30, "Month"]]} /></div>
              </div>
              <TrendBars reflections={reflections} days={trendRange} />
            </div>
            <button onClick={() => exportWeekCard({ tasks: weekTaskCount, streak: activeStreak.streak, hours: weekHours, win: currentReflection?.win || reflections.filter((r) => r.win)[0]?.win, oneThing: focus, dark })}
              className="w-full rounded-2xl py-3 mb-3 flex items-center justify-center gap-2 text-sm font-semibold" style={{ border: `1.5px dashed ${BORDER}`, color: MUTED }}>
              <Download size={15} /> Save this week as an image
            </button>
            <ReflectionForm existing={currentReflection} onSave={saveReflection} saved={reflectSaved} />
            <BreathingGame />
            <RunnerGame best={gameBest} onBest={(s) => { setGameBest(s); saveKey("game-best", s); }} />
            {reflections.filter((r) => r.date !== today).length > 0 && (
              <>
                <div className="text-sm font-semibold mb-2 mt-4">Earlier entries</div>
                {[...reflections].filter((r) => r.date !== today).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 20).map((r) => (
                  <div key={r.id} className="rounded-xl p-3 mb-2" style={cardStyle()}>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 20 }}>{r.mood}</span>
                      <span className="text-xs font-semibold" style={{ color: MUTED }}>{fmtDayShort(r.date + "T12:00:00")}</span>
                      <div className="ml-auto flex gap-0.5">{[1, 2, 3, 4, 5].map((l) => <span key={l} className="rounded-sm" style={{ width: 5, height: 12, background: l <= r.energy ? ACCENT : BORDER }} />)}</div>
                    </div>
                    {r.win && <div className="text-xs mt-1.5" style={{ color: TEXT }}>Win: {r.win}</div>}
                    {r.gratitude && <div className="text-xs" style={{ color: MUTED }}>Grateful for: {r.gratitude}</div>}
                    {r.journalText && <div className="text-xs mt-1" style={{ color: MUTED, whiteSpace: "pre-wrap" }}>{r.journalText}</div>}
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </main>

      <nav className="scout-nav fixed bottom-0 left-0 right-0 z-30" style={{ background: HEADER_BG, backdropFilter: "blur(14px)", borderTop: `1px solid ${BORDER}` }}>
        <div className="scout-navinner max-w-lg mx-auto flex" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          <TabButton active={tab === "calendar"} onClick={() => setTab("calendar")} icon={CalendarDays} label="Calendar" />
          <TabButton active={tab === "goals"} onClick={() => { setTab("goals"); setCampaignView("overview"); }} icon={Target} label="Campaign" dot={overdueCount > 0} />
          <TabButton active={tab === "apply"} onClick={() => { setTab("apply"); setApplyView(null); }} icon={GraduationCap} label="Apply" dot={nextTransferDeadline !== undefined && nextTransferDeadline <= 14} />
          <TabButton active={tab === "today"} onClick={() => { setTab("today"); setActiveOrg(null); }} icon={ListChecks} label="Today" />
          <TabButton active={tab === "notes"} onClick={() => { setTab("notes"); setActiveSpace(null); }} icon={StickyNote} label="Spaces" />
          <TabButton active={tab === "reflect"} onClick={() => setTab("reflect")} icon={Heart} label="Reflect" />
        </div>
      </nav>
    </div>
  );
}

/* =====================================================================
   TRANSFER · SCHOLARSHIPS · INTERNSHIPS — three separate worlds
   ===================================================================== */

const SCHOOLS_VERSION = "v1-transfer-fall-2027";
const ASSETS_VERSION = "v1-shared-requirements";

const PORTAL_META = {
  uc: { name: "UC Application", color: "#4A7BA7", window: "Filing window: Oct 1 – Nov 30, 2026", site: "https://apply.universityofcalifornia.edu",
    note: "One application, one fee per campus, one set of essays. Submit once and it goes to every UC you pick." },
  common: { name: "Common App", color: "#C4703F", window: "Deadlines land Feb – Apr 2027", site: "https://apply.commonapp.org/transfer",
    note: "One personal essay plus a supplement per school. Deadlines vary — check each one." },
  commonLetters: { name: "Common App · 2 letters of evaluation", color: "#8B5E83", window: "Deadlines land Feb – Mar 2027", site: "https://apply.commonapp.org/transfer",
    note: "Same Common App, but each of these wants two academic letters of evaluation. Ask early — this is the long pole." },
  csu: { name: "Cal State Apply", color: "#B08D3F", window: "Filing window: Oct 1 – Nov 30, 2026", site: "https://www.calstate.edu/apply",
    note: "No essays for most CSU transfers. It's about the Golden Four and 60 transferable units." },
};
const PORTAL_ORDER = ["uc", "common", "commonLetters", "csu"];

const UC_PIQ_TOPICS = [
  "A time you led", "Your creative side", "Your greatest talent", "An educational opportunity or barrier",
  "A challenge you got through", "The subject that grabs you", "How you made your community better", "What else sets you apart",
];

const SHARED_WORK = {
  uc: [
    { id: "sw_uc_piq", text: "Pick 4 of the 8 personal insight questions", target: 0 },
    { id: "sw_uc_piq1", text: "PIQ 1 draft", target: 350 }, { id: "sw_uc_piq2", text: "PIQ 2 draft", target: 350 },
    { id: "sw_uc_piq3", text: "PIQ 3 draft", target: 350 }, { id: "sw_uc_piq4", text: "PIQ 4 draft", target: 350 },
    { id: "sw_uc_courses", text: "Enter every course and grade from De Anza", target: 0 },
    { id: "sw_uc_major", text: "Confirm major prep is done for each campus", target: 0 },
  ],
  common: [
    { id: "sw_ca_essay", text: "Common App personal essay", target: 650 },
    { id: "sw_ca_reason", text: "Reasons-for-transfer statement", target: 300 },
    { id: "sw_ca_activities", text: "Activities list — 10 slots, most important first", target: 0 },
    { id: "sw_ca_report", text: "College Report + Registrar signature", target: 0 },
  ],
  commonLetters: [
    { id: "sw_cl_l1", text: "Letter of evaluation 1 — ask by October", target: 0 },
    { id: "sw_cl_l2", text: "Letter of evaluation 2 — ask by October", target: 0 },
    { id: "sw_cl_mid", text: "Mid-term report from current professors", target: 0 },
  ],
  csu: [
    { id: "sw_csu_g4", text: "Golden Four done: oral comm, written comm, critical thinking, math", target: 0 },
    { id: "sw_csu_units", text: "60 transferable semester units on track", target: 0 },
    { id: "sw_csu_adt", text: "Check if an ADT applies to your major", target: 0 },
  ],
};

const mkSchool = (o) => ({
  id: genId(), status: "not_started", deadline: null, verify: true, tag: false, supplements: [],
  requires: [], notes: "", decision: null, link: "", fee: 80, ...o,
});

const SEED_SCHOOLS = [
  mkSchool({ name: "UCLA", portal: "uc", deadline: "2026-11-30", tag: false, requires: ["as_transcript", "as_piq", "as_activities"], notes: "No TAG. Most competitive UC transfer target — major prep has to be airtight." }),
  mkSchool({ name: "UC Berkeley", portal: "uc", deadline: "2026-11-30", tag: false, requires: ["as_transcript", "as_piq", "as_activities"], notes: "No TAG. Check the college-specific requirements for your major." }),
  mkSchool({ name: "UC Irvine", portal: "uc", deadline: "2026-11-30", tag: true, requires: ["as_transcript", "as_piq", "as_activities", "as_tag"], notes: "TAG eligible — guaranteed admission if you meet the terms. TAG window is Sep 1–30, before the main app." }),
  mkSchool({ name: "UC Santa Barbara", portal: "uc", deadline: "2026-11-30", tag: true, requires: ["as_transcript", "as_piq", "as_activities", "as_tag"], notes: "TAG eligible. File the TAG in September, then the regular app in the fall." }),
  mkSchool({ name: "UC San Diego", portal: "uc", deadline: "2026-11-30", tag: false, requires: ["as_transcript", "as_piq", "as_activities"], notes: "No TAG. Ranks your college choices — think about which one fits." }),
  mkSchool({ name: "Boston University", portal: "common", deadline: "2027-03-01", requires: ["as_transcript", "as_essay", "as_activities", "as_report"], supplements: [{ id: genId(), text: "BU supplement", done: false }], notes: "Verify the transfer deadline — BU has run both fall and spring cycles." }),
  mkSchool({ name: "NYU", portal: "common", deadline: "2027-04-01", requires: ["as_transcript", "as_essay", "as_activities", "as_report"], supplements: [{ id: genId(), text: "NYU supplement — why this school, why this program", done: false }], notes: "Ask about the specific school inside NYU (Steinhardt, Tisch, CAS) — they read differently." }),
  mkSchool({ name: "Northwestern University", portal: "common", deadline: "2027-03-01", requires: ["as_transcript", "as_essay", "as_activities", "as_report"], supplements: [{ id: genId(), text: "Northwestern supplement", done: false }], notes: "Verify the date — Northwestern transfer deadlines have moved around." }),
  mkSchool({ name: "USC", portal: "common", deadline: "2027-02-15", requires: ["as_transcript", "as_essay", "as_activities", "as_report"], supplements: [{ id: genId(), text: "USC writing supplement", done: false }, { id: genId(), text: "Major-specific portfolio if Annenberg", done: false }], notes: "Earliest of the private deadlines. Annenberg is the one to aim at for comms." }),
  mkSchool({ name: "Brown University", portal: "commonLetters", deadline: "2027-03-01", requires: ["as_transcript", "as_essay", "as_letters", "as_report"], supplements: [{ id: genId(), text: "Brown transfer supplement", done: false }], notes: "Two academic letters of evaluation required." }),
  mkSchool({ name: "Columbia University", portal: "commonLetters", deadline: "2027-03-01", requires: ["as_transcript", "as_essay", "as_letters", "as_report"], supplements: [{ id: genId(), text: "Columbia transfer supplement", done: false }], notes: "Two letters of evaluation. Columbia reads the reasons-for-transfer essay hard." }),
  mkSchool({ name: "Dartmouth College", portal: "commonLetters", deadline: "2027-03-01", requires: ["as_transcript", "as_essay", "as_letters", "as_report"], supplements: [{ id: genId(), text: "Dartmouth transfer supplement", done: false }], notes: "Two letters of evaluation. Small transfer class — a long shot worth taking." }),
  mkSchool({ name: "CSUN", portal: "csu", deadline: "2026-11-30", requires: ["as_transcript"], notes: "Northridge. Strong comms and media programs, and it's in LA." }),
  mkSchool({ name: "CSU Fullerton", portal: "csu", deadline: "2026-11-30", requires: ["as_transcript"], notes: "Impacted for some majors — check the local admission area rules." }),
  mkSchool({ name: "CSU Long Beach", portal: "csu", deadline: "2026-11-30", requires: ["as_transcript"], notes: "Impacted campus. Verify supplemental criteria for your major." }),
];

const mkAsset = (o) => ({ id: genId(), status: "not_started", notes: "", dueBy: null, ...o });
const SEED_ASSETS = [
  mkAsset({ id: "as_transcript", name: "Official De Anza transcripts", kind: "document", why: "Every application wants one. Order early — they take time.", dueBy: "2026-10-15" }),
  mkAsset({ id: "as_essay", name: "Common App personal essay", kind: "writing", why: "650 words, reused across every Common App school.", target: 650, dueBy: "2026-12-15" }),
  mkAsset({ id: "as_piq", name: "UC personal insight questions", kind: "writing", why: "4 answers × 350 words. Reused across all five UCs.", target: 1400, dueBy: "2026-11-15" }),
  mkAsset({ id: "as_activities", name: "Activities list + resume", kind: "document", why: "PUSO, La Voz, Local Color SJ, peer mentoring. Write it once, reuse everywhere.", dueBy: "2026-09-30" }),
  mkAsset({ id: "as_letters", name: "Two letters of evaluation", kind: "people", why: "Brown, Columbia and Dartmouth all require two. Ask by October.", dueBy: "2026-10-31" }),
  mkAsset({ id: "as_report", name: "College Report + registrar forms", kind: "document", why: "Common App schools need your current college to sign off.", dueBy: "2027-01-15" }),
  mkAsset({ id: "as_fafsa", name: "FAFSA / CA Dream Act", kind: "money", why: "Opens Oct 1. Nearly every scholarship asks whether you filed.", dueBy: "2026-10-15" }),
  mkAsset({ id: "as_tag", name: "UC TAG agreement", kind: "form", why: "Guaranteed admission to UCI and UCSB if you qualify. Filed in September only.", dueBy: "2026-09-30" }),
  mkAsset({ id: "as_portfolio", name: "Portfolio / work samples", kind: "writing", why: "Content, campaigns and clips for internships and USC Annenberg.", dueBy: "2026-11-01" }),
];

const ASSET_STATUS = {
  not_started: { label: "Not started", color: MUTED },
  in_progress: { label: "In progress", color: ACCENT },
  waiting: { label: "Waiting on someone", color: VIOLET },
  ready: { label: "Ready to send", color: GREEN },
};
const SCHOOL_STATUS = {
  not_started: { label: "Not started", color: MUTED },
  researching: { label: "Researching", color: SAGE },
  drafting: { label: "Drafting", color: ACCENT },
  submitted: { label: "Submitted", color: SAGE },
  accepted: { label: "Accepted", color: GREEN },
  waitlisted: { label: "Waitlisted", color: VIOLET },
  denied: { label: "Denied", color: RED },
};
const LETTER_STATUS = {
  not_asked: { label: "Haven't asked", color: MUTED },
  asked: { label: "Asked", color: ACCENT },
  agreed: { label: "They said yes", color: SAGE },
  submitted: { label: "Submitted", color: GREEN },
  declined: { label: "Declined", color: RED },
};

const AMBIENCE = [
  { id: "off", label: "Silent" },
  { id: "rain", label: "Rain" },
  { id: "fire", label: "Fire" },
  { id: "cafe", label: "Café" },
  { id: "wind", label: "Wind" },
];

/* ---- ambient sound, built straight on Web Audio so there's no library to load ---- */
function createAmbience() {
  let ctx = null, nodes = [];
  const stop = () => { nodes.forEach((n) => { try { n.stop ? n.stop() : n.disconnect(); } catch {} }); nodes = []; };
  const noiseBuffer = (c, kind) => {
    const len = c.sampleRate * 2;
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      if (kind === "brown") { last = (last + 0.02 * white) / 1.02; d[i] = last * 3.5; }
      else d[i] = white;
    }
    return buf;
  };
  const play = (kind, volume = 0.3) => {
    stop();
    if (kind === "off") return;
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx, kind === "rain" ? "white" : "brown");
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    if (kind === "rain") { filter.type = "bandpass"; filter.frequency.value = 1400; filter.Q.value = 0.5; gain.gain.value = volume * 0.8; }
    else if (kind === "fire") { filter.type = "lowpass"; filter.frequency.value = 700; gain.gain.value = volume; }
    else if (kind === "cafe") { filter.type = "lowpass"; filter.frequency.value = 400; gain.gain.value = volume * 1.1; }
    else { filter.type = "lowpass"; filter.frequency.value = 240; gain.gain.value = volume * 1.2; }
    src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    src.start();
    nodes = [src, filter, gain];
    if (kind === "fire") {
      const crackle = setInterval(() => {
        if (!ctx || nodes.length === 0) return clearInterval(crackle);
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.frequency.value = 90 + Math.random() * 260; g.gain.value = 0.0001;
        o.connect(g); g.connect(ctx.destination); o.start();
        g.gain.exponentialRampToValueAtTime(0.06 + Math.random() * 0.05, ctx.currentTime + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
        o.stop(ctx.currentTime + 0.14);
      }, 260);
      nodes.push({ stop: () => clearInterval(crackle) });
    }
  };
  return { play, stop };
}

/* ================= focus room ================= */

function FocusRoom({ open, onClose, tasks, sessions, onLog, orgById }) {
  const [len, setLen] = useState(25);
  const [left, setLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState("focus");
  const [round, setRound] = useState(0);
  const [taskId, setTaskId] = useState(null);
  const [sound, setSound] = useState("off");
  const [picking, setPicking] = useState(false);
  const audioRef = useRef(null);
  const startedRef = useRef(null);
  const live = useRef({ tasks, onLog, taskId, len, round, mode });
  live.current = { tasks, onLog, taskId, len, round, mode };

  useEffect(() => { if (!audioRef.current) audioRef.current = createAmbience(); }, []);
  useEffect(() => { if (!open) { audioRef.current && audioRef.current.stop(); setRunning(false); } }, [open]);
  useEffect(() => {
    if (!open) return;
    try { audioRef.current && (running ? audioRef.current.play(sound) : audioRef.current.stop()); } catch {}
  }, [sound, running, open]);
  useEffect(() => { setLeft(len * 60); }, [len]);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setLeft((s) => {
        if (s > 1) return s - 1;
        clearInterval(id);
        const l = live.current;
        if (l.mode === "focus") {
          const task = l.tasks.find((t) => t.id === l.taskId);
          l.onLog({ id: genId(), taskId: l.taskId, taskText: task ? task.text : "Unassigned", orgId: task ? task.orgId : null, minutes: l.len, at: Date.now() });
          setRound((r) => r + 1);
          setMode("break");
          return (l.round + 1) % 4 === 0 ? 15 * 60 : 5 * 60;
        }
        setMode("focus");
        return l.len * 60;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, mode]);

  if (!open) return null;
  const total = mode === "focus" ? len * 60 : (round % 4 === 0 && round > 0 ? 15 * 60 : 5 * 60);
  const pct = 1 - left / total;
  const R = 128, C = 2 * Math.PI * R;
  const task = tasks.find((t) => t.id === taskId);
  const loggedForTask = sessions.filter((s) => s.taskId === taskId).reduce((a, s) => a + s.minutes, 0);
  const org = task ? orgById(task.orgId) : null;

  return (
    <div className="focus-room" role="dialog" aria-label="Focus room">
      <div className="focus-stars" aria-hidden="true">
        {[...Array(30)].map((_, i) => <span key={i} style={{ left: `${(i * 37) % 100}%`, top: `${(i * 23) % 60}%`, animationDelay: `${i * 0.3}s` }} />)}
      </div>
      <button onClick={onClose} className="absolute top-5 right-5 flex items-center gap-1.5 text-sm" style={{ color: "rgba(247,234,210,0.7)" }} aria-label="Leave the focus room">
        <X size={18} /> Leave
      </button>

      <div className="text-center" style={{ zIndex: 2 }}>
        <div className="text-xs uppercase tracking-[0.3em] mb-1" style={{ color: mode === "focus" ? "#E8A93B" : "#A9C07C" }}>
          {mode === "focus" ? "Focus" : round % 4 === 0 ? "Long break" : "Break"}
        </div>
        <button onClick={() => setPicking((p) => !p)} className="text-lg font-semibold" style={{ color: "#F7EAD2" }}>
          {task ? task.text : "Pick something to work on"}
          {org && <span className="ml-2 rounded-full inline-block" style={{ width: 8, height: 8, background: org.color }} />}
        </button>
        {task && loggedForTask > 0 && <div className="text-xs mt-1" style={{ color: "rgba(247,234,210,0.55)" }}>{Math.floor(loggedForTask / 60)}h {loggedForTask % 60}m logged on this so far</div>}
      </div>

      {picking && (
        <div className="focus-picker" style={{ zIndex: 3 }}>
          <button onClick={() => { setTaskId(null); setPicking(false); }} className="w-full text-left px-4 py-2 text-sm" style={{ color: "rgba(247,234,210,0.7)" }}>Nothing in particular</button>
          {tasks.map((t) => {
            const mins = sessions.filter((s) => s.taskId === t.id).reduce((a, s) => a + s.minutes, 0);
            return (
              <button key={t.id} onClick={() => { setTaskId(t.id); setPicking(false); }} className="w-full text-left px-4 py-2 text-sm flex items-center gap-2" style={{ color: "#F7EAD2" }}>
                <span className="rounded-full" style={{ width: 7, height: 7, background: orgById(t.orgId)?.color || "#E8A93B" }} />
                <span className="flex-1 truncate">{t.text}</span>
                {mins > 0 && <span className="text-xs" style={{ color: "rgba(247,234,210,0.5)" }}>{mins}m</span>}
              </button>
            );
          })}
        </div>
      )}

      <div style={{ position: "relative", width: 300, height: 300, zIndex: 2 }}>
        <svg width="300" height="300" style={{ transform: "rotate(-90deg)" }} aria-hidden="true">
          <circle cx="150" cy="150" r={R} fill="none" stroke="rgba(247,234,210,0.13)" strokeWidth="10" />
          <circle cx="150" cy="150" r={R} fill="none" stroke={mode === "focus" ? "#E8A93B" : "#A9C07C"} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - pct)} style={{ transition: "stroke-dashoffset 1s linear", filter: "drop-shadow(0 0 12px rgba(232,169,59,0.5))" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-display font-bold" style={{ fontSize: 64, color: "#F7EAD2", letterSpacing: "-0.03em" }}>
            {pad2(Math.floor(left / 60))}:{pad2(left % 60)}
          </div>
          <div className="flex gap-1.5 mt-2">
            {[0, 1, 2, 3].map((i) => <span key={i} className="rounded-full" style={{ width: 8, height: 8, background: i < round % 4 || (round > 0 && round % 4 === 0) ? "#E8A93B" : "rgba(247,234,210,0.2)" }} />)}
          </div>
        </div>
      </div>

      {mode === "break" ? (
        <div className="flex flex-col items-center gap-3" style={{ zIndex: 2 }}>
          <div style={{ width: 70, height: 70, borderRadius: "50%", background: "radial-gradient(circle,#A9C07C,#4A7BA7)", animation: "breatheCircle 10s ease-in-out infinite", opacity: 0.8 }} />
          <div className="text-sm" style={{ color: "rgba(247,234,210,0.8)" }}>Look away from the screen. Breathe.</div>
          <button onClick={() => { setMode("focus"); setLeft(len * 60); }} className="text-xs" style={{ color: "rgba(247,234,210,0.4)" }}>Skip the break anyway</button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4" style={{ zIndex: 2 }}>
          <Mascot state={running ? "sleepy" : "neutral"} size={54} />
          <div className="flex items-center gap-4">
            <button onClick={() => { setRunning((r) => !r); if (!running) startedRef.current = Date.now(); }}
              className="rounded-full flex items-center justify-center" aria-label={running ? "Pause" : "Start"}
              style={{ width: 62, height: 62, background: "#E8A93B", color: "#2A1C12" }}>
              {running ? <Pause size={26} /> : <Play size={26} style={{ marginLeft: 3 }} />}
            </button>
            <button onClick={() => { setRunning(false); setLeft(len * 60); }} aria-label="Reset" style={{ color: "rgba(247,234,210,0.6)" }}><RotateCcw size={20} /></button>
          </div>
          <div className="flex gap-1.5">
            {[15, 25, 50, 90].map((m) => (
              <button key={m} onClick={() => { setLen(m); setRunning(false); }} className="text-xs px-3 py-1 rounded-full"
                style={{ border: `1px solid ${len === m ? "#E8A93B" : "rgba(247,234,210,0.2)"}`, color: len === m ? "#E8A93B" : "rgba(247,234,210,0.6)" }}>{m}m</button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-1.5 flex-wrap justify-center" style={{ zIndex: 2 }}>
        {AMBIENCE.map((a) => (
          <button key={a.id} onClick={() => setSound(a.id)} className="text-xs px-3 py-1.5 rounded-full"
            style={{ border: `1px solid ${sound === a.id ? "#A9C07C" : "rgba(247,234,210,0.18)"}`, color: sound === a.id ? "#A9C07C" : "rgba(247,234,210,0.55)" }}>{a.label}</button>
        ))}
      </div>
      {sound !== "off" && !running && <div className="text-xs" style={{ color: "rgba(247,234,210,0.4)", zIndex: 2 }}>Sound starts when the timer does.</div>}
    </div>
  );
}

/* ================= essay workshop ================= */

const wordCount = (s) => (s || "").trim().split(/\s+/).filter(Boolean).length;

function EssayWorkshop({ open, note, onClose, onSave, snippets, onAddSnippet, onDeleteSnippet }) {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState(650);
  const [drawer, setDrawer] = useState(false);
  const [sel, setSel] = useState("");
  const areaRef = useRef(null);
  useEffect(() => {
    if (!note) return;
    setText(note.text || ""); setTitle(note.title || "Untitled essay"); setTarget(note.wordTarget || 650);
  }, [note]);
  const latest = useRef({ text, title, target, onSave });
  latest.current = { text, title, target, onSave };
  useEffect(() => {
    if (!open) return;
    const flush = () => { const l = latest.current; l.onSave({ text: l.text, title: l.title, wordTarget: l.target }); };
    const t = setInterval(flush, 4000);
    return () => { clearInterval(t); flush(); };
  }, [open]);
  if (!open || !note) return null;
  const wc = wordCount(text);
  const pct = target ? clamp(wc / target, 0, 1) : 0;
  const over = target && wc > target;
  const captureSelection = () => {
    const el = areaRef.current; if (!el) return;
    const s = text.slice(el.selectionStart, el.selectionEnd).trim();
    setSel(s);
  };
  const insert = (snippetText) => {
    const el = areaRef.current;
    const pos = el ? el.selectionStart : text.length;
    setText(text.slice(0, pos) + (pos > 0 && text[pos - 1] !== "\n" ? "\n\n" : "") + snippetText + text.slice(pos));
    setDrawer(false);
  };
  return (
    <div className="workshop" role="dialog" aria-label="Essay workshop">
      <div className="workshop-bar" style={{ borderBottom: `1px solid ${BORDER}`, background: HEADER_BG }}>
        <IconBtn label="Close the workshop" onClick={() => { onSave({ text, title, wordTarget: target }); onClose(); }}><X size={18} /></IconBtn>
        <input value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Essay title"
          className="flex-1 text-sm font-semibold outline-none" style={{ background: "transparent", color: TEXT }} />
        <div className="flex items-center gap-2">
          <input type="number" value={target} onChange={(e) => setTarget(Number(e.target.value) || 0)} aria-label="Word target"
            className="w-16 text-xs rounded-lg px-2 py-1 outline-none" style={fieldStyle()} />
          <span className="text-xs font-display font-bold" style={{ color: over ? RED : wc >= target * 0.9 ? GREEN : MUTED }}>{wc}</span>
          <ProgressRing percent={pct} size={30} color={over ? RED : ACCENT} track={BORDER_SOFT} />
        </div>
      </div>
      <div className="workshop-body">
        <textarea ref={areaRef} value={text} onChange={(e) => setText(e.target.value)} onSelect={captureSelection}
          placeholder="Start anywhere. You can fix the opening later." aria-label="Essay text" className="workshop-area" spellCheck />
      </div>
      <div className="workshop-foot" style={{ borderTop: `1px solid ${BORDER}`, background: HEADER_BG }}>
        {sel ? (
          <button onClick={() => { onAddSnippet(sel, title); setSel(""); }} className="text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1" style={{ background: ACCENT, color: ACCENT_TEXT }}>
            <Plus size={12} /> Save selection as a reusable blurb
          </button>
        ) : (
          <span className="text-xs" style={{ color: MUTED }}>Select any paragraph to save it as a reusable blurb.</span>
        )}
        <button onClick={() => setDrawer((d) => !d)} className="ml-auto text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1" style={{ border: `1px solid ${BORDER}`, color: TEXT }}>
          <Copy size={12} /> Blurbs ({snippets.length})
        </button>
      </div>
      {drawer && (
        <div className="workshop-drawer" style={{ background: CARD, borderTop: `1.5px solid ${BORDER}` }}>
          <div className="text-xs font-semibold px-4 py-2" style={{ color: MUTED }}>Tap one to drop it in where your cursor is</div>
          {snippets.length === 0 && <div className="px-4 pb-4 text-sm" style={{ color: MUTED }}>No blurbs yet. Highlight a paragraph you'll want again and save it.</div>}
          {snippets.map((s) => (
            <div key={s.id} className="px-4 py-2 flex items-start gap-2" style={{ borderTop: `1px solid ${BORDER_SOFT}` }}>
              <button onClick={() => insert(s.text)} className="flex-1 text-left">
                <div className="text-xs font-semibold" style={{ color: GOLD }}>{s.label}</div>
                <div className="text-xs" style={{ color: MUTED }}>{s.text.slice(0, 110)}{s.text.length > 110 ? "…" : ""}</div>
              </button>
              <IconBtn label="Delete blurb" onClick={() => onDeleteSnippet(s.id)}><Trash2 size={13} /></IconBtn>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= shared requirements (assets) ================= */

function AssetCardImpl({ asset, unblocks, onStatus, onNote, onOpenEssay }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(asset.notes || "");
  const meta = ASSET_STATUS[asset.status];
  const days = asset.dueBy ? daysUntil(asset.dueBy) : null;
  return (
    <div className="rounded-2xl p-3 mb-2 lift" style={cardStyle({ borderLeft: `4px solid ${meta.color}` })}>
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <div className="text-sm font-semibold">{asset.name}</div>
          <div className="text-xs mt-0.5" style={{ color: MUTED }}>{asset.why}</div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${INPUT_BG}`, color: unblocks > 0 ? GOLD : MUTED }}>
              unlocks {unblocks} application{unblocks === 1 ? "" : "s"}
            </span>
            {days !== null && <span className="text-xs font-semibold" style={{ color: days < 0 ? RED : days < 21 ? CORAL : MUTED }}>{days < 0 ? `${-days}d late` : `${days}d left`}</span>}
          </div>
        </div>
        <select value={asset.status} onChange={(e) => onStatus(e.target.value)} aria-label={`Status for ${asset.name}`}
          className="text-xs rounded-lg px-2 py-1 outline-none font-semibold" style={{ ...fieldStyle(), color: meta.color }}>
          {Object.entries(ASSET_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <button onClick={() => setOpen((o) => !o)} className="text-xs" style={{ color: MUTED }}>{open ? "Hide notes" : "Notes"}</button>
        {asset.kind === "writing" && (
          <button onClick={onOpenEssay} className="text-xs font-semibold flex items-center gap-1 ml-auto px-2 py-1 rounded-lg" style={{ background: ACCENT_SOFT, color: GOLD }}>
            <Pencil size={11} /> Open in the workshop
          </button>
        )}
      </div>
      {open && (
        <textarea value={note} onChange={(e) => setNote(e.target.value)} onBlur={() => onNote(note)} rows={3} aria-label={`Notes for ${asset.name}`}
          placeholder="Where it lives, who you asked, what's left…" className="w-full rounded-lg px-2 py-1.5 text-xs outline-none resize-none mt-2" style={fieldStyle()} />
      )}
    </div>
  );
}

function AssetsPanel({ assets, schools, applications, onStatus, onNote, onOpenEssay }) {
  const unblockCount = (id) => schools.filter((s) => (s.requires || []).includes(id) && !["accepted", "denied", "submitted"].includes(s.status)).length
    + applications.filter((a) => (a.requires || []).includes(id) && !["accepted", "rejected"].includes(a.status)).length;
  const ready = assets.filter((a) => a.status === "ready").length;
  const sorted = [...assets].sort((a, b) => unblockCount(b.id) - unblockCount(a.id));
  return (
    <div>
      <div className="rounded-2xl p-4 mb-3" style={cardStyle()}>
        <div className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: GOLD }}>Build once, send everywhere</div>
        <div className="text-sm mb-2" style={{ color: MUTED }}>These are the pieces every application asks for. Finish one and it clears the way for all of them.</div>
        <MeterBar percent={assets.length ? ready / assets.length : 0} color={GREEN} height={8} />
        <div className="text-xs mt-1" style={{ color: MUTED }}>{ready} of {assets.length} ready to send</div>
      </div>
      {sorted.map((a) => (
        <AssetCard key={a.id} asset={a} unblocks={unblockCount(a.id)} onStatus={(s) => onStatus(a.id, s)} onNote={(n) => onNote(a.id, n)} onOpenEssay={() => onOpenEssay(a)} />
      ))}
    </div>
  );
}

/* ================= letters of recommendation ================= */

function LetterTracker({ letters, schools, onAdd, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(""); const [role, setRole] = useState(""); const [askBy, setAskBy] = useState("2026-10-15");
  const needsTwo = schools.filter((s) => s.portal === "commonLetters");
  const submitted = letters.filter((l) => l.status === "submitted").length;
  const add = (e) => { e.preventDefault(); if (!name.trim()) return; onAdd({ name: name.trim(), role: role.trim(), askBy, status: "not_asked", notes: "" }); setName(""); setRole(""); setOpen(false); };
  return (
    <div>
      <div className="rounded-2xl p-4 mb-3" style={cardStyle({ borderLeft: `4px solid ${VIOLET}` })}>
        <div className="text-sm font-semibold mb-1">Letters are the long pole</div>
        <div className="text-xs mb-2" style={{ color: MUTED }}>
          {needsTwo.length} of your schools want two academic letters of evaluation — {needsTwo.map((s) => s.name.split(" ")[0]).join(", ")}. Professors need weeks, not days. Ask in October.
        </div>
        <div className="flex items-center gap-2">
          <MeterBar percent={letters.length ? submitted / Math.max(2, letters.length) : 0} color={VIOLET} height={7} />
          <span className="text-xs whitespace-nowrap" style={{ color: MUTED }}>{submitted} submitted</span>
        </div>
      </div>
      {letters.length === 0 && <SectionEmpty text="No recommenders yet. Two professors who've seen your written work are the safest bet." />}
      {letters.map((l) => {
        const meta = LETTER_STATUS[l.status];
        const days = l.askBy ? daysUntil(l.askBy) : null;
        return (
          <div key={l.id} className="rounded-xl p-3 mb-2 task-row" style={cardStyle({ borderLeft: `4px solid ${meta.color}` })}>
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <div className="text-sm font-semibold">{l.name}</div>
                <div className="text-xs" style={{ color: MUTED }}>{l.role || "Recommender"}</div>
              </div>
              <select value={l.status} onChange={(e) => onUpdate(l.id, { status: e.target.value })} aria-label={`Status for ${l.name}`}
                className="text-xs rounded-lg px-2 py-1 outline-none font-semibold" style={{ ...fieldStyle(), color: meta.color }}>
                {Object.entries(LETTER_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <span className="row-actions"><IconBtn label={`Delete ${l.name}`} onClick={() => onDelete(l.id)}><Trash2 size={14} /></IconBtn></span>
            </div>
            {l.status !== "submitted" && days !== null && (
              <div className="text-xs mt-1 font-semibold" style={{ color: days < 0 ? RED : days < 14 ? CORAL : MUTED }}>
                {l.status === "not_asked" ? (days < 0 ? `Should have asked ${-days}d ago` : `Ask within ${days}d`) : `Nudge them — ${days}d until you said you'd follow up`}
              </div>
            )}
            <input defaultValue={l.notes} onBlur={(e) => onUpdate(l.id, { notes: e.target.value })} placeholder="What you sent them, what they said…" aria-label={`Notes about ${l.name}`}
              className="w-full rounded-lg px-2 py-1.5 text-xs outline-none mt-2" style={fieldStyle()} />
          </div>
        );
      })}
      {open ? (
        <form onSubmit={add} className="rounded-2xl p-4 flex flex-col gap-2" style={cardStyle()}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Professor's name" aria-label="Name" className="rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
          <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Course or how they know your work" aria-label="Role" className="rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
          <label className="text-xs" style={{ color: MUTED }}>Ask them by<input type="date" value={askBy} onChange={(e) => setAskBy(e.target.value)} className="w-full rounded-lg px-2 py-2 text-sm outline-none mt-1" style={fieldStyle()} /></label>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm" style={{ border: `1px solid ${BORDER}`, color: MUTED }}>Cancel</button>
            <button type="submit" className="rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: ACCENT, color: ACCENT_TEXT }}>Add recommender</button>
          </div>
        </form>
      ) : (
        <button onClick={() => setOpen(true)} className="w-full rounded-2xl py-3 flex items-center justify-center gap-2 text-sm font-semibold" style={{ border: `1.5px dashed ${BORDER}`, color: MUTED }}>
          <Plus size={16} /> Add a recommender
        </button>
      )}
    </div>
  );
}

/* ================= transfer world ================= */

function SchoolRowImpl({ school, assets, onUpdate, onDelete, onToggleSupp, onAddSupp, onWriteSupp }) {
  const [open, setOpen] = useState(false);
  const [supp, setSupp] = useState("");
  const meta = SCHOOL_STATUS[school.status];
  const days = school.deadline ? daysUntil(school.deadline) : null;
  const missing = (school.requires || []).map((id) => assets.find((a) => a.id === id)).filter((a) => a && a.status !== "ready");
  const suppDone = (school.supplements || []).filter((s) => s.done).length;
  return (
    <div className="rounded-xl mb-2 overflow-hidden task-row" style={cardStyle({ borderLeft: `4px solid ${meta.color}` })}>
      <div className="flex items-center gap-2 p-3">
        <button onClick={() => setOpen((o) => !o)} className="flex-1 text-left" aria-expanded={open}>
          <div className="text-sm font-semibold flex items-center gap-1.5">
            {school.name}
            {school.tag && <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: `${GREEN}22`, color: GREEN }}>TAG</span>}
          </div>
          <div className="text-xs flex items-center gap-2 mt-0.5" style={{ color: MUTED }}>
            <span style={{ color: meta.color, fontWeight: 700 }}>{meta.label}</span>
            {school.deadline && <span style={{ color: days !== null && days < 30 ? CORAL : MUTED }}>· {fmtDayShort(school.deadline + "T12:00:00")}{days !== null && days >= 0 ? ` (${days}d)` : ""}</span>}
            {school.verify && <span style={{ color: CORAL }}>· verify date</span>}
          </div>
        </button>
        {missing.length > 0 && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: INPUT_BG, color: CORAL }}>{missing.length} missing</span>}
        <ChevronDown size={16} style={{ color: MUTED, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </div>
      {open && (
        <div className="px-3 pb-3" style={{ borderTop: `1px dashed ${BORDER}` }}>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <select value={school.status} onChange={(e) => onUpdate({ status: e.target.value })} aria-label={`Status for ${school.name}`}
              className="text-xs rounded-lg px-2 py-1 outline-none font-semibold" style={{ ...fieldStyle(), color: meta.color }}>
              {Object.entries(SCHOOL_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <input type="date" value={school.deadline || ""} onChange={(e) => onUpdate({ deadline: e.target.value || null })} aria-label="Deadline"
              className="text-xs rounded-lg px-2 py-1 outline-none" style={fieldStyle()} />
            {school.verify && (
              <button onClick={() => onUpdate({ verify: false })} className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: ACCENT_SOFT, color: GOLD }}>
                I checked the official site
              </button>
            )}
            <span className="row-actions ml-auto"><IconBtn label={`Remove ${school.name}`} onClick={onDelete}><Trash2 size={14} /></IconBtn></span>
          </div>

          {missing.length > 0 && (
            <div className="mt-2 rounded-lg p-2" style={{ background: INPUT_BG }}>
              <div className="text-xs font-semibold mb-1" style={{ color: CORAL }}>Still needs</div>
              {missing.map((a) => <div key={a.id} className="text-xs" style={{ color: MUTED }}>· {a.name} — {ASSET_STATUS[a.status].label.toLowerCase()}</div>)}
            </div>
          )}

          <div className="mt-2">
            <div className="text-xs font-semibold mb-1" style={{ color: MUTED }}>
              School-specific work {(school.supplements || []).length > 0 && `(${suppDone}/${school.supplements.length})`}
            </div>
            {(school.supplements || []).map((s) => (
              <div key={s.id} className="flex items-center gap-2 py-1">
                <button onClick={() => onToggleSupp(s.id)} aria-pressed={s.done} aria-label={s.text} style={{ color: s.done ? GREEN : MUTED }}>{s.done ? <CheckCircle2 size={14} /> : <Circle size={14} />}</button>
                <span className="text-xs flex-1" style={{ color: s.done ? MUTED : TEXT, textDecoration: s.done ? "line-through" : "none" }}>{s.text}</span>
                {s.words > 0 && <span className="text-xs font-display" style={{ color: MUTED }}>{s.words}w</span>}
                <button onClick={() => onWriteSupp(s)} className="text-xs font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1" style={{ background: ACCENT_SOFT, color: GOLD }}>
                  <Pencil size={10} /> Write
                </button>
              </div>
            ))}
            <form onSubmit={(e) => { e.preventDefault(); if (!supp.trim()) return; onAddSupp(supp.trim()); setSupp(""); }} className="flex gap-2 mt-1">
              <input value={supp} onChange={(e) => setSupp(e.target.value)} placeholder="Add a supplement or task…" aria-label="New supplement"
                className="flex-1 rounded-lg px-2 py-1 text-xs outline-none" style={fieldStyle()} />
              <button type="submit" aria-label="Add" className="rounded-lg px-2" style={{ background: INPUT_BG, color: MUTED, border: `1px solid ${BORDER}` }}><Plus size={12} /></button>
            </form>
          </div>

          <textarea defaultValue={school.notes} onBlur={(e) => onUpdate({ notes: e.target.value })} rows={2} aria-label={`Notes about ${school.name}`}
            placeholder="Why this school, who you talked to, what they care about…" className="w-full rounded-lg px-2 py-1.5 text-xs outline-none resize-none mt-2" style={fieldStyle()} />
        </div>
      )}
    </div>
  );
}

function PortalGroup({ portalId, schools, assets, sharedDone, onToggleShared, defaultOpen, ...handlers }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const meta = PORTAL_META[portalId];
  const work = SHARED_WORK[portalId] || [];
  const doneCount = work.filter((w) => sharedDone[w.id]).length;
  const submitted = schools.filter((s) => ["submitted", "accepted", "waitlisted", "denied"].includes(s.status)).length;
  const soonest = schools.map((s) => (s.deadline ? daysUntil(s.deadline) : null)).filter((d) => d !== null && d >= 0).sort((a, b) => a - b)[0];
  return (
    <div className="rounded-2xl mb-3 overflow-hidden" style={cardStyle({ borderTop: `4px solid ${meta.color}` })}>
      <button onClick={() => setOpen((o) => !o)} className="w-full text-left p-4" aria-expanded={open}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="font-display text-base font-bold" style={{ color: TEXT }}>{meta.name}</div>
            <div className="text-xs mt-0.5" style={{ color: MUTED }}>{meta.window}</div>
          </div>
          <div className="text-right">
            <div className="font-display text-lg font-bold" style={{ color: soonest !== undefined && soonest < 45 ? CORAL : TEXT }}>{soonest !== undefined ? `${soonest}d` : "—"}</div>
            <div className="text-xs" style={{ color: MUTED }}>{submitted}/{schools.length} sent</div>
          </div>
        </div>
        <div className="flex gap-1 mt-2">
          <div className="flex-1"><MeterBar percent={work.length ? doneCount / work.length : 0} color={meta.color} height={6} /></div>
          <ChevronDown size={16} style={{ color: MUTED, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4">
          <div className="text-xs mb-3 rounded-lg p-2" style={{ background: INPUT_BG, color: MUTED }}>{meta.note}</div>
          <div className="text-xs uppercase tracking-widest font-semibold mb-1.5" style={{ color: meta.color }}>Work that counts for all of them</div>
          {work.map((w) => (
            <div key={w.id} className="flex items-center gap-2 py-1">
              <button onClick={() => onToggleShared(w.id)} aria-pressed={!!sharedDone[w.id]} aria-label={w.text} style={{ color: sharedDone[w.id] ? GREEN : MUTED }}>
                {sharedDone[w.id] ? <CheckCircle2 size={15} /> : <Circle size={15} />}
              </button>
              <span className="text-xs flex-1" style={{ color: sharedDone[w.id] ? MUTED : TEXT, textDecoration: sharedDone[w.id] ? "line-through" : "none" }}>{w.text}</span>
              {w.target > 0 && <span className="text-xs" style={{ color: MUTED }}>{w.target}w</span>}
            </div>
          ))}
          {portalId === "uc" && (
            <div className="rounded-lg p-2 mt-2" style={{ background: INPUT_BG }}>
              <div className="text-xs font-semibold mb-1" style={{ color: MUTED }}>The eight topics — pick four</div>
              <div className="flex flex-wrap gap-1">{UC_PIQ_TOPICS.map((t, i) => <span key={t} className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: CARD, color: MUTED, border: `1px solid ${BORDER}` }}>{i + 1}. {t}</span>)}</div>
            </div>
          )}
          <a href={meta.site} target="_blank" rel="noreferrer" className="text-xs font-semibold flex items-center gap-1 mt-2" style={{ color: GOLD }}>
            Open the portal <ExternalLink size={11} />
          </a>
          <div className="text-xs uppercase tracking-widest font-semibold mt-4 mb-1.5" style={{ color: meta.color }}>Schools</div>
          {schools.map((s) => (
            <SchoolRow key={s.id} school={s} assets={assets}
              onUpdate={(patch) => handlers.onUpdate(s.id, patch)} onDelete={() => handlers.onDelete(s.id)}
              onToggleSupp={(sid) => handlers.onToggleSupp(s.id, sid)} onAddSupp={(text) => handlers.onAddSupp(s.id, text)}
              onWriteSupp={(sp) => handlers.onWriteSupp(s, sp)} />
          ))}
        </div>
      )}
    </div>
  );
}

const TIMELINE_MARKS = [
  { at: "2026-09-30", label: "TAG", detail: "UC TAG closes — UCI + UCSB" },
  { at: "2026-11-30", label: "UC + CSU", detail: "UC and Cal State Apply close" },
  { at: "2026-12-09", label: "Cooke", detail: "Jack Kent Cooke closes" },
  { at: "2027-02-15", label: "USC", detail: "USC transfer closes" },
  { at: "2027-03-01", label: "Ivies", detail: "Brown, Columbia, Dartmouth, BU, Northwestern" },
  { at: "2027-04-01", label: "NYU", detail: "NYU closes" },
  { at: "2027-06-30", label: "LA", detail: "De Anza ends — move" },
];

function YearArc({ now }) {
  const start = new Date("2026-08-01T00:00:00").getTime();
  const end = new Date("2027-06-30T00:00:00").getTime();
  const W = 340, H = 92;
  const posOf = (t) => clamp((t - start) / (end - start), 0, 1);
  const p = posOf(now.getTime());
  const [hover, setHover] = useState(null);
  return (
    <div className="rounded-2xl p-3 mb-3" style={cardStyle()}>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: GOLD }}>The whole run</div>
        <div className="text-xs" style={{ color: MUTED }}>Aug 2026 → Jun 2027</div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", overflow: "visible" }} role="img" aria-label="Application timeline">
        <path d={`M 8 ${H - 22} Q ${W / 2} ${H - 68} ${W - 8} ${H - 26}`} fill="none" style={{ stroke: BORDER }} strokeWidth="2" />
        {TIMELINE_MARKS.map((m) => {
          const x = 8 + posOf(new Date(m.at + "T00:00:00").getTime()) * (W - 16);
          const passed = new Date(m.at) < now;
          return (
            <g key={m.at} onMouseEnter={() => setHover(m)} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }}>
              <line x1={x} y1={H - 34} x2={x} y2={H - 14} style={{ stroke: passed ? BORDER : CORAL }} strokeWidth="1.5" />
              <circle cx={x} cy={H - 36} r="3.5" style={{ fill: passed ? BORDER : CORAL }} />
              <text x={x} y={H - 3} textAnchor="middle" style={{ fill: MUTED, fontSize: 8 }}>{m.label}</text>
            </g>
          );
        })}
        <g>
          <circle cx={8 + p * (W - 16)} cy={H - 48} r="14" fill="url(#sunGlow)" opacity="0.6" />
          <circle cx={8 + p * (W - 16)} cy={H - 48} r="7" style={{ fill: ACCENT }} />
          <text x={8 + p * (W - 16)} y={H - 62} textAnchor="middle" className="font-display" style={{ fill: TEXT, fontSize: 9, fontWeight: 700 }}>you're here</text>
        </g>
      </svg>
      <div className="text-xs text-center mt-1" style={{ color: hover ? TEXT : MUTED, minHeight: 16 }}>{hover ? hover.detail : "Tap a marker to see what it is"}</div>
    </div>
  );
}

function MoneyCounter({ applications }) {
  const open = applications.filter((a) => a.type === "scholarship" && !["rejected"].includes(a.status));
  const inFlight = open.filter((a) => ["applied", "waitlisted"].includes(a.status));
  const won = applications.filter((a) => a.type === "scholarship" && a.status === "accepted");
  const sum = (list) => list.reduce((s, a) => s + (a.amountValue || 0), 0);
  const potential = sum(open), applied = sum(inFlight), secured = sum(won);
  return (
    <div className="rounded-2xl p-5 mb-3 text-center" style={cardStyle({ borderTop: `4px solid ${GREEN}` })}>
      <div className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: GOLD }}>On the table</div>
      <div className="font-display text-4xl font-bold" style={{ color: TEXT, letterSpacing: "-0.03em" }}>{money(potential)}</div>
      <div className="text-xs mt-1" style={{ color: MUTED }}>across {open.length} scholarship{open.length === 1 ? "" : "s"} still in play</div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="rounded-xl p-2" style={{ background: CARD_2, border: `1px solid ${BORDER_SOFT}` }}>
          <div className="font-display text-lg font-bold" style={{ color: ACCENT }}>{money(applied)}</div>
          <div className="text-xs" style={{ color: MUTED }}>applied for, waiting</div>
        </div>
        <div className="rounded-xl p-2" style={{ background: CARD_2, border: `1px solid ${BORDER_SOFT}` }}>
          <div className="font-display text-lg font-bold" style={{ color: GREEN }}>{money(secured)}</div>
          <div className="text-xs" style={{ color: MUTED }}>actually won</div>
        </div>
      </div>
      {secured === 0 && potential > 0 && <div className="text-xs mt-3" style={{ color: MUTED }}>Every one of these is a lottery ticket you have to fill out by hand. Keep going.</div>}
    </div>
  );
}

function ApplyDoor({ title, subtitle, color, stat, statLabel, percent, onClick, icon: Icon }) {
  return (
    <button onClick={onClick} className="w-full rounded-2xl p-4 mb-2.5 text-left lift relative overflow-hidden" style={cardStyle({ borderLeft: `5px solid ${color}` })}>
      <div style={{ position: "absolute", right: -18, top: -18, width: 96, height: 96, borderRadius: "50%", background: color, opacity: 0.08 }} />
      <div className="flex items-center gap-3">
        <span className="rounded-xl flex items-center justify-center" style={{ width: 42, height: 42, background: `${color}1F`, color }}><Icon size={20} /></span>
        <div className="flex-1">
          <div className="font-display text-base font-bold" style={{ color: TEXT }}>{title}</div>
          <div className="text-xs" style={{ color: MUTED }}>{subtitle}</div>
        </div>
        <div className="text-right">
          <div className="font-display text-xl font-bold" style={{ color: TEXT }}>{stat}</div>
          <div className="text-xs" style={{ color: MUTED }}>{statLabel}</div>
        </div>
      </div>
      <div className="mt-3"><MeterBar percent={percent} color={color} height={6} /></div>
    </button>
  );
}

/* ================= sunday review ================= */

function SundayReview({ open, onClose, stats, unfinished, reflections, onRollForward, onDrop, onSetFocus, onSave }) {
  const [step, setStep] = useState(0);
  const [handled, setHandled] = useState({});
  const [oneThing, setOneThing] = useState("");
  useEffect(() => { if (open) { setStep(0); setHandled({}); setOneThing(""); } }, [open]);
  if (!open) return null;
  const steps = ["Look back", "Loose ends", "Next week", "Done"];
  const week = reflections.filter((r) => r.date >= todayStr(addDays(new Date(), -6)));
  const avgEnergy = week.length ? (week.reduce((s, r) => s + r.energy, 0) / week.length).toFixed(1) : "—";
  const remaining = unfinished.filter((t) => !handled[t.id]);
  return (
    <div className="review-room" role="dialog" aria-label="Weekly review">
      <div className="review-card" style={{ background: CARD, border: `1.5px solid ${BORDER}`, boxShadow: SHADOW_LG }}>
        <div className="flex items-center gap-2 px-5 pt-4">
          {steps.map((s, i) => <div key={s} className="flex-1 rounded-full" style={{ height: 4, background: i <= step ? ACCENT : BORDER_SOFT }} />)}
          <IconBtn label="Close review" onClick={onClose}><X size={16} /></IconBtn>
        </div>
        <div className="px-5 py-4" style={{ minHeight: 320 }}>
          {step === 0 && (
            <>
              <Mascot state="happy" size={54} />
              <div className="font-display text-xl font-bold mt-2" style={{ color: TEXT }}>Here's your week, Daen</div>
              <div className="text-sm mb-4" style={{ color: MUTED }}>No judgement in this part. Just the record.</div>
              <div className="grid grid-cols-2 gap-2">
                {[[stats.tasks, "tasks finished"], [stats.sessions, "focus sessions"], [`${stats.hours}h`, "time logged"], [avgEnergy, "average energy"]].map(([v, l]) => (
                  <div key={l} className="rounded-xl p-3" style={{ background: CARD_2, border: `1px solid ${BORDER_SOFT}` }}>
                    <div className="font-display text-2xl font-bold" style={{ color: TEXT }}>{v}</div>
                    <div className="text-xs" style={{ color: MUTED }}>{l}</div>
                  </div>
                ))}
              </div>
              {week.filter((r) => r.win).length > 0 && (
                <div className="mt-3">
                  <div className="text-xs font-semibold mb-1" style={{ color: GOLD }}>Wins you wrote down</div>
                  {week.filter((r) => r.win).slice(0, 3).map((r) => <div key={r.id} className="text-sm py-0.5">· {r.win}</div>)}
                </div>
              )}
            </>
          )}
          {step === 1 && (
            <>
              <div className="font-display text-xl font-bold" style={{ color: TEXT }}>Loose ends</div>
              <div className="text-sm mb-3" style={{ color: MUTED }}>
                {remaining.length === 0 ? "Nothing left hanging. That's rare — enjoy it." : "Move it to next week or let it go. Both are fine answers."}
              </div>
              {remaining.map((t) => (
                <div key={t.id} className="flex items-center gap-2 py-1.5" style={{ borderBottom: `1px solid ${BORDER_SOFT}` }}>
                  <span className="text-sm flex-1">{t.text}</span>
                  <button onClick={() => { onRollForward(t); setHandled((h) => ({ ...h, [t.id]: 1 })); }} className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: ACCENT_SOFT, color: GOLD }}>Keep it</button>
                  <button onClick={() => { onDrop(t); setHandled((h) => ({ ...h, [t.id]: 1 })); }} className="text-xs px-2 py-1 rounded-full" style={{ border: `1px solid ${BORDER}`, color: MUTED }}>Let go</button>
                </div>
              ))}
            </>
          )}
          {step === 2 && (
            <>
              <div className="font-display text-xl font-bold" style={{ color: TEXT }}>One thing for next week</div>
              <div className="text-sm mb-3" style={{ color: MUTED }}>Not a list. The single thing that would make next week count.</div>
              <input value={oneThing} onChange={(e) => setOneThing(e.target.value)} placeholder="Finish the Cooke essay draft" aria-label="Next week's focus"
                className="w-full rounded-lg px-3 py-3 text-sm outline-none" style={fieldStyle()} />
              <div className="text-xs mt-2" style={{ color: MUTED }}>This becomes your focus on the Today screen.</div>
            </>
          )}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: 260 }}>
              <Mascot state="excited" size={72} />
              <div className="font-display text-xl font-bold mt-3" style={{ color: TEXT }}>That's the week closed</div>
              <div className="text-sm mt-1" style={{ color: MUTED }}>See you Monday.</div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 px-5 pb-5">
          {step > 0 && step < 3 && <button onClick={() => setStep((s) => s - 1)} className="text-sm px-3 py-2 rounded-lg" style={{ border: `1px solid ${BORDER}`, color: MUTED }}>Back</button>}
          <button onClick={() => {
            if (step === 2 && oneThing.trim()) onSetFocus(oneThing.trim());
            if (step === 2) onSave({ id: genId(), at: Date.now(), week: todayStr(), oneThing: oneThing.trim(), tasks: stats.tasks, hours: stats.hours });
            if (step === 3) { onClose(); return; }
            setStep((s) => s + 1);
          }} className="flex-1 text-sm font-semibold px-3 py-2 rounded-lg" style={{ background: ACCENT, color: ACCENT_TEXT }}>
            {step === 3 ? "Close" : step === 2 ? "Lock it in" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= shareable week card ================= */

function exportWeekCard({ tasks, streak, hours, win, oneThing, dark }) {
  const c = document.createElement("canvas");
  c.width = 1080; c.height = 1350;
  const x = c.getContext("2d");
  const g = x.createLinearGradient(0, 0, 0, 1350);
  if (dark) { g.addColorStop(0, "#3D2A1B"); g.addColorStop(0.5, "#271A12"); g.addColorStop(1, "#14100D"); }
  else { g.addColorStop(0, "#FAE0AE"); g.addColorStop(0.45, "#EDB16A"); g.addColorStop(1, "#9A6544"); }
  x.fillStyle = g; x.fillRect(0, 0, 1080, 1350);
  x.fillStyle = dark ? "rgba(44,30,21,0.92)" : "rgba(255,249,239,0.93)";
  if (x.roundRect) { x.beginPath(); x.roundRect(70, 150, 940, 1050, 48); x.fill(); } else x.fillRect(70, 150, 940, 1050);
  const ink = dark ? "#F3E3CB" : "#4A2E1A", soft = dark ? "#AC917A" : "#8B6F52";
  x.fillStyle = soft; x.font = "600 30px system-ui"; x.fillText("SCOUT · WEEK IN REVIEW", 130, 250);
  x.fillStyle = ink; x.font = "700 96px ui-monospace, monospace";
  x.fillText(String(tasks), 130, 400); x.fillText(String(streak), 480, 400); x.fillText(`${hours}h`, 790, 400);
  x.fillStyle = soft; x.font = "500 28px system-ui";
  x.fillText("tasks done", 130, 445); x.fillText("day streak", 480, 445); x.fillText("focused", 790, 445);
  x.strokeStyle = dark ? "#4C3524" : "#E5CBA6"; x.lineWidth = 3;
  x.beginPath(); x.moveTo(130, 510); x.lineTo(950, 510); x.stroke();
  const wrap = (text, maxW, startY, size, color) => {
    x.fillStyle = color; x.font = `600 ${size}px system-ui`;
    const words = (text || "").split(" "); let line = "", y = startY;
    words.forEach((w) => {
      if (x.measureText(line + w).width > maxW) { x.fillText(line, 130, y); line = w + " "; y += size * 1.35; }
      else line += w + " ";
    });
    x.fillText(line, 130, y); return y;
  };
  let y = 580;
  if (win) { x.fillStyle = "#E8A93B"; x.font = "700 26px system-ui"; x.fillText("THE WIN", 130, y); y = wrap(win, 820, y + 50, 42, ink) + 90; }
  if (oneThing) { x.fillStyle = "#E8A93B"; x.font = "700 26px system-ui"; x.fillText("NEXT WEEK", 130, y); wrap(oneThing, 820, y + 50, 42, ink); }
  x.fillStyle = soft; x.font = "500 26px system-ui";
  x.fillText(new Date().toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" }), 130, 1140);
  const a = document.createElement("a");
  a.download = `scout-week-${todayStr()}.png`; a.href = c.toDataURL("image/png"); a.click();
}

function OnThisDay({ reflections, now }) {
  const marks = [[365, "a year ago"], [180, "six months ago"], [30, "a month ago"]];
  const found = marks.map(([d, label]) => ({ label, r: reflections.find((x) => x.date === todayStr(addDays(now, -d))) })).filter((x) => x.r);
  if (!found.length) return null;
  return (
    <div className="rounded-2xl p-4 mb-3" style={cardStyle({ borderLeft: `4px solid ${VIOLET}` })}>
      <div className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: VIOLET }}>On this day</div>
      {found.map(({ label, r }) => (
        <div key={label} className="mb-2">
          <div className="text-xs flex items-center gap-1.5" style={{ color: MUTED }}><span style={{ fontSize: 15 }}>{r.mood}</span> {label}</div>
          {r.win && <div className="text-sm mt-0.5">{r.win}</div>}
          {!r.win && r.journalText && <div className="text-sm mt-0.5" style={{ color: MUTED }}>{r.journalText.slice(0, 120)}…</div>}
        </div>
      ))}
    </div>
  );
}

/* ================= notes, as a physical board ================= */

const hashTilt = (id) => { let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0; return ((h % 300) / 100) - 1.5; };
const PAPERS = {
  plain: { label: "Plain", bg: "var(--card)" },
  lined: { label: "Lined", bg: "repeating-linear-gradient(var(--card), var(--card) 25px, var(--border-soft) 25px, var(--border-soft) 26px)" },
  grid: { label: "Graph", bg: "repeating-linear-gradient(var(--card), var(--card) 17px, var(--border-soft) 17px, var(--border-soft) 18px), repeating-linear-gradient(90deg, var(--card), var(--card) 17px, var(--border-soft) 17px, var(--border-soft) 18px)" },
  essay: { label: "Manuscript", bg: "var(--card-2)" },
};
const WIKI_RE = /\[\[([^\]]+)\]\]/g;
const linkTitles = (text) => { const out = []; let m; const re = new RegExp(WIKI_RE); while ((m = re.exec(text || ""))) out.push(m[1].trim()); return out; };

function NoteBody({ text, notes, onOpenNote, style }) {
  const parts = [];
  let last = 0, m; const re = new RegExp(WIKI_RE);
  while ((m = re.exec(text || ""))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const title = m[1].trim();
    const target = notes.find((n) => n.title.toLowerCase() === title.toLowerCase());
    parts.push(
      <button key={m.index} onClick={() => target && onOpenNote(target)} className="wiki-link" style={{ color: target ? GOLD : CORAL }} title={target ? `Open ${title}` : `No note called ${title} yet`}>
        {title}
      </button>
    );
    last = m.index + m[0].length;
  }
  if (last < (text || "").length) parts.push(text.slice(last));
  return <div style={{ whiteSpace: "pre-wrap", ...style }}>{parts}</div>;
}

function BoardNoteImpl({ note, notes, folders, backlinks, onOpen, onPin, onDelete, onOpenNote, onOpenWorkshop }) {
  const paper = PAPERS[note.paper || (note.kind === "essay" ? "essay" : (note.checklistItems || []).length ? "grid" : "lined")] || PAPERS.plain;
  const tilt = hashTilt(note.id);
  const folder = folders.find((f) => f.id === note.folderId);
  const wc = note.kind === "essay" ? wordCount(note.text) : 0;
  return (
    <div className="board-note" style={{ transform: `rotate(${tilt}deg)`, background: paper.bg, border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW, breakInside: "avoid", marginBottom: 14 }}>
      {note.pinned && <span className="note-tape" aria-hidden="true" />}
      <div className="p-3">
        <div className="flex items-start gap-1">
          <button onClick={onOpen} className="flex-1 text-left font-display text-sm font-bold" style={{ color: TEXT }}>{note.title}</button>
          <IconBtn label={note.pinned ? "Untape" : "Tape it up"} onClick={onPin} color={note.pinned ? GOLD : MUTED}><span style={{ fontSize: 13, lineHeight: 1 }}>★</span></IconBtn>
        </div>
        {note.kind === "essay" && (
          <div className="flex items-center gap-2 mt-1.5">
            <MeterBar percent={note.wordTarget ? clamp(wc / note.wordTarget, 0, 1) : 0} color={wc > (note.wordTarget || 0) ? RED : ACCENT} height={4} />
            <span className="text-xs whitespace-nowrap font-display" style={{ color: MUTED }}>{wc}/{note.wordTarget || "?"}</span>
          </div>
        )}
        {note.text && <NoteBody text={note.text.slice(0, 260) + (note.text.length > 260 ? "…" : "")} notes={notes} onOpenNote={onOpenNote} style={{ fontSize: 13, color: MUTED, marginTop: 6, lineHeight: "26px" }} />}
        {(note.checklistItems || []).length > 0 && (
          <div className="mt-2 text-xs" style={{ color: MUTED }}>
            {(note.checklistItems || []).filter((c) => c.done).length}/{note.checklistItems.length} checked
          </div>
        )}
        {backlinks.length > 0 && (
          <div className="mt-2 pt-2" style={{ borderTop: `1px dashed ${BORDER}` }}>
            <div className="text-xs font-semibold mb-0.5" style={{ color: MUTED }}>Referenced by</div>
            {backlinks.slice(0, 3).map((b) => (
              <button key={b.id} onClick={() => onOpenNote(b)} className="text-xs block text-left" style={{ color: GOLD }}>← {b.title}</button>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-1 mt-2 items-center">
          {folder && <span className="text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1" style={{ background: INPUT_BG, color: MUTED }}><Folder size={9} />{folder.name}</span>}
          {(note.tags || []).map((t) => <span key={t} className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: INPUT_BG, color: SAGE }}>#{t}</span>)}
          <span className="ml-auto flex gap-1">
            {note.kind === "essay" && <IconBtn label="Open in workshop" onClick={onOpenWorkshop} color={GOLD}><Pencil size={12} /></IconBtn>}
            <IconBtn label={`Delete ${note.title}`} onClick={onDelete}><Trash2 size={12} /></IconBtn>
          </span>
        </div>
      </div>
    </div>
  );
}

function NoteEditor({ note, notes, folders, onSave, onClose, onOpenWorkshop }) {
  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const [tags, setTags] = useState((note.tags || []).join(", "));
  const [paper, setPaper] = useState(note.paper || "lined");
  const [folderId, setFolderId] = useState(note.folderId || "");
  const [check, setCheck] = useState("");
  const save = (extra = {}) => onSave({ title: title.trim() || "Untitled", text, tags: tags.split(",").map((t) => t.trim()).filter(Boolean), paper, folderId: folderId || null, ...extra });
  return (
    <Sheet open title="Edit note" onClose={() => { save(); onClose(); }}>
      <div className="flex flex-col gap-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Title" className="rounded-lg px-3 py-2 text-sm font-semibold outline-none" style={fieldStyle()} />
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} aria-label="Body" placeholder="Write freely. Type [[another note title]] to link them together."
          className="rounded-lg px-3 py-2 text-sm outline-none resize-none" style={fieldStyle()} />
        <div className="text-xs" style={{ color: MUTED }}>Links: {linkTitles(text).length ? linkTitles(text).join(", ") : "none yet — try [[About Me]]"}</div>
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags" aria-label="Tags" className="rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
        <div className="flex gap-2">
          <select value={paper} onChange={(e) => setPaper(e.target.value)} aria-label="Paper" className="flex-1 rounded-lg px-2 py-2 text-sm outline-none" style={fieldStyle()}>
            {Object.entries(PAPERS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={folderId} onChange={(e) => setFolderId(e.target.value)} aria-label="Folder" className="flex-1 rounded-lg px-2 py-2 text-sm outline-none" style={fieldStyle()}>
            <option value="">No folder</option>{folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>
        {(note.checklistItems || []).map((c) => (
          <div key={c.id} className="flex items-center gap-2">
            <button onClick={() => onSave({ checklistItems: note.checklistItems.map((x) => (x.id === c.id ? { ...x, done: !x.done } : x)) })} style={{ color: c.done ? GREEN : MUTED }}>{c.done ? <CheckCircle2 size={14} /> : <Circle size={14} />}</button>
            <span className="text-xs flex-1" style={{ textDecoration: c.done ? "line-through" : "none", color: c.done ? MUTED : TEXT }}>{c.text}</span>
            <IconBtn label="Remove" onClick={() => onSave({ checklistItems: note.checklistItems.filter((x) => x.id !== c.id) })}><X size={12} /></IconBtn>
          </div>
        ))}
        <form onSubmit={(e) => { e.preventDefault(); if (!check.trim()) return; onSave({ checklistItems: [...(note.checklistItems || []), { id: genId(), text: check.trim(), done: false }] }); setCheck(""); }} className="flex gap-2">
          <input value={check} onChange={(e) => setCheck(e.target.value)} placeholder="Add a checklist item" aria-label="New checklist item" className="flex-1 rounded-lg px-2 py-1.5 text-xs outline-none" style={fieldStyle()} />
          <button type="submit" aria-label="Add" className="rounded-lg px-2" style={{ background: INPUT_BG, color: MUTED, border: `1px solid ${BORDER}` }}><Plus size={12} /></button>
        </form>
        <div className="flex gap-2 justify-end mt-1">
          {note.kind === "essay" ? (
            <button onClick={() => { save(); onOpenWorkshop(); }} className="rounded-lg px-3 py-2 text-sm font-semibold flex items-center gap-1" style={{ background: ACCENT, color: ACCENT_TEXT }}>
              <Pencil size={13} /> Open the workshop
            </button>
          ) : (
            <button onClick={() => { save({ kind: "essay", wordTarget: 650 }); onClose(); }} className="rounded-lg px-3 py-2 text-sm font-semibold" style={{ border: `1px solid ${BORDER}`, color: TEXT }}>
              Turn into an essay
            </button>
          )}
          <button onClick={() => { save(); onClose(); }} className="rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: ACCENT, color: ACCENT_TEXT }}>Save</button>
        </div>
      </div>
    </Sheet>
  );
}

function ApplicationsSection({ list, view, setView, onDelete, onStatus, onOpenNote, onAddReq, onToggleReq, onDeleteReq, onAdd, emptyText }) {
  return (
    <>
      <div className="mb-3"><Segmented ariaLabel="Layout" value={view} onChange={setView} options={[["list", "List"], ["board", "Board"]]} /></div>
      {list.length === 0 && <SectionEmpty text={emptyText} />}
      {view === "board"
        ? <ApplicationBoard applications={list} onStatus={onStatus} />
        : list.map((a) => (
          <ApplicationRow key={a.id} item={a} onDelete={() => onDelete(a.id)} onStatus={(s) => onStatus(a.id, s)} onOpenNote={() => onOpenNote(a)}
            onAddReq={(text) => onAddReq(a.id, text)} onToggleReq={(rid) => onToggleReq(a.id, rid)} onDeleteReq={(rid) => onDeleteReq(a.id, rid)} />
        ))}
      <div className="mt-3"><AddApplicationForm onAdd={onAdd} /></div>
    </>
  );
}

/* =====================================================================
   WORLDS — each tab is its own place, not a swapped panel.
   ===================================================================== */

const WORLDS = {
  today:    { name: "Today",     tag: "lock in",            accent: "#E8A93B", glow: "rgba(232,169,59,0.20)" },
  campaign: { name: "Campaign",  tag: "the whole picture",  accent: "#4A7BA7", glow: "rgba(74,123,167,0.20)" },
  spaces:   { name: "Spaces",    tag: "where the work lives", accent: "#7A8C5A", glow: "rgba(122,140,90,0.20)" },
  apply:    { name: "Apply",     tag: "the campaign trail", accent: "#8B5E83", glow: "rgba(139,94,131,0.20)" },
  calendar: { name: "Calendar",  tag: "time",               accent: "#B5654A", glow: "rgba(181,101,74,0.18)" },
  reflect:  { name: "Reflect",   tag: "check in",           accent: "#C97B9E", glow: "rgba(201,123,158,0.18)" },
};

function WorldHeader({ world, title, subtitle, stats, action, children }) {
  const w = WORLDS[world] || WORLDS.today;
  return (
    <div className="world-header rounded-2xl p-5 mb-4" style={cardStyle({ borderTop: `4px solid ${w.accent}` })}>
      <div className="text-xs uppercase font-semibold mb-1" style={{ color: w.accent, letterSpacing: "0.28em" }}>{w.name}</div>
      <div className="font-display text-2xl font-bold leading-tight" style={{ color: TEXT }}>{title}</div>
      {subtitle && <div className="text-sm mt-1" style={{ color: MUTED }}>{subtitle}</div>}
      {stats && stats.length > 0 && (
        <div className="grid gap-2 mt-4" style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, minmax(0,1fr))` }}>
          {stats.map(([v, l, tone]) => (
            <div key={l} className="rounded-xl p-2 text-center" style={{ background: CARD_2, border: `1px solid ${BORDER_SOFT}` }}>
              <div className="font-display text-lg font-bold" style={{ color: tone || TEXT }}>{v}</div>
              <div className="text-xs" style={{ color: MUTED }}>{l}</div>
            </div>
          ))}
        </div>
      )}
      {action}
      {children}
    </div>
  );
}

function SubNav({ items, value, onChange, accent }) {
  return (
    <div className="subnav flex gap-1.5 mb-3 pb-1">
      {items.map(([v, label, Icon]) => (
        <button key={v} onClick={() => onChange(v)} className="subnav-btn"
          style={{ background: value === v ? accent : CARD, color: value === v ? "#fff" : MUTED, border: `1px solid ${value === v ? accent : BORDER}` }}>
          {Icon && <Icon size={13} />} {label}
        </button>
      ))}
    </div>
  );
}

function StatRow({ items }) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, minmax(0,1fr))` }}>
      {items.map(([v, l, tone]) => (
        <div key={l} className="rounded-xl p-3 text-center" style={cardStyle()}>
          <div className="font-display text-xl font-bold" style={{ color: tone || TEXT }}>{v}</div>
          <div className="text-xs" style={{ color: MUTED }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

/* ================= profile + transcripts ================= */

const GRADE_POINTS = { "A+": 4, A: 4, "A-": 3.7, "B+": 3.3, B: 3, "B-": 2.7, "C+": 2.3, C: 2, "C-": 1.7, "D+": 1.3, D: 1, F: 0 };
const COURSE_TAGS = ["Golden Four", "IGETC", "Major prep", "Elective"];
const GOLDEN_FOUR = ["Oral communication", "Written communication", "Critical thinking", "College math"];

function computeGpa(courses) {
  const graded = courses.filter((c) => c.grade && GRADE_POINTS[c.grade] !== undefined && c.units);
  if (!graded.length) return { gpa: null, units: 0, gradedUnits: 0 };
  const pts = graded.reduce((s, c) => s + GRADE_POINTS[c.grade] * Number(c.units), 0);
  const gradedUnits = graded.reduce((s, c) => s + Number(c.units), 0);
  const units = courses.filter((c) => c.status !== "planned").reduce((s, c) => s + Number(c.units || 0), 0);
  return { gpa: Math.round((pts / gradedUnits) * 100) / 100, units, gradedUnits };
}

function ProfileCard({ profile, courses, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  useEffect(() => setDraft(profile), [profile]);
  const { gpa, units } = computeGpa(courses);
  const inProgress = courses.filter((c) => c.status === "in_progress").reduce((s, c) => s + Number(c.units || 0), 0);
  const field = (k, label, type = "text") => (
    <label className="text-xs flex-1" style={{ color: MUTED }}>{label}
      <input type={type} value={draft[k] || ""} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })}
        className="w-full rounded-lg px-2 py-1.5 text-sm outline-none mt-1" style={fieldStyle()} />
    </label>
  );
  return (
    <div className="rounded-2xl p-4 mb-3" style={cardStyle()}>
      {editing ? (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">{field("name", "Name")}{field("pronouns", "Pronouns")}</div>
          <div className="flex gap-2">{field("school", "College")}{field("major", "Intended major")}</div>
          <div className="flex gap-2">{field("targetGpa", "Target GPA", "number")}{field("email", "Email")}</div>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setDraft(profile); setEditing(false); }} className="text-xs px-3 py-1.5 rounded-lg" style={{ border: `1px solid ${BORDER}`, color: MUTED }}>Cancel</button>
            <button onClick={() => { onSave(draft); setEditing(false); }} className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ background: ACCENT, color: ACCENT_TEXT }}>Save</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl flex items-center justify-center font-display font-bold" style={{ width: 52, height: 52, background: ACCENT_SOFT, color: GOLD, fontSize: 20 }}>
              {(profile.name || "D").trim().slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="font-display text-lg font-bold leading-tight" style={{ color: TEXT }}>{profile.name || "Add your name"}</div>
              <div className="text-xs" style={{ color: MUTED }}>{[profile.school, profile.major].filter(Boolean).join(" · ") || "College and major"}</div>
            </div>
            <IconBtn label="Edit profile" onClick={() => setEditing(true)}><Pencil size={15} /></IconBtn>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-3">
            {[[gpa !== null ? gpa.toFixed(2) : "—", "GPA", gpa !== null && profile.targetGpa && gpa < Number(profile.targetGpa) ? CORAL : TEXT],
              [units || "—", "units done"], [inProgress || "—", "in progress"], [profile.targetGpa || "—", "target"]].map(([v, l, tone]) => (
              <div key={l} className="rounded-xl p-2 text-center" style={{ background: CARD_2, border: `1px solid ${BORDER_SOFT}` }}>
                <div className="font-display text-base font-bold" style={{ color: tone || TEXT }}>{v}</div>
                <div className="text-xs" style={{ color: MUTED }}>{l}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function TranscriptPanel({ courses, onAdd, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("Fall 2026");
  const [code, setCode] = useState(""); const [title, setTitle] = useState("");
  const [uu, setUu] = useState("4"); const [grade, setGrade] = useState(""); const [tag, setTag] = useState("Major prep");
  const { gpa, units, gradedUnits } = computeGpa(courses);
  const terms = [...new Set(courses.map((c) => c.term))];
  const g4 = GOLDEN_FOUR.map((n) => ({ name: n, done: courses.some((c) => c.golden === n && c.grade && GRADE_POINTS[c.grade] >= 2) }));
  const submit = (e) => {
    e.preventDefault(); if (!title.trim()) return;
    onAdd({ term, code: code.trim(), title: title.trim(), units: Number(uu) || 0, grade: grade || null, tag, status: grade ? "complete" : "in_progress", golden: null });
    setCode(""); setTitle(""); setGrade(""); setOpen(false);
  };
  return (
    <div>
      <div className="rounded-2xl p-4 mb-3" style={cardStyle()}>
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: GOLD }}>Transcript</div>
            <div className="font-display text-3xl font-bold" style={{ color: TEXT }}>{gpa !== null ? gpa.toFixed(2) : "—"}</div>
          </div>
          <div className="text-xs text-right" style={{ color: MUTED }}>{units} units attempted<br />{gradedUnits} units graded</div>
        </div>
        <div className="text-xs mb-1.5" style={{ color: MUTED }}>UC and CSU want 60 transferable units</div>
        <MeterBar percent={units / 60} color={units >= 60 ? GREEN : ACCENT} height={8} />
      </div>

      <div className="rounded-2xl p-4 mb-3" style={cardStyle()}>
        <div className="text-sm font-semibold mb-2">The Golden Four</div>
        <div className="text-xs mb-2" style={{ color: MUTED }}>Every CSU and most UC paths require these with a C or better. Tag a course to mark one done.</div>
        {g4.map((g) => (
          <div key={g.name} className="flex items-center gap-2 py-1">
            <span style={{ color: g.done ? GREEN : MUTED }}>{g.done ? <CheckCircle2 size={15} /> : <Circle size={15} />}</span>
            <span className="text-sm" style={{ color: g.done ? MUTED : TEXT }}>{g.name}</span>
          </div>
        ))}
      </div>

      {terms.length === 0 && <SectionEmpty text="No courses yet. Add them term by term and your GPA calculates itself." />}
      {terms.map((t) => {
        const list = courses.filter((c) => c.term === t);
        const tu = list.reduce((s, c) => s + Number(c.units || 0), 0);
        return (
          <div key={t} className="rounded-2xl p-3 mb-2" style={cardStyle()}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold">{t}</span>
              <span className="text-xs" style={{ color: MUTED }}>{tu} units</span>
            </div>
            {list.map((c) => (
              <div key={c.id} className="flex items-center gap-2 py-1.5 task-row" style={{ borderTop: `1px solid ${BORDER_SOFT}` }}>
                <div className="flex-1">
                  <div className="text-sm">{c.code ? `${c.code} — ` : ""}{c.title}</div>
                  <div className="text-xs flex items-center gap-1.5" style={{ color: MUTED }}>
                    {c.units} units
                    <select value={c.golden || ""} onChange={(e) => onUpdate(c.id, { golden: e.target.value || null })} aria-label="Golden Four slot"
                      className="text-xs rounded px-1 outline-none" style={{ ...fieldStyle(), padding: "1px 4px" }}>
                      <option value="">{c.tag}</option>
                      {GOLDEN_FOUR.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
                <select value={c.grade || ""} onChange={(e) => onUpdate(c.id, { grade: e.target.value || null, status: e.target.value ? "complete" : "in_progress" })}
                  aria-label={`Grade for ${c.title}`} className="text-xs rounded-lg px-2 py-1 outline-none font-semibold" style={fieldStyle()}>
                  <option value="">In progress</option>
                  {Object.keys(GRADE_POINTS).map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                <span className="row-actions"><IconBtn label={`Delete ${c.title}`} onClick={() => onDelete(c.id)}><Trash2 size={13} /></IconBtn></span>
              </div>
            ))}
          </div>
        );
      })}

      {open ? (
        <form onSubmit={submit} className="rounded-2xl p-4 flex flex-col gap-2" style={cardStyle()}>
          <div className="flex gap-2">
            <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Term" aria-label="Term" className="flex-1 rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="ENGL 1A" aria-label="Course code" className="w-28 rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
          </div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Course title" aria-label="Course title" className="rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
          <div className="flex gap-2">
            <input type="number" step="0.5" value={uu} onChange={(e) => setUu(e.target.value)} placeholder="Units" aria-label="Units" className="w-20 rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
            <select value={grade} onChange={(e) => setGrade(e.target.value)} aria-label="Grade" className="flex-1 rounded-lg px-2 py-2 text-sm outline-none" style={fieldStyle()}>
              <option value="">In progress</option>{Object.keys(GRADE_POINTS).map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            <select value={tag} onChange={(e) => setTag(e.target.value)} aria-label="Category" className="flex-1 rounded-lg px-2 py-2 text-sm outline-none" style={fieldStyle()}>
              {COURSE_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)} className="text-sm px-3 py-2 rounded-lg" style={{ border: `1px solid ${BORDER}`, color: MUTED }}>Cancel</button>
            <button type="submit" className="text-sm px-3 py-2 rounded-lg font-semibold" style={{ background: ACCENT, color: ACCENT_TEXT }}>Add course</button>
          </div>
        </form>
      ) : (
        <button onClick={() => setOpen(true)} className="w-full rounded-2xl py-3 flex items-center justify-center gap-2 text-sm font-semibold" style={{ border: `1.5px dashed ${BORDER}`, color: MUTED }}>
          <Plus size={16} /> Add a course
        </button>
      )}
    </div>
  );
}

/* ================= activity bank ================= */

const ACTIVITY_CATEGORIES = [
  "Award or honor", "Educational prep program", "Extracurricular", "Other coursework", "Volunteering", "Work experience",
];
const UC_LIMIT = 20, UC_CHARS = 350, CA_LIMIT = 10, CA_CHARS = 150;

function ActivityRowImpl({ item, onUpdate, onDelete, ucFull, caFull }) {
  const [open, setOpen] = useState(false);
  const ucLen = (item.ucDescription || "").length;
  const caLen = (item.caDescription || "").length;
  return (
    <div className="rounded-xl mb-2 task-row" style={cardStyle({ borderLeft: `4px solid ${item.ucSelected || item.caSelected ? ACCENT : BORDER}` })}>
      <div className="flex items-center gap-2 p-3">
        <button onClick={() => onUpdate({ ucSelected: !item.ucSelected })} disabled={!item.ucSelected && ucFull}
          aria-pressed={item.ucSelected} aria-label={`UC pick: ${item.title}`} title={ucFull && !item.ucSelected ? "UC list is full" : "UC application"}
          className="text-xs font-bold rounded-lg px-2 py-1" style={{ background: item.ucSelected ? "#4A7BA7" : INPUT_BG, color: item.ucSelected ? "#fff" : MUTED, opacity: !item.ucSelected && ucFull ? 0.4 : 1 }}>UC</button>
        <button onClick={() => onUpdate({ caSelected: !item.caSelected })} disabled={!item.caSelected && caFull}
          aria-pressed={item.caSelected} aria-label={`Common App pick: ${item.title}`} title={caFull && !item.caSelected ? "Common App list is full" : "Common App"}
          className="text-xs font-bold rounded-lg px-2 py-1" style={{ background: item.caSelected ? "#C4703F" : INPUT_BG, color: item.caSelected ? "#fff" : MUTED, opacity: !item.caSelected && caFull ? 0.4 : 1 }}>CA</button>
        <button onClick={() => setOpen((o) => !o)} className="flex-1 text-left" aria-expanded={open}>
          <div className="text-sm font-medium">{item.title}</div>
          <div className="text-xs" style={{ color: MUTED }}>{[item.role, item.org, item.category].filter(Boolean).join(" · ")}</div>
        </button>
        <span className="row-actions"><IconBtn label={`Delete ${item.title}`} onClick={onDelete}><Trash2 size={13} /></IconBtn></span>
      </div>
      {open && (
        <div className="px-3 pb-3" style={{ borderTop: `1px dashed ${BORDER}` }}>
          <div className="flex gap-2 mt-2">
            <input value={item.role || ""} onChange={(e) => onUpdate({ role: e.target.value })} placeholder="Your role" aria-label="Role" className="flex-1 rounded-lg px-2 py-1.5 text-xs outline-none" style={fieldStyle()} />
            <input value={item.org || ""} onChange={(e) => onUpdate({ org: e.target.value })} placeholder="Organization" aria-label="Organization" className="flex-1 rounded-lg px-2 py-1.5 text-xs outline-none" style={fieldStyle()} />
          </div>
          <div className="flex gap-2 mt-2">
            <select value={item.category} onChange={(e) => onUpdate({ category: e.target.value })} aria-label="Category" className="flex-1 rounded-lg px-2 py-1.5 text-xs outline-none" style={fieldStyle()}>
              {ACTIVITY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="number" value={item.hoursPerWeek || ""} onChange={(e) => onUpdate({ hoursPerWeek: e.target.value })} placeholder="hrs/wk" aria-label="Hours per week" className="w-20 rounded-lg px-2 py-1.5 text-xs outline-none" style={fieldStyle()} />
            <input type="number" value={item.weeksPerYear || ""} onChange={(e) => onUpdate({ weeksPerYear: e.target.value })} placeholder="wks/yr" aria-label="Weeks per year" className="w-20 rounded-lg px-2 py-1.5 text-xs outline-none" style={fieldStyle()} />
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold" style={{ color: "#4A7BA7" }}>UC version</span>
              <span className="text-xs font-display" style={{ color: ucLen > UC_CHARS ? RED : MUTED }}>{ucLen}/{UC_CHARS}</span>
            </div>
            <textarea value={item.ucDescription || ""} onChange={(e) => onUpdate({ ucDescription: e.target.value })} rows={3}
              aria-label="UC description" placeholder="What you did and what changed because of it."
              className="w-full rounded-lg px-2 py-1.5 text-xs outline-none resize-none" style={fieldStyle()} />
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold" style={{ color: "#C4703F" }}>Common App version</span>
              <span className="text-xs font-display" style={{ color: caLen > CA_CHARS ? RED : MUTED }}>{caLen}/{CA_CHARS}</span>
            </div>
            <textarea value={item.caDescription || ""} onChange={(e) => onUpdate({ caDescription: e.target.value })} rows={2}
              aria-label="Common App description" placeholder="The same thing, much tighter."
              className="w-full rounded-lg px-2 py-1.5 text-xs outline-none resize-none" style={fieldStyle()} />
            {(item.ucDescription || "").length > 0 && !(item.caDescription || "").length && (
              <button onClick={() => onUpdate({ caDescription: item.ucDescription.slice(0, CA_CHARS) })} className="text-xs mt-1" style={{ color: GOLD }}>
                Start from the UC version
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ActivityBank({ activities, onAdd, onUpdate, onDelete }) {
  const [filter, setFilter] = useState("all");
  const [text, setText] = useState("");
  const ucCount = activities.filter((a) => a.ucSelected).length;
  const caCount = activities.filter((a) => a.caSelected).length;
  const shown = activities.filter((a) => filter === "all" || (filter === "uc" && a.ucSelected) || (filter === "ca" && a.caSelected) || a.category === filter);
  const submit = (e) => { e.preventDefault(); if (!text.trim()) return; onAdd({ title: text.trim() }); setText(""); };
  return (
    <div>
      <div className="rounded-2xl p-4 mb-3" style={cardStyle()}>
        <div className="text-sm font-semibold mb-1">Everything you've done</div>
        <div className="text-xs mb-3" style={{ color: MUTED }}>
          List all of it, even the small things. Pick your finalists later — UC takes {UC_LIMIT}, Common App takes {CA_LIMIT}, and they can be different.
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[[activities.length, "in the bank", TEXT],
            [`${ucCount}/${UC_LIMIT}`, "UC picks", ucCount > UC_LIMIT ? RED : "#4A7BA7"],
            [`${caCount}/${CA_LIMIT}`, "Common App", caCount > CA_LIMIT ? RED : "#C4703F"]].map(([v, l, tone]) => (
            <div key={l} className="rounded-xl p-2 text-center" style={{ background: CARD_2, border: `1px solid ${BORDER_SOFT}` }}>
              <div className="font-display text-lg font-bold" style={{ color: tone }}>{v}</div>
              <div className="text-xs" style={{ color: MUTED }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={submit} className="flex gap-2 mb-3">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add anything — a job, an award, a club, a shift" aria-label="New activity"
          className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none" style={{ ...fieldStyle(), background: CARD }} />
        <button type="submit" aria-label="Add activity" className="rounded-xl px-3" style={{ background: ACCENT, color: ACCENT_TEXT }}><Plus size={16} /></button>
      </form>
      <div className="flex gap-1.5 flex-wrap mb-3">
        <Chip active={filter === "all"} onClick={() => setFilter("all")}>All</Chip>
        <Chip active={filter === "uc"} onClick={() => setFilter("uc")}>UC picks</Chip>
        <Chip active={filter === "ca"} onClick={() => setFilter("ca")}>Common App</Chip>
        {ACTIVITY_CATEGORIES.map((c) => <Chip key={c} active={filter === c} onClick={() => setFilter(c)}>{c.split(" ")[0]}</Chip>)}
      </div>
      {shown.length === 0 && <SectionEmpty text="Nothing here yet. Start with the obvious ones and the rest will come back to you." />}
      {shown.map((a) => (
        <ActivityRow key={a.id} item={a} onUpdate={(p) => onUpdate(a.id, p)} onDelete={() => onDelete(a.id)}
          ucFull={ucCount >= UC_LIMIT} caFull={caCount >= CA_LIMIT} />
      ))}
    </div>
  );
}

/* ================= financial aid, networking, recommenders, templates ================= */

const SEED_AID = [
  { id: "aid_fafsa", name: "FAFSA", opens: "2026-10-01", dueBy: "2027-03-02", status: "not_started", note: "Federal aid. California priority deadline is March 2." },
  { id: "aid_dream", name: "CA Dream Act (if applicable)", opens: "2026-10-01", dueBy: "2027-03-02", status: "not_started", note: "For students who can't file FAFSA. Same March 2 priority date." },
  { id: "aid_css", name: "CSS Profile", opens: "2026-10-01", dueBy: "2027-03-01", status: "not_started", note: "Brown, Columbia and Dartmouth use this for institutional aid. Costs money unless waived." },
  { id: "aid_gpa", name: "Cal Grant GPA verification", opens: "2026-10-01", dueBy: "2027-03-02", status: "not_started", note: "Your college usually submits this — confirm they did." },
  { id: "aid_verify", name: "Verification documents", opens: null, dueBy: "2027-04-15", status: "not_started", note: "Tax returns and W-2s if you get selected. Have them ready." },
];
const AID_STATUS = { not_started: "Not started", in_progress: "In progress", submitted: "Submitted", done: "Confirmed" };

function FinancialAid({ items, onUpdate }) {
  return (
    <div>
      <div className="rounded-2xl p-4 mb-3" style={cardStyle({ borderLeft: `4px solid ${GREEN}` })}>
        <div className="text-sm font-semibold mb-1">Aid is a deadline game</div>
        <div className="text-xs" style={{ color: MUTED }}>March 2 is the California priority date and it is not flexible. Filing late costs real money — often more than any single scholarship on your list.</div>
      </div>
      {items.map((a) => {
        const d = a.dueBy ? daysUntil(a.dueBy) : null;
        const done = a.status === "done" || a.status === "submitted";
        return (
          <div key={a.id} className="rounded-xl p-3 mb-2" style={cardStyle({ borderLeft: `4px solid ${done ? GREEN : d !== null && d < 45 ? CORAL : BORDER}` })}>
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <div className="text-sm font-semibold">{a.name}</div>
                <div className="text-xs mt-0.5" style={{ color: MUTED }}>{a.note}</div>
                <div className="text-xs mt-1 font-semibold" style={{ color: d !== null && d < 45 && !done ? CORAL : MUTED }}>
                  {a.opens ? `Opens ${fmtDayShort(a.opens + "T12:00:00")} · ` : ""}{a.dueBy ? `due ${fmtDayShort(a.dueBy + "T12:00:00")}${d !== null && d >= 0 ? ` (${d}d)` : ""}` : "No fixed date"}
                </div>
              </div>
              <select value={a.status} onChange={(e) => onUpdate(a.id, { status: e.target.value })} aria-label={`Status for ${a.name}`}
                className="text-xs rounded-lg px-2 py-1 outline-none font-semibold" style={{ ...fieldStyle(), color: done ? GREEN : MUTED }}>
                {Object.entries(AID_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const CONTACT_KINDS = ["Professor", "Recruiter", "Alum", "Admissions", "Mentor", "Peer", "Other"];

function NetworkingLog({ contacts, onAdd, onUpdate, onDelete, onDraft }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(""); const [kind, setKind] = useState("Recruiter"); const [org, setOrg] = useState("");
  const stale = contacts.filter((c) => c.lastContact && daysUntil(c.lastContact) < -21 && c.status !== "closed");
  const submit = (e) => { e.preventDefault(); if (!name.trim()) return; onAdd({ name: name.trim(), kind, org: org.trim(), email: "", linkedin: "", lastContact: todayStr(), notes: "", status: "warm" }); setName(""); setOrg(""); setOpen(false); };
  return (
    <div>
      <div className="rounded-2xl p-4 mb-3" style={cardStyle({ borderLeft: `4px solid ${VIOLET}` })}>
        <div className="text-sm font-semibold mb-1">Most opportunities come through people</div>
        <div className="text-xs" style={{ color: MUTED }}>
          {stale.length > 0 ? `${stale.length} ${stale.length === 1 ? "person has" : "people have"} gone quiet for over three weeks. A short check-in costs nothing.` : "Log everyone you talk to. Future you will not remember."}
        </div>
      </div>
      {contacts.length === 0 && <SectionEmpty text="No one logged yet. Start with the professors who already know your work." />}
      {contacts.map((c) => {
        const since = c.lastContact ? -daysUntil(c.lastContact) : null;
        return (
          <div key={c.id} className="rounded-xl p-3 mb-2 task-row" style={cardStyle({ borderLeft: `4px solid ${since !== null && since > 21 ? CORAL : SAGE}` })}>
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <div className="text-sm font-semibold">{c.name}</div>
                <div className="text-xs" style={{ color: MUTED }}>{[c.kind, c.org].filter(Boolean).join(" · ")}</div>
                {since !== null && <div className="text-xs mt-0.5" style={{ color: since > 21 ? CORAL : MUTED }}>{since === 0 ? "Talked today" : `${since}d since you talked`}</div>}
              </div>
              <div className="flex items-center gap-1">
                <IconBtn label={`Draft an email to ${c.name}`} onClick={() => onDraft(c)} color={GOLD}><Mail size={14} /></IconBtn>
                <span className="row-actions"><IconBtn label={`Delete ${c.name}`} onClick={() => onDelete(c.id)}><Trash2 size={13} /></IconBtn></span>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <input defaultValue={c.email} onBlur={(e) => onUpdate(c.id, { email: e.target.value })} placeholder="Email" aria-label={`Email for ${c.name}`} className="flex-1 rounded-lg px-2 py-1 text-xs outline-none" style={fieldStyle()} />
              <input defaultValue={c.linkedin} onBlur={(e) => onUpdate(c.id, { linkedin: e.target.value })} placeholder="LinkedIn" aria-label={`LinkedIn for ${c.name}`} className="flex-1 rounded-lg px-2 py-1 text-xs outline-none" style={fieldStyle()} />
              <button onClick={() => onUpdate(c.id, { lastContact: todayStr() })} className="text-xs px-2 py-1 rounded-lg whitespace-nowrap" style={{ border: `1px solid ${BORDER}`, color: GOLD }}>Talked today</button>
            </div>
            <input defaultValue={c.notes} onBlur={(e) => onUpdate(c.id, { notes: e.target.value })} placeholder="What you talked about, what to follow up on…" aria-label={`Notes about ${c.name}`}
              className="w-full rounded-lg px-2 py-1.5 text-xs outline-none mt-2" style={fieldStyle()} />
          </div>
        );
      })}
      {open ? (
        <form onSubmit={submit} className="rounded-2xl p-4 flex flex-col gap-2" style={cardStyle()}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" aria-label="Name" className="rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
          <div className="flex gap-2">
            <select value={kind} onChange={(e) => setKind(e.target.value)} aria-label="Kind" className="flex-1 rounded-lg px-2 py-2 text-sm outline-none" style={fieldStyle()}>
              {CONTACT_KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
            <input value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Where" aria-label="Organization" className="flex-1 rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)} className="text-sm px-3 py-2 rounded-lg" style={{ border: `1px solid ${BORDER}`, color: MUTED }}>Cancel</button>
            <button type="submit" className="text-sm px-3 py-2 rounded-lg font-semibold" style={{ background: ACCENT, color: ACCENT_TEXT }}>Add</button>
          </div>
        </form>
      ) : (
        <button onClick={() => setOpen(true)} className="w-full rounded-2xl py-3 flex items-center justify-center gap-2 text-sm font-semibold" style={{ border: `1.5px dashed ${BORDER}`, color: MUTED }}>
          <Plus size={16} /> Add someone
        </button>
      )}
    </div>
  );
}

const SEED_TEMPLATES = [
  { id: "tpl_rec", name: "Asking for a letter of evaluation", category: "Recommenders",
    subject: "Letter of evaluation for my transfer applications",
    body: "Hi Professor {{name}},\n\nI'm applying to transfer for Fall 2027 and I'm writing to ask whether you'd be willing to write me a letter of evaluation. I took {{course}} with you in {{term}}, and the work I did there is some of the writing I'm proudest of.\n\nIf you're able to, I'll send you everything you need in one place: my resume, my draft personal statement, the list of schools with their deadlines, and the submission links. The earliest deadline is {{deadline}}.\n\nCompletely understand if your plate is full. Thank you either way.\n\n{{me}}" },
  { id: "tpl_nudge", name: "Nudging a recommender", category: "Recommenders",
    subject: "Quick check-in on my letter",
    body: "Hi Professor {{name}},\n\nJust a gentle check-in — the {{school}} deadline is {{deadline}}. No rush if it's already in the works, I only wanted to make sure the submission link reached you.\n\nHappy to resend anything. Thank you again for doing this.\n\n{{me}}" },
  { id: "tpl_cold", name: "Cold outreach to someone in the industry", category: "Networking",
    subject: "Student at {{school}} — a quick question about {{company}}",
    body: "Hi {{name}},\n\nI'm a community college student in the Bay Area planning to transfer to Los Angeles next year, and I came across your work at {{company}}. I run communications for a Filipino cultural organization and write for my campus paper, so the way {{company}} builds an audience is something I pay close attention to.\n\nWould you be open to a 15-minute call sometime in the next few weeks? I'd mostly want to hear how you got into it. I'm happy to work around your schedule.\n\nThank you for considering it.\n\n{{me}}" },
  { id: "tpl_followup", name: "Following up after no reply", category: "Networking",
    subject: "Following up",
    body: "Hi {{name}},\n\nBumping this in case it got buried — completely understand if the timing isn't right.\n\nStill would love to hear how you got into {{company}} if you ever have 15 minutes.\n\n{{me}}" },
  { id: "tpl_thanks", name: "Thank you after a conversation", category: "Networking",
    subject: "Thank you",
    body: "Hi {{name}},\n\nThank you for taking the time today. The part about {{topic}} genuinely shifted how I'm thinking about this.\n\nI'll follow up on what you suggested and let you know how it goes. If there's ever anything I can help with, I mean that.\n\n{{me}}" },
  { id: "tpl_cover", name: "Cover letter opening", category: "Applications",
    subject: "{{role}} application — {{me}}",
    body: "Dear {{name}},\n\nI'm applying for the {{role}} position at {{company}}. I'm a community college student transferring to Los Angeles in 2027, and I've spent the last two years doing a smaller version of this job in public: running communications for a cultural organization, reporting for my campus paper, and building campaigns for a public art nonprofit.\n\n{{body}}\n\nThank you for your time and for considering my application.\n\n{{me}}" },
  { id: "tpl_scholar", name: "Scholarship thank-you letter", category: "Applications",
    subject: "Thank you — {{scholarship}}",
    body: "Dear {{name}},\n\nI want to thank you for the {{scholarship}}. I'm a first-generation student and the first in my family to navigate this system, and support like this is the difference between choosing a school and choosing what I can afford.\n\n{{body}}\n\nWith gratitude,\n{{me}}" },
  { id: "tpl_info", name: "Asking an admissions rep a question", category: "Applications",
    subject: "Transfer question from a prospective student",
    body: "Hi {{name}},\n\nI'm a transfer applicant for Fall 2027 planning to apply to {{school}}. I had one question I couldn't find answered on the site: {{question}}\n\nThank you for your help.\n\n{{me}}" },
];

function TemplateVault({ templates, profile, onAdd, onUpdate, onDelete, prefill, onClearPrefill }) {
  const [openId, setOpenId] = useState(null);
  const [cat, setCat] = useState("all");
  const [fills, setFills] = useState({});
  const [copied, setCopied] = useState(null);
  useEffect(() => { if (prefill) { setOpenId(prefill.templateId || "tpl_cold"); setFills((f) => ({ ...f, ...prefill.fills })); } }, [prefill]);
  const cats = ["all", ...new Set(templates.map((t) => t.category))];
  const shown = templates.filter((t) => cat === "all" || t.category === cat);
  const render = (text) => text.replace(/\{\{(\w+)\}\}/g, (_, k) => fills[k] || (k === "me" ? profile.name || "{{me}}" : k === "school" ? profile.school || "{{school}}" : `{{${k}}}`));
  const slots = (t) => [...new Set([...(t.subject + t.body).matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]))];
  const copy = async (t) => {
    try { await navigator.clipboard.writeText(`${render(t.subject)}\n\n${render(t.body)}`); setCopied(t.id); setTimeout(() => setCopied(null), 1600); } catch {}
  };
  return (
    <div>
      <div className="rounded-2xl p-4 mb-3" style={cardStyle()}>
        <div className="text-sm font-semibold mb-1">The email you don't want to write</div>
        <div className="text-xs" style={{ color: MUTED }}>Fill the blanks, copy, send. The hardest part of asking for something is starting the message.</div>
      </div>
      <div className="flex gap-1.5 flex-wrap mb-3">{cats.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c === "all" ? "All" : c}</Chip>)}</div>
      {shown.map((t) => (
        <div key={t.id} className="rounded-xl mb-2 task-row" style={cardStyle()}>
          <div className="flex items-center gap-2 p-3">
            <button onClick={() => { setOpenId(openId === t.id ? null : t.id); onClearPrefill && onClearPrefill(); }} className="flex-1 text-left">
              <div className="text-sm font-semibold">{t.name}</div>
              <div className="text-xs" style={{ color: MUTED }}>{t.category}</div>
            </button>
            <IconBtn label={`Copy ${t.name}`} onClick={() => copy(t)} color={copied === t.id ? GREEN : MUTED}>{copied === t.id ? <Check size={15} /> : <Copy size={15} />}</IconBtn>
            {!t.seeded && <span className="row-actions"><IconBtn label={`Delete ${t.name}`} onClick={() => onDelete(t.id)}><Trash2 size={13} /></IconBtn></span>}
          </div>
          {openId === t.id && (
            <div className="px-3 pb-3" style={{ borderTop: `1px dashed ${BORDER}` }}>
              <div className="flex flex-wrap gap-1.5 mt-2 mb-2">
                {slots(t).map((s) => (
                  <input key={s} value={fills[s] || ""} onChange={(e) => setFills({ ...fills, [s]: e.target.value })} placeholder={s} aria-label={s}
                    className="rounded-lg px-2 py-1 text-xs outline-none" style={{ ...fieldStyle(), width: 118 }} />
                ))}
              </div>
              <div className="rounded-lg p-3 text-xs" style={{ background: INPUT_BG, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                <div className="font-semibold mb-2" style={{ color: GOLD }}>{render(t.subject)}</div>
                {render(t.body)}
              </div>
              <button onClick={() => copy(t)} className="w-full mt-2 rounded-lg py-2 text-sm font-semibold" style={{ background: ACCENT, color: ACCENT_TEXT }}>
                {copied === t.id ? "Copied" : "Copy the whole thing"}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function RecommenderPackets({ letters, schools, assets, profile, onUpdate }) {
  const deadlines = schools.filter((s) => s.portal === "commonLetters" && s.deadline).sort((a, b) => a.deadline.localeCompare(b.deadline));
  const earliest = deadlines[0];
  const packetItems = [
    ["Your resume or activities list", assets.find((a) => a.id === "as_activities")],
    ["Your draft personal statement", assets.find((a) => a.id === "as_essay")],
    ["Transcript copy", assets.find((a) => a.id === "as_transcript")],
  ];
  return (
    <div>
      <div className="rounded-2xl p-4 mb-3" style={cardStyle({ borderLeft: `4px solid ${VIOLET}` })}>
        <div className="text-sm font-semibold mb-1">Make it easy to say yes</div>
        <div className="text-xs" style={{ color: MUTED }}>
          A professor writing you a letter has to reconstruct who you were in their class. Hand them everything at once and the letter gets specific — which is the only kind that helps.
          {earliest && ` Your first letter deadline is ${fmtDayShort(earliest.deadline + "T12:00:00")}.`}
        </div>
      </div>
      <div className="rounded-2xl p-4 mb-3" style={cardStyle()}>
        <div className="text-sm font-semibold mb-2">What goes in the packet</div>
        {packetItems.map(([label, asset]) => (
          <div key={label} className="flex items-center gap-2 py-1.5" style={{ borderTop: `1px solid ${BORDER_SOFT}` }}>
            <span style={{ color: asset && asset.status === "ready" ? GREEN : MUTED }}>{asset && asset.status === "ready" ? <CheckCircle2 size={15} /> : <Circle size={15} />}</span>
            <span className="text-sm flex-1">{label}</span>
            {asset && <span className="text-xs" style={{ color: MUTED }}>{ASSET_STATUS[asset.status].label}</span>}
          </div>
        ))}
        <div className="flex items-center gap-2 py-1.5" style={{ borderTop: `1px solid ${BORDER_SOFT}` }}>
          <span style={{ color: deadlines.length ? GREEN : MUTED }}>{deadlines.length ? <CheckCircle2 size={15} /> : <Circle size={15} />}</span>
          <span className="text-sm flex-1">Deadline list and submission links</span>
          <span className="text-xs" style={{ color: MUTED }}>{deadlines.length} schools</span>
        </div>
      </div>
      {letters.length === 0 && <SectionEmpty text="No recommenders yet. Add them under Apply → Transfer → Letters and their packets appear here." />}
      {letters.map((l) => (
        <div key={l.id} className="rounded-xl p-3 mb-2" style={cardStyle({ borderLeft: `4px solid ${LETTER_STATUS[l.status].color}` })}>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="text-sm font-semibold">{l.name}</div>
              <div className="text-xs" style={{ color: MUTED }}>{l.role || "Recommender"} · {LETTER_STATUS[l.status].label}</div>
            </div>
            <button onClick={() => onUpdate(l.id, { packetSent: !l.packetSent })} className="text-xs px-2 py-1 rounded-full font-semibold"
              style={{ background: l.packetSent ? `${GREEN}22` : INPUT_BG, color: l.packetSent ? GREEN : MUTED, border: `1px solid ${l.packetSent ? GREEN : BORDER}` }}>
              {l.packetSent ? "Packet sent" : "Mark packet sent"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const STAR_PROMPTS = [
  "Tell me about yourself", "Why this company", "A time you led something", "A time you failed",
  "A conflict you handled", "Your proudest project", "Where do you see yourself", "Questions for us",
];

function InterviewPrep({ questions, activities, onAdd, onUpdate, onDelete }) {
  const [company, setCompany] = useState("");
  const [text, setText] = useState("");
  const companies = [...new Set(questions.map((q) => q.company))];
  const submit = (e) => { e.preventDefault(); if (!text.trim()) return; onAdd({ company: company.trim() || "General", question: text.trim(), answer: "", activityId: null }); setText(""); };
  return (
    <div>
      <div className="rounded-2xl p-4 mb-3" style={cardStyle()}>
        <div className="text-sm font-semibold mb-1">Answers, not scripts</div>
        <div className="text-xs mb-2" style={{ color: MUTED }}>Write the story once and it works for eight interviews. Link an activity so you don't blank on the details.</div>
        <div className="flex flex-wrap gap-1.5">
          {STAR_PROMPTS.map((p) => (
            <button key={p} onClick={() => onAdd({ company: "General", question: p, answer: "", activityId: null })}
              className="text-xs px-2 py-1 rounded-full" style={{ border: `1px solid ${BORDER}`, color: MUTED }}>+ {p}</button>
          ))}
        </div>
      </div>
      <form onSubmit={submit} className="flex gap-2 mb-3">
        <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" aria-label="Company" className="w-28 rounded-xl px-3 py-2.5 text-sm outline-none" style={{ ...fieldStyle(), background: CARD }} />
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="A question you might get" aria-label="Question" className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none" style={{ ...fieldStyle(), background: CARD }} />
        <button type="submit" aria-label="Add question" className="rounded-xl px-3" style={{ background: ACCENT, color: ACCENT_TEXT }}><Plus size={16} /></button>
      </form>
      {questions.length === 0 && <SectionEmpty text="No questions yet. Tap one of the classics above to start." />}
      {companies.map((c) => (
        <div key={c} className="mb-3">
          <div className="text-xs font-semibold mb-1.5" style={{ color: GOLD }}>{c}</div>
          {questions.filter((q) => q.company === c).map((q) => (
            <div key={q.id} className="rounded-xl p-3 mb-2 task-row" style={cardStyle()}>
              <div className="flex items-start gap-2">
                <div className="text-sm font-medium flex-1">{q.question}</div>
                <span className="row-actions"><IconBtn label="Delete question" onClick={() => onDelete(q.id)}><Trash2 size={13} /></IconBtn></span>
              </div>
              <textarea defaultValue={q.answer} onBlur={(e) => onUpdate(q.id, { answer: e.target.value })} rows={3}
                placeholder="Situation, what you did, how it turned out." aria-label={`Answer to ${q.question}`}
                className="w-full rounded-lg px-2 py-1.5 text-xs outline-none resize-none mt-2" style={fieldStyle()} />
              {activities.length > 0 && (
                <select value={q.activityId || ""} onChange={(e) => onUpdate(q.id, { activityId: e.target.value || null })} aria-label="Linked activity"
                  className="text-xs rounded-lg px-2 py-1 outline-none mt-2 w-full" style={fieldStyle()}>
                  <option value="">Link an activity from your bank</option>
                  {activities.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
                </select>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function DecisionTracker({ schools, onUpdate }) {
  const decided = schools.filter((s) => ["accepted", "waitlisted", "denied"].includes(s.status));
  const waiting = schools.filter((s) => s.status === "submitted");
  const accepted = schools.filter((s) => s.status === "accepted");
  return (
    <div>
      <div className="rounded-2xl p-4 mb-3" style={cardStyle({ borderLeft: `4px solid ${GREEN}` })}>
        <div className="text-sm font-semibold mb-1">Spring is decision season</div>
        <div className="text-xs" style={{ color: MUTED }}>
          {waiting.length > 0 ? `${waiting.length} applications out, ${decided.length} answered.` : "Nothing submitted yet — this fills in once your applications go out."}
          {accepted.length > 1 && " Compare the aid packages, not the rankings."}
        </div>
      </div>
      {accepted.length > 0 && (
        <>
          <div className="text-xs font-semibold mb-1.5" style={{ color: GREEN }}>Offers on the table</div>
          {accepted.map((s) => (
            <div key={s.id} className="rounded-xl p-3 mb-2" style={cardStyle({ borderLeft: `4px solid ${GREEN}` })}>
              <div className="text-sm font-semibold mb-2">{s.name}</div>
              <div className="flex gap-2">
                <input type="number" defaultValue={s.costOfAttendance || ""} onBlur={(e) => onUpdate(s.id, { costOfAttendance: e.target.value })}
                  placeholder="Cost/yr" aria-label={`Cost at ${s.name}`} className="flex-1 rounded-lg px-2 py-1.5 text-xs outline-none" style={fieldStyle()} />
                <input type="number" defaultValue={s.aidOffer || ""} onBlur={(e) => onUpdate(s.id, { aidOffer: e.target.value })}
                  placeholder="Aid offered" aria-label={`Aid at ${s.name}`} className="flex-1 rounded-lg px-2 py-1.5 text-xs outline-none" style={fieldStyle()} />
                <div className="rounded-lg px-2 py-1.5 text-xs font-display font-bold flex items-center" style={{ background: INPUT_BG, color: TEXT, minWidth: 80, justifyContent: "center" }}>
                  {s.costOfAttendance ? money(Math.max(0, Number(s.costOfAttendance) - Number(s.aidOffer || 0))) : "—"}
                </div>
              </div>
              <div className="text-xs mt-1" style={{ color: MUTED }}>What you'd actually pay per year</div>
            </div>
          ))}
        </>
      )}
      {waiting.length > 0 && (
        <>
          <div className="text-xs font-semibold mb-1.5 mt-3" style={{ color: MUTED }}>Still waiting</div>
          {waiting.map((s) => (
            <div key={s.id} className="rounded-xl p-3 mb-2 flex items-center gap-2" style={cardStyle()}>
              <span className="text-sm flex-1">{s.name}</span>
              <span className="text-xs" style={{ color: MUTED }}>{PORTAL_META[s.portal].name.split(" ")[0]}</span>
            </div>
          ))}
        </>
      )}
      {decided.length === 0 && waiting.length === 0 && <SectionEmpty text="Nothing submitted yet. Mark a school as submitted under Apply and it shows up here." />}
    </div>
  );
}

/* ================= spaces — each organization gets its own world ================= */

function LogoTile({ org, logo, taskCount, streak, hoursThisWeek, onClick }) {
  return (
    <button onClick={onClick} className="space-tile rounded-2xl p-4 text-left lift relative overflow-hidden"
      style={cardStyle({ borderTop: `4px solid ${org.color}` })} aria-label={`Open ${org.name}`}>
      <div style={{ position: "absolute", right: -24, bottom: -24, width: 96, height: 96, borderRadius: "50%", background: org.color, opacity: 0.07 }} />
      <div className="rounded-2xl overflow-hidden flex items-center justify-center mb-3"
        style={{ width: 54, height: 54, background: `${org.color}1F`, border: `1px solid ${org.color}44` }}>
        {logo ? <img src={logo} alt="" className="w-full h-full object-cover" /> :
          <span className="font-display font-bold" style={{ color: org.color, fontSize: 19 }}>{org.name.trim().slice(0, 2).toUpperCase()}</span>}
      </div>
      <div className="font-display text-base font-bold leading-tight" style={{ color: TEXT }}>{org.name}</div>
      <div className="text-xs mt-0.5" style={{ color: MUTED }}>
        {taskCount > 0 ? `${taskCount} open` : "all clear"}{hoursThisWeek ? ` · ${hoursThisWeek}h this week` : ""}
      </div>
      {streak > 1 && <div className="mt-2"><StreakBadge streak={streak} freezes={0} /></div>}
    </button>
  );
}

function LinkList({ items, onAdd, onDelete, label, placeholder }) {
  const [name, setName] = useState(""); const [url, setUrl] = useState("");
  const submit = (e) => { e.preventDefault(); if (!name.trim() && !url.trim()) return; onAdd({ id: genId(), label: name.trim() || url.trim(), url: url.trim() }); setName(""); setUrl(""); };
  return (
    <div className="rounded-2xl p-4 mb-3" style={cardStyle()}>
      <div className="text-sm font-semibold mb-2">{label}</div>
      {items.length === 0 && <div className="text-xs mb-2" style={{ color: MUTED }}>{placeholder}</div>}
      {items.map((l) => (
        <div key={l.id} className="flex items-center gap-2 py-1.5 task-row" style={{ borderTop: `1px solid ${BORDER_SOFT}` }}>
          <Link2 size={13} style={{ color: MUTED, flexShrink: 0 }} />
          {l.url ? <a href={l.url} target="_blank" rel="noreferrer" className="text-sm flex-1 truncate" style={{ color: GOLD }}>{l.label}</a>
                 : <span className="text-sm flex-1 truncate">{l.label}</span>}
          <span className="row-actions"><IconBtn label={`Remove ${l.label}`} onClick={() => onDelete(l.id)}><X size={13} /></IconBtn></span>
        </div>
      ))}
      <form onSubmit={submit} className="flex gap-2 mt-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Label" aria-label="Label" className="w-24 rounded-lg px-2 py-1.5 text-xs outline-none" style={fieldStyle()} />
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" aria-label="URL" className="flex-1 rounded-lg px-2 py-1.5 text-xs outline-none" style={fieldStyle()} />
        <button type="submit" aria-label="Add link" className="rounded-lg px-2" style={{ background: INPUT_BG, color: MUTED, border: `1px solid ${BORDER}` }}><Plus size={13} /></button>
      </form>
    </div>
  );
}

function HoursLog({ entries, onAdd, onDelete, accent }) {
  const [hours, setHours] = useState(""); const [summary, setSummary] = useState("");
  const [weekStart, setWeekStart] = useState(todayStr(startOfWeek(new Date())));
  const total = entries.reduce((s, e) => s + Number(e.hours || 0), 0);
  const last4 = Array.from({ length: 4 }, (_, i) => todayStr(startOfWeek(addDays(new Date(), -7 * (3 - i)))));
  const max = Math.max(1, ...last4.map((w) => entries.filter((e) => e.weekStart === w).reduce((s, e) => s + Number(e.hours || 0), 0)));
  const submit = (e) => { e.preventDefault(); if (!hours) return; onAdd({ id: genId(), weekStart, hours: Number(hours), summary: summary.trim(), at: Date.now() }); setHours(""); setSummary(""); };
  return (
    <div>
      <div className="rounded-2xl p-4 mb-3" style={cardStyle()}>
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: accent }}>Hours logged</div>
            <div className="font-display text-3xl font-bold" style={{ color: TEXT }}>{total}</div>
          </div>
          <div className="text-xs text-right" style={{ color: MUTED }}>{entries.length} weeks<br />recorded</div>
        </div>
        <div className="flex items-end gap-2 mt-3" style={{ height: 54 }}>
          {last4.map((w) => {
            const h = entries.filter((e) => e.weekStart === w).reduce((s, e) => s + Number(e.hours || 0), 0);
            return (
              <div key={w} className="flex-1 flex flex-col items-center justify-end gap-1" style={{ height: "100%" }} title={`Week of ${w}: ${h}h`}>
                <span className="text-xs font-display" style={{ color: MUTED }}>{h || ""}</span>
                <div className="w-full rounded" style={{ height: `${Math.max(6, (h / max) * 100)}%`, background: h ? accent : BORDER }} />
                <span className="text-xs" style={{ color: MUTED, fontSize: 9 }}>{w.slice(5)}</span>
              </div>
            );
          })}
        </div>
      </div>
      <form onSubmit={submit} className="rounded-2xl p-4 mb-3 flex flex-col gap-2" style={cardStyle()}>
        <div className="flex gap-2">
          <input type="date" value={weekStart} onChange={(e) => setWeekStart(e.target.value)} aria-label="Week starting" className="flex-1 rounded-lg px-2 py-2 text-sm outline-none" style={fieldStyle()} />
          <input type="number" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="Hours" aria-label="Hours" className="w-24 rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
        </div>
        <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} placeholder="What you actually did this week — this becomes resume material later."
          aria-label="Week summary" className="rounded-lg px-3 py-2 text-sm outline-none resize-none" style={fieldStyle()} />
        <div className="flex justify-end"><button type="submit" className="rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: ACCENT, color: ACCENT_TEXT }}>Log the week</button></div>
      </form>
      {[...entries].sort((a, b) => b.weekStart.localeCompare(a.weekStart)).map((e) => (
        <div key={e.id} className="rounded-xl p-3 mb-2 task-row" style={cardStyle()}>
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-bold" style={{ color: accent, minWidth: 34 }}>{e.hours}h</span>
            <span className="text-xs flex-1" style={{ color: MUTED }}>week of {fmtDayShort(e.weekStart + "T12:00:00")}</span>
            <span className="row-actions"><IconBtn label="Delete entry" onClick={() => onDelete(e.id)}><Trash2 size={13} /></IconBtn></span>
          </div>
          {e.summary && <div className="text-sm mt-1">{e.summary}</div>}
        </div>
      ))}
    </div>
  );
}

function SpaceActivities({ items, onAdd, onToggle, onDelete, accent }) {
  const [title, setTitle] = useState(""); const [date, setDate] = useState(todayStr());
  const upcoming = items.filter((a) => !a.done && a.date >= todayStr()).sort((a, b) => a.date.localeCompare(b.date));
  const past = items.filter((a) => a.done || a.date < todayStr()).sort((a, b) => b.date.localeCompare(a.date));
  const submit = (e) => { e.preventDefault(); if (!title.trim()) return; onAdd({ id: genId(), title: title.trim(), date, note: "", done: false }); setTitle(""); };
  const row = (a) => (
    <div key={a.id} className="rounded-xl p-3 mb-2 flex items-center gap-3 task-row" style={cardStyle({ borderLeft: `4px solid ${a.done ? BORDER : accent}` })}>
      <button onClick={() => onToggle(a.id)} aria-pressed={a.done} aria-label={a.title} style={{ color: a.done ? GREEN : MUTED }}>{a.done ? <CheckCircle2 size={17} /> : <Circle size={17} />}</button>
      <div className="flex-1">
        <div className="text-sm" style={{ textDecoration: a.done ? "line-through" : "none", color: a.done ? MUTED : TEXT }}>{a.title}</div>
        <div className="text-xs" style={{ color: MUTED }}>{fmtDayShort(a.date + "T12:00:00")}{!a.done && a.date >= todayStr() ? ` · in ${daysUntil(a.date)}d` : ""}</div>
      </div>
      <span className="row-actions"><IconBtn label={`Delete ${a.title}`} onClick={() => onDelete(a.id)}><Trash2 size={13} /></IconBtn></span>
    </div>
  );
  return (
    <div>
      <form onSubmit={submit} className="rounded-2xl p-4 mb-3 flex gap-2" style={cardStyle()}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event, meeting, deadline…" aria-label="Activity" className="flex-1 rounded-lg px-3 py-2 text-sm outline-none" style={fieldStyle()} />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Date" className="rounded-lg px-2 py-2 text-sm outline-none" style={fieldStyle()} />
        <button type="submit" aria-label="Add activity" className="rounded-lg px-3" style={{ background: ACCENT, color: ACCENT_TEXT }}><Plus size={16} /></button>
      </form>
      {items.length === 0 && <SectionEmpty text="Nothing scheduled. Add what's coming up for this group." />}
      {upcoming.length > 0 && <div className="text-xs font-semibold mb-1.5" style={{ color: accent }}>Coming up</div>}
      {upcoming.map(row)}
      {past.length > 0 && <div className="text-xs font-semibold mb-1.5 mt-3" style={{ color: MUTED }}>Done and past</div>}
      {past.slice(0, 12).map(row)}
    </div>
  );
}

function PlanList({ items, onAdd, onToggle, onDelete, title, placeholder }) {
  const [text, setText] = useState("");
  const submit = (e) => { e.preventDefault(); if (!text.trim()) return; onAdd({ id: genId(), text: text.trim(), done: false }); setText(""); };
  return (
    <div className="rounded-2xl p-4 mb-3" style={cardStyle()}>
      <div className="text-sm font-semibold mb-2">{title}</div>
      {items.length === 0 && <div className="text-xs mb-1" style={{ color: MUTED }}>{placeholder}</div>}
      {items.map((i) => (
        <div key={i.id} className="flex items-center gap-2 py-1.5 task-row" style={{ borderTop: `1px solid ${BORDER_SOFT}` }}>
          <button onClick={() => onToggle(i.id)} aria-pressed={i.done} aria-label={i.text} style={{ color: i.done ? GREEN : MUTED }}>{i.done ? <CheckCircle2 size={15} /> : <Circle size={15} />}</button>
          <span className="text-sm flex-1" style={{ textDecoration: i.done ? "line-through" : "none", color: i.done ? MUTED : TEXT }}>{i.text}</span>
          <span className="row-actions"><IconBtn label={`Delete ${i.text}`} onClick={() => onDelete(i.id)}><X size={13} /></IconBtn></span>
        </div>
      ))}
      <form onSubmit={submit} className="flex gap-2 mt-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add one…" aria-label="New item" className="flex-1 rounded-lg px-2 py-1.5 text-xs outline-none" style={fieldStyle()} />
        <button type="submit" aria-label="Add" className="rounded-lg px-2" style={{ background: INPUT_BG, color: MUTED, border: `1px solid ${BORDER}` }}><Plus size={13} /></button>
      </form>
    </div>
  );
}

/* =====================================================================
   Motion and resilience
   ===================================================================== */

class ErrorBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err, info) { console.error("Scout crashed:", err, info); }
  async downloadRaw() {
    try {
      const dump = {};
      for (const k of ALL_KEYS) { const v = localStorage.getItem(NS + k); if (v !== null) dump[k] = JSON.parse(v); }
      const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = `scout-rescue-${todayStr()}.json`; a.click();
    } catch (e) { console.error(e); }
  }
  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#FAE0AE,#9A6544)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "system-ui" }}>
        <div style={{ background: "#FFFAF2", border: "1.5px solid #E7CFAD", borderRadius: 22, padding: 26, maxWidth: 440, boxShadow: "0 18px 48px rgba(139,90,60,0.26)" }}>
          <Mascot state="sleepy" size={64} />
          <div style={{ fontWeight: 800, fontSize: 19, color: "#42291A", marginTop: 8 }}>Something broke, but your data is safe</div>
          <p style={{ fontSize: 14, color: "#8A7059", lineHeight: 1.6, marginTop: 8 }}>
            Nothing was deleted — this is only the screen failing to draw. Download a copy before anything else, then reload.
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button onClick={() => this.downloadRaw()} style={{ flex: 1, background: "#E8A93B", color: "#3A2411", border: 0, borderRadius: 12, padding: "10px 14px", fontWeight: 700, cursor: "pointer" }}>Download my data</button>
            <button onClick={() => window.location.reload()} style={{ flex: 1, background: "transparent", color: "#42291A", border: "1.5px solid #E7CFAD", borderRadius: 12, padding: "10px 14px", fontWeight: 700, cursor: "pointer" }}>Reload</button>
          </div>
          <details style={{ marginTop: 14 }}>
            <summary style={{ fontSize: 12, color: "#8A7059", cursor: "pointer" }}>What went wrong</summary>
            <pre style={{ fontSize: 11, color: "#8A7059", whiteSpace: "pre-wrap", marginTop: 6 }}>{String(this.state.err && this.state.err.message)}</pre>
          </details>
        </div>
      </div>
    );
  }
}

/* Slow-drifting colour behind everything. Reads the palette, so it changes with the theme. */
function Aurora() {
  return (
    <div className="aurora" aria-hidden="true">
      <span className="aurora-blob b1" /><span className="aurora-blob b2" />
      <span className="aurora-blob b3" /><span className="aurora-blob b4" />
      <span className="aurora-grain" />
    </div>
  );
}

function CountUp({ value, duration = 700, decimals = 0 }) {
  const [shown, setShown] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const target = Number(value) || 0;
    const from = prev.current;
    if (from === target) { setShown(target); return; }
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      prev.current = target; setShown(target); return;
    }
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(from + (target - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick); else prev.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{decimals ? shown.toFixed(decimals) : Math.round(shown)}</>;
}

/* Children fade up one after another instead of all at once. */
function Stagger({ children, step = 45, className = "" }) {
  const items = React.Children.toArray(children);
  return (
    <div className={className}>
      {items.map((c, i) => (
        <div key={i} className="stagger-item" style={{ animationDelay: `${Math.min(i * step, 420)}ms` }}>{c}</div>
      ))}
    </div>
  );
}

function todOf(d) {
  const h = d.getHours();
  if (h < 6) return "night";
  if (h < 8) return "dawn";
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  if (h < 19.5) return "golden";
  if (h < 21) return "dusk";
  return "night";
}

/* ================= essay revisions ================= */

const REV_GAP_MS = 6 * 60 * 1000;

function pushRevision(note, text) {
  const revs = note.revisions || [];
  const last = revs[0];
  if (last && Date.now() - last.at < REV_GAP_MS) return revs;
  if (last && last.text === text) return revs;
  if (!text || !text.trim()) return revs;
  return [{ id: genId(), at: Date.now(), text, words: wordCount(text) }, ...revs].slice(0, 40);
}

function RevisionDrawer({ note, onRestore, onClose }) {
  const revs = note.revisions || [];
  return (
    <div className="workshop-drawer" style={{ background: CARD, borderTop: `1.5px solid ${BORDER}` }}>
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-xs font-semibold" style={{ color: MUTED }}>Earlier drafts — nothing is ever overwritten for good</span>
        <IconBtn label="Close drafts" onClick={onClose}><X size={14} /></IconBtn>
      </div>
      {revs.length === 0 && <div className="px-4 pb-4 text-sm" style={{ color: MUTED }}>No earlier drafts yet. One gets kept every few minutes while you write.</div>}
      {revs.map((r) => (
        <div key={r.id} className="px-4 py-2 flex items-start gap-2" style={{ borderTop: `1px solid ${BORDER_SOFT}` }}>
          <div className="flex-1">
            <div className="text-xs font-semibold" style={{ color: GOLD }}>
              {new Date(r.at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })} · {r.words} words
            </div>
            <div className="text-xs mt-0.5" style={{ color: MUTED }}>{r.text.slice(0, 130)}{r.text.length > 130 ? "…" : ""}</div>
          </div>
          <button onClick={() => onRestore(r)} className="text-xs font-semibold px-2 py-1 rounded-lg whitespace-nowrap" style={{ background: ACCENT_SOFT, color: GOLD }}>Restore</button>
        </div>
      ))}
    </div>
  );
}

/* ================= trash — deletes are recoverable for 30 days ================= */

function TrashPanel({ trash, onRestore, onPurge, onEmpty }) {
  return (
    <div>
      <div className="rounded-2xl p-4 mb-3" style={cardStyle({ borderLeft: `4px solid ${MUTED}` })}>
        <div className="text-sm font-semibold mb-1">Nothing leaves immediately</div>
        <div className="text-xs" style={{ color: MUTED }}>Anything you delete waits here for 30 days first. {trash.length > 0 && `${trash.length} item${trash.length === 1 ? "" : "s"} waiting.`}</div>
        {trash.length > 0 && <button onClick={onEmpty} className="text-xs mt-2 px-2 py-1 rounded-lg" style={{ border: `1px solid ${BORDER}`, color: RED }}>Empty the trash now</button>}
      </div>
      {trash.length === 0 && <SectionEmpty text="Nothing in the trash. That's a good sign." />}
      {trash.map((t) => (
        <div key={t.id} className="rounded-xl p-3 mb-2 flex items-center gap-2" style={cardStyle()}>
          <div className="flex-1">
            <div className="text-sm">{t.label}</div>
            <div className="text-xs" style={{ color: MUTED }}>{t.kind} · deleted {fmtDayShort(new Date(t.at).toISOString())}</div>
          </div>
          <button onClick={() => onRestore(t)} className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ background: ACCENT_SOFT, color: GOLD }}>Put it back</button>
          <IconBtn label="Delete forever" onClick={() => onPurge(t.id)}><Trash2 size={13} /></IconBtn>
        </div>
      ))}
    </div>
  );
}

/* ================= data safety ================= */

function BackupNudge({ lastBackup, onBackup, onDismiss }) {
  const days = lastBackup ? Math.floor((Date.now() - lastBackup) / 86400000) : null;
  return (
    <div className="rounded-2xl p-4 mb-3" style={cardStyle({ borderLeft: `5px solid ${CORAL}` })}>
      <div className="flex items-start gap-3">
        <span className="rounded-xl flex items-center justify-center" style={{ width: 38, height: 38, background: `${CORAL}22`, color: CORAL, flexShrink: 0 }}><Download size={18} /></span>
        <div className="flex-1">
          <div className="text-sm font-semibold">Back up your work</div>
          <div className="text-xs mt-0.5" style={{ color: MUTED }}>
            {days === null ? "You haven't saved a backup yet." : `Last backup was ${days} days ago.`} Everything lives in this browser only — clearing your history would take it with it.
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={onBackup} className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: ACCENT, color: ACCENT_TEXT }}>Save a backup</button>
            <button onClick={onDismiss} className="text-xs px-3 py-1.5 rounded-lg" style={{ border: `1px solid ${BORDER}`, color: MUTED }}>Later</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MissedReminders({ items, onDismiss, onOpen }) {
  if (!items.length) return null;
  return (
    <div className="rounded-2xl p-4 mb-3" style={cardStyle({ borderLeft: `5px solid ${RED}` })}>
      <div className="flex items-center gap-2 mb-2">
        <Bell size={15} style={{ color: RED }} />
        <span className="text-sm font-semibold">While you were away</span>
        <IconBtn label="Dismiss" onClick={onDismiss} style={{ marginLeft: "auto" }}><X size={14} /></IconBtn>
      </div>
      {items.slice(0, 5).map((r) => (
        <button key={r.id} onClick={onOpen} className="w-full text-left flex items-center gap-2 py-1.5" style={{ borderTop: `1px solid ${BORDER_SOFT}` }}>
          <span className="text-sm flex-1">{r.text}</span>
          <span className="text-xs" style={{ color: RED }}>{-daysUntil(r.dueAt.slice(0, 10))}d ago</span>
        </button>
      ))}
    </div>
  );
}

/* ================= the timeline, rebuilt so nothing collides ================= */

const TL_LANES = 3;

function Timeline({ now, schools, applications, milestones }) {
  const [hover, setHover] = useState(null);
  const marks = useMemo(() => {
    const out = [];
    const seen = {};
    schools.forEach((s) => {
      if (!s.deadline) return;
      const key = `${s.deadline}|${s.portal}`;
      if (!seen[key]) { seen[key] = { at: s.deadline, kind: "school", portal: s.portal, names: [], color: PORTAL_META[s.portal].color }; out.push(seen[key]); }
      seen[key].names.push(s.name);
    });
    applications.filter((a) => a.deadline && !["accepted", "rejected"].includes(a.status)).forEach((a) => {
      out.push({ at: a.deadline, kind: a.type, names: [a.name], color: a.type === "scholarship" ? VIOLET : SAGE });
    });
    out.push({ at: "2026-09-30", kind: "tag", names: ["UC TAG closes — UCI and UCSB"], color: GREEN });
    out.push({ at: "2027-03-02", kind: "aid", names: ["California aid priority deadline"], color: GREEN });
    return out.sort((a, b) => a.at.localeCompare(b.at));
  }, [schools, applications]);

  if (!marks.length) return null;
  const start = new Date(marks[0].at + "T00:00:00").getTime() - 20 * 86400000;
  const end = new Date(marks[marks.length - 1].at + "T00:00:00").getTime() + 20 * 86400000;
  const span = Math.max(1, end - start);
  const W = 340, ROW = 21, TOP = 34;
  const pos = (t) => 14 + ((t - start) / span) * (W - 28);

  /* Pack labels into lanes so two nearby dates never draw on top of each other. */
  const laneEnds = Array(TL_LANES).fill(-Infinity);
  const placed = marks.map((m) => {
    const x = pos(new Date(m.at + "T00:00:00").getTime());
    const width = Math.max(46, (m.names[0] || "").length * 4.6);
    let lane = laneEnds.findIndex((e) => x - width / 2 > e + 6);
    if (lane === -1) lane = laneEnds.indexOf(Math.min(...laneEnds));
    laneEnds[lane] = x + width / 2;
    return { ...m, x, lane, width, passed: new Date(m.at) < now, days: daysUntil(m.at) };
  });
  const H = TOP + TL_LANES * ROW + 16;
  const nowX = pos(now.getTime());
  const months = [];
  const cur = new Date(start); cur.setDate(1);
  while (cur.getTime() < end) { months.push(new Date(cur)); cur.setMonth(cur.getMonth() + 1); }

  return (
    <div className="rounded-2xl p-3 mb-3" style={cardStyle()}>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs uppercase font-semibold" style={{ color: GOLD, letterSpacing: "0.2em" }}>Everything ahead</div>
        <div className="text-xs" style={{ color: MUTED }}>{placed.filter((p) => !p.passed).length} still to come</div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", overflow: "visible" }} role="img" aria-label="Timeline of every upcoming deadline">
        {months.map((m) => {
          const x = pos(m.getTime());
          if (x < 10 || x > W - 10) return null;
          return (
            <g key={m.toISOString()}>
              <line x1={x} y1={TOP - 8} x2={x} y2={H - 12} stroke={BORDER_SOFT} strokeWidth="1" />
              <text x={x} y={H - 2} textAnchor="middle" style={{ fill: MUTED, fontSize: 8 }}>{m.toLocaleDateString([], { month: "short" })}</text>
            </g>
          );
        })}
        <line x1="14" y1={TOP - 8} x2={W - 14} y2={TOP - 8} stroke={BORDER} strokeWidth="1.5" />
        <line x1="14" y1={TOP - 8} x2={clamp(nowX, 14, W - 14)} y2={TOP - 8} style={{ stroke: ACCENT }} strokeWidth="3" strokeLinecap="round" />
        {placed.map((m, i) => (
          <g key={i} onMouseEnter={() => setHover(m)} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }} opacity={m.passed ? 0.42 : 1}>
            <line x1={m.x} y1={TOP - 8} x2={m.x} y2={TOP + m.lane * ROW + 3} stroke={m.color} strokeWidth="1" strokeDasharray="2 2" />
            <circle cx={m.x} cy={TOP - 8} r="3.4" style={{ fill: m.color }} />
            <rect x={m.x - m.width / 2} y={TOP + m.lane * ROW - 4} width={m.width} height="15" rx="7.5" style={{ fill: m.color }} opacity="0.14" />
            <text x={m.x} y={TOP + m.lane * ROW + 3.5} textAnchor="middle" dominantBaseline="middle" style={{ fill: m.color, fontSize: 8.5, fontWeight: 700 }}>
              {m.names.length > 1 ? `${m.names.length} due` : m.names[0].length > 13 ? m.names[0].slice(0, 12) + "…" : m.names[0]}
            </text>
          </g>
        ))}
        <g>
          <circle cx={clamp(nowX, 14, W - 14)} cy={TOP - 8} r="10" style={{ fill: ACCENT }} opacity="0.18" className="pulse-dot" />
          <circle cx={clamp(nowX, 14, W - 14)} cy={TOP - 8} r="5" style={{ fill: ACCENT }} />
          <text x={clamp(nowX, 22, W - 40)} y={TOP - 18} textAnchor="middle" className="font-display" style={{ fill: TEXT, fontSize: 8.5, fontWeight: 700 }}>today</text>
        </g>
      </svg>
      <div className="text-xs mt-1 text-center" style={{ color: hover ? TEXT : MUTED, minHeight: 30 }}>
        {hover ? (
          <>
            <span style={{ fontWeight: 700 }}>{fmtDayShort(hover.at + "T12:00:00")}</span>
            {hover.days >= 0 ? ` · in ${hover.days} days` : " · passed"}<br />
            <span style={{ color: MUTED }}>{hover.names.join(", ")}</span>
          </>
        ) : "Hover or tap a marker to see what it is"}
      </div>
    </div>
  );
}


/* These live inside long lists, so they skip re-rendering when their own props haven't changed. */
const TaskRow = React.memo(TaskRowImpl);
const ApplicationRow = React.memo(ApplicationRowImpl);
const SchoolRow = React.memo(SchoolRowImpl);
const BoardNote = React.memo(BoardNoteImpl);
const ActivityRow = React.memo(ActivityRowImpl);
const ReminderRow = React.memo(ReminderRowImpl);
const HabitRow = React.memo(HabitRowImpl);
const EventCard = React.memo(EventCardImpl);
const AssetCard = React.memo(AssetCardImpl);
