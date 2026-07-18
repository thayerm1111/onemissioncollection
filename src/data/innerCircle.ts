// Inner Circle content model + starter content.
// Everything here is placeholder you (Matthew) can replace with the real
// audios, books, teachings, and experiences. Add items to these arrays and
// they render automatically. Set `href` to the real audio/video/PDF/RSVP link.

export type MediaKind = "audio" | "read" | "video";

export type LibraryItem = {
  id: string;
  kind: MediaKind;
  track: Track;
  title: string;
  author?: string;
  meta?: string; // "12 min listen" · "180 pages" · "24 min watch"
  summary: string;
  href?: string; // real media/PDF link; "#" = coming soon
};

export type Experience = {
  id: string;
  title: string;
  location: string;
  date: string; // human readable
  blurb: string;
  status?: "open" | "soon" | "waitlist";
  href?: string;
};

export type Resource = {
  id: string;
  title: string;
  format: string; // "PDF" · "Worksheet" · "Audio"
  blurb: string;
  href?: string;
};

export type Track = "Foundations" | "Discipline" | "Purpose" | "Faith";

export const TRACKS: Track[] = ["Foundations", "Discipline", "Purpose", "Faith"];

// Pinned feature at the top of the page.
export const WEEKLY = {
  eyebrow: "This Week",
  title: "Discipline Is a Form of Self-Respect",
  kind: "audio" as MediaKind,
  meta: "14 min listen",
  summary:
    "The gap between who you are and who you're becoming is closed in the boring, unseen reps. A short talk on treating your word to yourself as sacred.",
  href: "#",
};

export const LIBRARY: LibraryItem[] = [
  {
    id: "lib-1",
    kind: "audio",
    track: "Foundations",
    title: "Start Where You Are",
    author: "One Mission",
    meta: "18 min listen",
    summary:
      "You don't need the perfect conditions. A grounding session on beginning before you feel ready.",
    href: "#",
  },
  {
    id: "lib-2",
    kind: "read",
    track: "Foundations",
    title: "The 12 Principles",
    author: "One Mission",
    meta: "32 pages",
    summary:
      "The core values that shape how we live, build, and serve. Read it once a month.",
    href: "#",
  },
  {
    id: "lib-3",
    kind: "video",
    track: "Discipline",
    title: "Win the Morning",
    author: "One Mission",
    meta: "24 min watch",
    summary:
      "A practical walk-through of a morning routine that compounds. Steal what works, drop the rest.",
    href: "#",
  },
  {
    id: "lib-4",
    kind: "audio",
    track: "Discipline",
    title: "When Motivation Runs Out",
    author: "One Mission",
    meta: "16 min listen",
    summary:
      "Motivation is a mood. Systems are a decision. How to keep going when you don't feel like it.",
    href: "#",
  },
  {
    id: "lib-5",
    kind: "read",
    track: "Purpose",
    title: "Find the Assignment",
    author: "One Mission",
    meta: "21 pages",
    summary:
      "Purpose isn't found in a weekend. A framework for noticing what you were built to carry.",
    href: "#",
  },
  {
    id: "lib-6",
    kind: "video",
    track: "Purpose",
    title: "Build Something That Outlives You",
    author: "One Mission",
    meta: "31 min watch",
    summary:
      "On legacy, patience, and playing a long game in a short-game world.",
    href: "#",
  },
  {
    id: "lib-7",
    kind: "audio",
    track: "Faith",
    title: "The Ninety-Nine and the One",
    author: "One Mission",
    meta: "12 min listen",
    summary:
      "A reflection on Matthew 18:13 — the heart that leaves the ninety-nine to go after the one.",
    href: "#",
  },
  {
    id: "lib-8",
    kind: "read",
    track: "Faith",
    title: "Quiet Confidence",
    author: "One Mission",
    meta: "18 pages",
    summary:
      "Grounding your identity in something that doesn't move when results do.",
    href: "#",
  },
];

export const EXPERIENCES: Experience[] = [
  {
    id: "exp-1",
    title: "Inner Circle Live — Los Angeles",
    location: "Los Angeles, CA",
    date: "Spring 2026",
    blurb:
      "A one-day gathering of the community — teaching, workshops, and connection. Members get first access.",
    status: "soon",
    href: "#",
  },
  {
    id: "exp-2",
    title: "Sunrise Sessions Retreat",
    location: "Sedona, AZ",
    date: "Summer 2026",
    blurb:
      "A weekend reset in the desert. Movement, stillness, and small-group conversation.",
    status: "waitlist",
    href: "#",
  },
  {
    id: "exp-3",
    title: "One Mission Meetup — London",
    location: "London, UK",
    date: "Fall 2026",
    blurb:
      "Our first international meetup. An evening for the UK circle to build in person.",
    status: "soon",
    href: "#",
  },
];

export const RESOURCES: Resource[] = [
  {
    id: "res-1",
    title: "The 90-Day Reset",
    format: "PDF Workbook",
    blurb: "A guided plan to rebuild your habits one quarter at a time.",
    href: "#",
  },
  {
    id: "res-2",
    title: "Daily Examen Card",
    format: "PDF",
    blurb: "A one-page evening reflection you can print and keep by your bed.",
    href: "#",
  },
  {
    id: "res-3",
    title: "Movement Primer",
    format: "PDF",
    blurb: "A simple, equipment-free routine to move every day.",
    href: "#",
  },
];
