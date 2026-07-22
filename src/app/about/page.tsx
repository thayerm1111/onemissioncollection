"use client";

/**
 * ABOUT / THE SEARCH
 *
 * This page enacts Matthew 18:13 rather than describing it. The visitor
 * arrives as "the one" — ninety-nine marks scatter as they scroll, one
 * remains, and only then do the founders appear as the two who went looking.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

/* ---------- deterministic scatter for the ninety-nine ---------- */
// Seeded so server and client render identically (no hydration mismatch).
function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(1813); // Matthew 18:13
const NINETY_NINE = Array.from({ length: 99 }, () => ({
  x: rand() * 100,          // vw %
  y: rand() * 100,          // vh %
  d: rand(),                // drift/stagger seed
  s: 2 + rand() * 3,        // size px
}));

/* ---------- the founders ---------- */
type Founder = {
  name: string;
  role: string;
  photo: string;
  pull: string;
  /** Long-form story, one string per paragraph. */
  story: string[];
  /** Optional pulled-out moment rendered as a callout mid-story. */
  highlight?: { before: number; lines: string[]; caption?: string };
  placeholder?: boolean;
};

const FOUNDERS: Founder[] = [
  {
    name: "Matthew Thayer",
    role: "Co-Founder",
    photo: "/founders/matthew.jpg",
    pull: "Somebody came back for me. So I go back for others.",
    story: [
      "I grew up learning how to adapt before I ever understood what stability was supposed to feel like.",
      "My parents separated when I was young, and much of my childhood was shaped by constant change. We moved from place to place, finances were often uncertain, and there were private battles within my family that I was too young to fully understand. I loved my family deeply, but there were seasons when the people around me were fighting struggles of their own, and I did not always know where I fit inside of them.",
      "I became good at adjusting. I learned how to walk into a new room, study my surroundings, and become whatever I needed to be to survive there. From the outside, that can look like strength. But when you spend enough time adapting to everyone and everything around you, it becomes difficult to know who you are when the room is finally quiet.",
      "For me, basketball became more than a game. It gave me structure when life felt unpredictable. It gave me discipline, expectations, and a place where effort produced a result. Coaches became mentors. Teammates became family. The court became one of the few places where the noise disappeared and I knew exactly what was being asked of me.",
      "Basketball carried me through high school and into college. It taught me how to compete, how to work when no one was watching, and how to keep showing up after disappointment. I learned that talent may open a door, but discipline, resilience, and consistency are what allow you to remain there. The game gave me confidence, but more importantly, it gave me a foundation.",
      "Sports taught me how to compete. Life taught me why I had to.",
      "When my basketball journey ended, I carried those lessons into business. I wanted to build something meaningful. I wanted to create a life that looked different from the circumstances I came from. At first, success felt like the answer. I thought that if I accomplished enough, earned enough, or impacted enough people, I would finally feel like I had outrun every part of my past.",
      "Over the years, I had the opportunity to build organizations, develop leaders, educate large communities, and impact people in cities and countries around the world. I watched individuals discover confidence, create opportunities for their families, and become versions of themselves they once believed were impossible.",
      "Those experiences changed my life. But they also taught me something success alone never could: achievement can give you a platform, but only purpose can tell you what to do with it.",
      "Behind the accomplishments, I was still carrying the younger version of myself — the child searching for stability, the athlete trying to prove he belonged, and the young man attempting to build a future without fully understanding the pain he had carried into it.",
      "The real turning point in my life was not one dramatic moment. It was people.",
      "It was the people who saw something in me before I could see it in myself. The coaches who demanded more from me. The mentors who challenged the way I thought. The friends who stayed. The leaders who gave me an opportunity. The people who continued to show up during seasons when it would have been easier to walk away.",
      "Somebody came back for me.",
      "They did not define me by where I had been. They reminded me of who I could still become. Their belief helped me understand that my past was not a life sentence. It could become the foundation of my purpose.",
      "Years later, that purpose became unmistakably clear.",
      "One Sunday, while sitting in church, I heard the message of Luke 15 — the story of the shepherd who leaves the ninety-nine to search for the one who has wandered away. I had heard the story before, but that day it felt different. It felt personal. I felt the Lord speaking directly into my life, showing me that everything I had experienced was not only about where I had been, but about who I was now being called to find.",
      "The one inspired me to leave the ninety-nine and go back for the one.",
      "Later that same day, something happened that I still struggle to explain without getting goosebumps.",
      "My name is Matthew. In high school football, I wore number 18. Years later, when I returned to football at the semi-professional level, I wore number 13. Because my football jersey displayed my name and numbers together, it read:",
      "I had never put it there as a Bible verse. To me, it was simply my name combined with the numbers I had worn. There was no deeper intention behind it.",
      "Then a friend saw the jersey and asked me, “What is Matthew 18:13 in the Bible?”",
      "When we looked it up, the verse carried the same message I had heard in church that morning: the joy of finding the one who had wandered away.",
      "In that moment, what I had felt in church was confirmed in a way I could never have planned. My name, my numbers, my return to football, the message of Luke 15, and the verse Matthew 18:13 all came together around the same purpose.",
      "It did not feel like coincidence. It felt like confirmation.",
      "It felt as though God had been writing the message into my story long before I was able to recognize it. The numbers I had worn, the name I had carried my entire life, and the experiences that once seemed disconnected were pointing toward one mission.",
      "That purpose is now at the heart of One Mission.",
      "Matthew 18:13 tells of the joy the shepherd feels when the one who wandered is found. That verse has become deeply personal to me because, in many ways, I was the one.",
      "I was the one trying to make sense of circumstances I could not control. I was the one searching for belonging in every new place. I was the one using sports, ambition, and achievement to cover questions I did not yet know how to answer. I was the one who looked strong from the outside while still trying to find direction within.",
      "And I know I am not the only one.",
      "One Mission was created for the person who feels overlooked in a world that celebrates crowds. It is for the person who has been through more than anyone realizes. The one rebuilding quietly. The one who feels behind, forgotten, or uncertain about what comes next. The one who knows there is something greater inside of them but has not yet found the path toward it.",
      "This brand is not about pretending the difficult chapters never happened. It is about refusing to let those chapters become the end of the story.",
      "Every piece we create carries that message. You are not defined by the home you came from, the mistakes you made, the people who left, or the seasons when you lost your way. You are still here. You still have purpose. You are still worth finding.",
      "As a co-founder, my mission is not simply to build a successful clothing company. It is to build something people can belong to — something that represents faith, resilience, identity, and the courage to keep moving forward. I want someone to put on One Mission and feel like they are wearing more than clothing.",
      "I want them to feel seen.",
      "I want the person who feels alone to know there is a community waiting for them. I want the athlete struggling behind the confidence to know that strength includes asking for help. I want the young person growing up in instability to know that where they begin does not determine where they finish. I want the dreamer who has been counted out to know that their life still has meaning.",
      "And I want the one who wandered away to know that somebody is still looking.",
      "Everything I have experienced — my childhood, sports, leadership, business, faith, failures, and victories — has brought me back to this mission. Not to stand above anyone, but to reach behind me. Not to build something that only looks successful, but to build something that makes people feel less alone.",
      "I once believed I was the one who had wandered too far. Then somebody came back for me.",
      "Now, God has called me to leave the ninety-nine and go back for the one.",
    ],
    // The football moment — sits after the "it read:" paragraph (index 18).
    highlight: {
      before: 19,
      lines: ["MATTHEW 18:13"],
      caption: "My name. My numbers. Written years before I understood it.",
    },
  },
  {
    name: "Joey Wilson",
    role: "Co-Founder",
    photo: "/founders/joey.jpg",
    pull: "Rock bottom does not have to be the end of your story.",
    story: [
      "I grew up in an amazing family with parents who loved me and wanted the best for me. I was the middle child, and even from a young age, I always felt a little different. I had a lot of friends, tons of energy, and I loved being around people, but when it came to school, I could never seem to get myself to focus. Sitting still, paying attention, and learning the traditional way never came naturally to me. I always thought outside the box and saw things differently than most people, but at the time, I didn’t understand that those qualities could eventually become strengths.",
      "For most of my childhood, I believed the only way to become successful was to get good grades, go to college, and follow the traditional path. Because I struggled so much in school, I started to believe there was something wrong with me and that success might not be possible for someone like me. My parents didn’t know what else to do, so they eventually enrolled me in an Alternative Learning Center. I wasn’t a bad kid, but I was lost, impressionable, and searching for a place where I felt like I belonged.",
      "Unfortunately, I found that sense of belonging in the wrong environment. I started surrounding myself with people who were making poor decisions, and eventually, I began making those same choices. I became a product of my environment, and the road I was on led me deeper and deeper into a dark place. What started as trying to fit in eventually led to selling drugs, getting arrested, and hitting rock bottom.",
      "I ended up spending a year in county jail, followed by a year and a half in Teen Challenge. I was also sentenced to 30 years of probation, but I was able to get off after 10 years because I followed the rules, stayed committed, and completely changed the direction of my life. During the darkest season of my life, while I was in the middle of doing my time, I came across a Bible verse that hit me like a ton of bricks.",
      "Galatians 6:9 says, “Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.”",
      "That verse became my anchor. It gave me hope that my life wasn’t over and reminded me that no matter how difficult the road became, I couldn’t give up. I still carry that verse with me every single day because it represents everything my life has become. Keep doing the right things, keep planting the right seeds, and trust that eventually the harvest will come.",
      "While I was incarcerated, I reconnected with my high school sweetheart. She started visiting me in jail at a time when most people would have walked away. She believed in me before I had anything to show for myself and saw something in me that I was only beginning to see in myself. On July 16, 2011, I walked out of jail with one garbage bag full of clothes and a dream. I didn’t have money, a perfect plan, or many opportunities, but I had a burning desire to build a different life.",
      "From that moment forward, I went on a heat-seeking mission to become the best version of myself. Shortly after getting out, I met a very successful Christian businessman who introduced me to the network marketing industry and eventually became my mentor. He taught me to get a crystal-clear picture of what I wanted my life to look like and then reverse engineer it. He showed me that success wasn’t about one big break. It was about simple daily disciplines compounded over time.",
      "I put the blinders on, cut the distractions and wrong influences out of my life, changed my environment, and locked in for a season. The same energy that once got me in trouble became the energy I used to build. The ability to think differently became an advantage. The people skills I had developed from always having friends became one of my greatest strengths. Over time, the qualities that made me feel out of place in school became the exact qualities that helped me succeed in business and leadership.",
      "Years later, I’ve had the opportunity to build sales teams all over the world and speak on stages in Croatia, Hungary, Qatar, Egypt, Slovakia, Sweden, Germany, Italy, and France. I’ve been able to teach and inspire others by sharing the same mindset, disciplines, and principles that helped me completely change my own life.",
      "Today, I’m married to that same high school sweetheart who visited me while I was in jail. We have two incredible children, we built our dream lake home in Minnesota, and we spend our winters down south. We homeschool our kids, have the time freedom to enjoy our lives together, and get to focus on making an impact in the lives of other people.",
      "Years ago, I heard Zig Ziglar say, “You can have everything in life you want if you will just help enough other people get what they want.” That quote has stayed with me because it represents the way I want to live my life.",
      "One Mission, to me, is about helping the next lost person who feels the way I once felt. The person who knows they are capable of more but doesn’t know where to start. The person who is praying for a community, a mentor, an opportunity, or someone to believe in them. It’s for the person who feels like they’ve gone too far or made too many mistakes to turn their life around.",
      "Because that person was me.",
      "One Mission is a reminder that your past does not have to determine your future. Rock bottom does not have to be the end of your story. Sometimes it becomes the foundation God uses to build an entirely new life.",
    ],
    // The verse he found while doing his time — sits after the paragraph
    // that quotes it (index 4).
    highlight: {
      before: 5,
      lines: ["GALATIANS 6:9"],
      caption: "Found in the darkest season. I still carry it every day.",
    },
  },
];

/**
 * Founder card. The stories run long, so only the opening paragraphs show
 * until someone chooses to read the rest — the page stays scannable and the
 * story stays whole for anyone who wants it.
 */
function FounderCard({ f }: { f: Founder }) {
  const [open, setOpen] = useState(false);
  const PREVIEW = 2;
  const hasMore = f.story.length > PREVIEW;
  const shown = open ? f.story : f.story.slice(0, PREVIEW);

  return (
    <article className="flex flex-col">
      <div className="mb-7 aspect-[4/5] w-full overflow-hidden bg-ink/5">
        {f.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={f.photo} alt={f.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-[10px] uppercase tracking-[0.3em] text-mute">Portrait</span>
          </div>
        )}
      </div>

      <blockquote className="text-xl leading-snug text-ink sm:text-2xl">
        &ldquo;{f.pull}&rdquo;
      </blockquote>

      <div className="mt-6 space-y-4">
        {shown.map((para, i) => (
          <div key={i}>
            <p className="text-[15px] leading-[1.85] text-ink/75">{para}</p>

            {/* the football moment */}
            {f.highlight && open && i === f.highlight.before - 1 && (
              <div className="my-8 border-y border-line py-8 text-center">
                {f.highlight.lines.map((l) => (
                  <div
                    key={l}
                    className="text-2xl text-ink sm:text-3xl"
                    style={{ letterSpacing: "0.16em" }}
                  >
                    {l}
                  </div>
                ))}
                {f.highlight.caption && (
                  <p className="mx-auto mt-4 max-w-xs text-[12px] leading-relaxed text-mute">
                    {f.highlight.caption}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* fade + toggle */}
      {hasMore && (
        <>
          {!open && (
            <div
              aria-hidden
              className="-mt-10 h-10"
              style={{ background: "linear-gradient(to bottom, transparent, #f4f4f2)" }}
            />
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="mt-5 flex items-center gap-2 self-start text-[11px] uppercase tracking-widest2 text-ink transition-opacity hover:opacity-60"
          >
            {open ? "Close" : `Read ${f.name.split(" ")[0]}'s full story`}
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        </>
      )}

      <div className="mt-7 border-t border-line pt-4">
        <p className="text-[13px] uppercase tracking-wider2 text-ink">{f.name}</p>
        <p className="mt-1 text-[11px] uppercase tracking-widest2 text-mute">{f.role}</p>
      </div>
    </article>
  );
}

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = heroRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), Math.max(total, 1));
      setP(total > 0 ? scrolled / total : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // eased phases
  const scatter = Math.min(p / 0.55, 1);            // 99 fade + drift away
  const gather = Math.min(Math.max((p - 0.1) / 0.6, 0), 1); // the one centers
  const verse = Math.min(Math.max((p - 0.3) / 0.45, 0), 1);
  const closing = Math.min(Math.max((p - 0.78) / 0.22, 0), 1);

  return (
    <div className="bg-paper text-ink">
      {/* ============ 1. THE NINETY-NINE ============ */}
      <section ref={heroRef} className="relative h-[320vh] bg-ink">
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* the ninety-nine */}
          <div className="absolute inset-0" aria-hidden>
            {NINETY_NINE.map((d, i) => {
              const dir = d.d * Math.PI * 2;
              const dist = scatter * (140 + d.d * 220);
              return (
                <span
                  key={i}
                  className="absolute rounded-full bg-paper"
                  style={{
                    left: `${d.x}%`,
                    top: `${d.y}%`,
                    width: d.s,
                    height: d.s,
                    opacity: (1 - scatter) * 0.55,
                    transform: `translate(${Math.cos(dir) * dist}px, ${Math.sin(dir) * dist}px)`,
                    transition: "opacity 120ms linear",
                  }}
                />
              );
            })}
          </div>

          {/* the one */}
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `translate(-50%,-50%) translate(${(1 - gather) * 34}vw, ${(1 - gather) * 26}vh) scale(${0.35 + gather * 0.65})`,
            }}
            aria-hidden
          >
            <span
              className="block rounded-full bg-paper"
              style={{
                width: 14,
                height: 14,
                boxShadow: `0 0 ${18 + gather * 70}px ${6 + gather * 26}px rgba(255,255,255,${0.10 + gather * 0.30})`,
              }}
            />
          </div>

          {/* verse */}
          <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 text-center">
            <p
              className="text-[11px] uppercase tracking-[0.4em] text-paper/50"
              style={{ opacity: verse }}
            >
              Matthew 18:13
            </p>
            <blockquote
              className="mt-7 text-balance text-2xl leading-[1.5] text-paper sm:text-4xl sm:leading-[1.45]"
              style={{ opacity: verse, transform: `translateY(${(1 - verse) * 18}px)` }}
            >
              &ldquo;If he finds it, truly I tell you, he rejoices more over that
              one sheep than over the ninety-nine that did not wander off.&rdquo;
            </blockquote>
            <p
              className="mt-10 text-sm uppercase tracking-widest2 text-paper sm:text-base"
              style={{ opacity: closing, transform: `translateY(${(1 - closing) * 14}px)` }}
            >
              We left the ninety-nine.
              <br className="sm:hidden" /> We&apos;re looking for you.
            </p>
          </div>

          {/* scroll cue */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-paper/40"
            style={{ opacity: 1 - Math.min(p * 4, 1) }}
          >
            Scroll
          </div>
        </div>
      </section>

      {/* ============ 2. YOU ARE THE ONE ============ */}
      <section className="mx-auto max-w-3xl px-6 py-28 text-center sm:py-40">
        <Eyebrow>You Are the One</Eyebrow>
        <h2 className="mt-6 text-3xl uppercase leading-tight tracking-widest2 sm:text-5xl">
          This was never about clothes
        </h2>
        <div className="mx-auto mt-10 max-w-xl space-y-6 text-[16px] leading-[1.85] text-ink/80">
          <p>
            Maybe you&apos;re tired in a way sleep doesn&apos;t touch. Maybe
            you&apos;re holding something you&apos;ve never said out loud. Maybe
            you&apos;re rebuilding, or ashamed, or just quietly wondering if
            anyone would come looking if you drifted far enough.
          </p>
          <p className="text-ink">
            You&apos;re the one. That&apos;s the whole point.
          </p>
          <p>
            The shepherd doesn&apos;t do math. He doesn&apos;t weigh ninety-nine
            against one and call it a good trade. He leaves. He goes out into
            the dark. And he does not stop walking until he&apos;s carrying you
            home.
          </p>
        </div>
      </section>

      {/* ============ 3. THE TWO WHO WENT LOOKING ============ */}
      <section className="border-t border-line bg-stone px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-site">
          <div className="text-center">
            <Eyebrow>The Two Who Went Looking</Eyebrow>
            <h2 className="mt-5 text-2xl uppercase tracking-widest2 sm:text-4xl">
              We were found first
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-mute">
              We don&apos;t run this from the outside looking in. We were the
              ones out there.
            </p>
          </div>

          <div className="mt-16 grid gap-14 md:grid-cols-2 md:gap-10">
            {FOUNDERS.map((f) => (
              <FounderCard key={f.name} f={f} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ 4. WHY CLOTHING ============ */}
      <section className="mx-auto max-w-3xl px-6 py-28 text-center sm:py-36">
        <Eyebrow>Why Clothing</Eyebrow>
        <h2 className="mt-6 text-2xl uppercase leading-tight tracking-widest2 sm:text-4xl">
          The garment is the invitation
        </h2>
        <div className="mx-auto mt-10 max-w-xl space-y-6 text-[16px] leading-[1.85] text-ink/80">
          <p>
            People asked why we didn&apos;t just start a nonprofit. Because a
            nonprofit waits for people to walk in. Clothing goes out.
          </p>
          <p>
            It goes to the gas station at 11pm. The gym. The waiting room. The
            back of a class. Somebody reads your back in line and asks what it
            means — and now you&apos;re having the conversation nobody scheduled.
          </p>
          <p className="text-ink">
            We make the invitation. You&apos;re the one who carries it.
          </p>
        </div>
      </section>

      {/* ============ 5. THE MISSION IN PRACTICE ============ */}
      <section className="border-y border-line px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-site">
          <div className="text-center">
            <Eyebrow>The Mission in Practice</Eyebrow>
            <h2 className="mt-5 text-2xl uppercase tracking-widest2 sm:text-3xl">
              Words are cheap. Here&apos;s the work.
            </h2>
          </div>
          {/* Two columns, not three — the "real partners" panel is out until
              there are named partners to put in it. Better an honest gap than
              a claim we can't back. */}
          <div className="mx-auto mt-14 grid max-w-3xl gap-10 sm:grid-cols-2">
            {[
              { k: "Every order", v: "Funds the search", d: "Five dollars from every purchase goes to a nonprofit working with people in crisis. Not a percentage of profit — five dollars, off the top, every single order." },
              { k: "The Inner Circle", v: "Nobody walks alone", d: "Being found is the start, not the finish. Our members get teaching, resources, and people who keep showing up." },
            ].map((s) => (
              <div key={s.k} className="text-center">
                <p className="text-[11px] uppercase tracking-widest2 text-mute">{s.k}</p>
                <p className="mt-3 text-lg uppercase tracking-wider2 text-ink">{s.v}</p>
                <p className="mx-auto mt-4 max-w-xs text-[14px] leading-relaxed text-mute">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 6. WHO'S YOUR ONE → FOUNDERS COLLECTION ============ */}
      <section className="bg-ink px-6 py-28 text-center text-paper sm:py-36">
        <div className="mx-auto max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.4em] text-paper/50">
            Now the question turns
          </p>
          <h2 className="mt-7 text-3xl uppercase leading-tight tracking-widest2 sm:text-5xl">
            Who&apos;s your one?
          </h2>
          <p className="mx-auto mt-7 max-w-lg text-[16px] leading-[1.85] text-paper/70">
            Somebody came back for you. There&apos;s a name you thought of while
            you read this. Go get them.
          </p>

          <div className="mx-auto mt-16 max-w-xl border border-paper/20 px-7 py-10 sm:px-10">
            <p className="text-[11px] uppercase tracking-[0.3em] text-paper/50">
              The Drop
            </p>
            <h3 className="mt-4 text-2xl uppercase tracking-widest2 sm:text-3xl">
              The Founders Collection
            </h3>
            <p className="mx-auto mt-5 max-w-sm text-[14px] leading-relaxed text-paper/70">
              The pieces we built from our own stories. Wear the mission, start
              the conversation, go back for the one.
            </p>
            <Link
              href="/featured"
              className="mt-8 inline-flex items-center gap-2 bg-paper px-8 py-4 text-xs uppercase tracking-widest2 text-ink transition-opacity hover:opacity-90"
            >
              Shop the Founders Collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <p className="mt-10 text-[13px] text-paper/50">
            Or{" "}
            <Link href="/inner-circle" className="border-b border-paper/40 pb-0.5 text-paper hover:opacity-70">
              join the search
            </Link>{" "}
            inside the Inner Circle.
          </p>
        </div>
      </section>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] uppercase tracking-[0.35em] text-mute">{children}</div>
  );
}
