import Link from "next/link";
import { notFound } from "next/navigation";
import {
  HiArrowLeft,
  HiCalendarDays,
  HiCheckCircle,
  HiDocumentText,
  HiLightBulb,
  HiMapPin,
  HiSparkles,
  HiUsers,
} from "react-icons/hi2";
import { getProjectById } from "@/lib/projects";

type ProjectDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const parsedId = Number(id);

  if (Number.isNaN(parsedId)) {
    notFound();
  }

  const project = getProjectById(parsedId);

  if (!project) {
    notFound();
  }

  const locationLine =
    project.location === "Online"
      ? "across Cambodia, supported by local partners"
      : `in ${project.location}, Cambodia`;

  const impactMetrics = project.impact
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean);

  const tagsLine = project.tags.length ? project.tags.join(", ") : "community-led innovation";

  return (
    <>
      <section className="pt-28 pb-10 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-red-50 to-white">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#CC0000] transition-colors"
          >
            <HiArrowLeft className="w-4 h-4" />
            Back to Cambodia projects
          </Link>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CC0000]/10 border border-[#CC0000]/20">
                <span className="text-[#CC0000]">{project.emoji}</span>
                <p className="text-sm font-semibold text-[#CC0000]">{project.event}</p>
              </div>

              <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                {project.title}
              </h1>

              <p className="mt-4 text-gray-600 leading-relaxed max-w-3xl">
                {project.description} This page expands on the idea behind the build—why it matters, how the team
                approached it, and what change it aims to create {locationLine}.
              </p>
            </div>

            <aside className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Project at a glance
              </h2>

              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <HiUsers className="w-4 h-4 text-[#CC0000]" />
                  <span>
                    <strong className="text-gray-900">{project.team}</strong> ({project.members} members)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <HiMapPin className="w-4 h-4 text-[#CC0000]" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <HiCalendarDays className="w-4 h-4 text-[#CC0000]" />
                  <span>{project.date}</span>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Community impact</p>
                  <p className="mt-1 text-base font-semibold text-emerald-600">🌍 {project.impact}</p>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-[#CC0000] text-white font-semibold hover:bg-[#aa0000] transition-colors"
                >
                  Talk to us about collaborating
                  <HiSparkles className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          <article className="lg:col-span-2">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900">The story behind the build</h2>

              <div className="mt-4 space-y-5 text-gray-700 leading-relaxed">
                <p>
                  Every project starts with a real need. {project.title} was created to address a gap the team
                  observed while working with communities {locationLine}. In many places, the biggest challenge is not
                  just having information—it is having timely, actionable information that people can use immediately.
                </p>

                <p>
                  The core idea is straightforward: {project.description}. The approach centers on community-first
                  design—listening to what local partners can realistically operate, then shaping the product around
                  those workflows.
                </p>

                <p>
                  To make the solution work in real settings, the team focused on reliability, clarity, and
                  accessibility. Whether users face low connectivity or need to coordinate across stakeholders, the
                  goal stays the same: help people make better decisions faster.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-[#CC0000]/5 border border-[#CC0000]/10 p-5">
                  <div className="flex items-center gap-3">
                    <HiLightBulb className="w-5 h-5 text-[#CC0000]" />
                    <h3 className="text-base font-semibold text-gray-900">What problem it solves</h3>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    From {project.tags.join(" · ") || "community needs"} to day-to-day decision making, the project
                    targets friction points that prevent communities from getting the help they need.
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5">
                  <div className="flex items-center gap-3">
                    <HiCheckCircle className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-base font-semibold text-gray-900">How it changes outcomes</h3>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    {project.impact} is the headline, but the deeper outcome is trust—giving community members a tool
                    they can rely on and sharing results with the right people at the right time.
                  </p>
                </div>
              </div>

              <h3 className="mt-10 text-lg font-semibold text-gray-900">What the team built</h3>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-gray-100 p-5">
                  <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <HiDocumentText className="w-4 h-4 text-[#CC0000]" />
                    Features that match the workflow
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-gray-600 list-disc pl-5">
                    <li>Clear inputs for users, even with limited training</li>
                    <li>Simple outputs designed for community understanding</li>
                    <li>Guidance around next steps and escalation</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-gray-100 p-5">
                  <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <HiSparkles className="w-4 h-4 text-[#CC0000]" />
                    Built for real conditions
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-gray-600 list-disc pl-5">
                    <li>Designed to work across connectivity levels</li>
                    <li>Focused on responsiveness and low friction</li>
                    <li>Shaped to be maintainable by local partners</li>
                  </ul>
                </div>
              </div>

              <h3 className="mt-10 text-lg font-semibold text-gray-900">Technologies & topics</h3>
              <p className="mt-2 text-sm text-gray-600">
                The approach blends {tagsLine}. The goal is not just to demonstrate technology—it is to deliver a
                product communities can use confidently.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="mt-10 text-lg font-semibold text-gray-900">Timeline and milestones</h3>
              <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                  {[
                    {
                      title: "Discovery & community listening",
                      desc: "The team identified needs, mapped stakeholders, and gathered feedback on daily challenges.",
                    },
                    {
                      title: "Prototype and rapid testing",
                      desc: "A working version was created early, then improved based on practical usability checks.",
                    },
                    {
                      title: "Build for reliability",
                      desc: "Edge cases were handled thoughtfully so the system stays dependable in real settings.",
                    },
                    {
                      title: "Demo, learning, and handover",
                      desc: "The project was shared with partners, with notes on how it can be continued locally.",
                    },
                  ].map((step) => (
                    <div
                      key={step.title}
                      className="p-5 border-t sm:border-t-0 sm:border-r border-gray-100 last:border-r-0"
                    >
                      <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                      <p className="mt-2 text-sm text-gray-600">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <h3 className="mt-10 text-lg font-semibold text-gray-900">Impact signals we track</h3>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(impactMetrics.length ? impactMetrics : [project.impact]).slice(0, 3).map((metric, idx) => (
                  <div key={`${metric}-${idx}`} className="rounded-2xl bg-[#CC0000]/5 border border-[#CC0000]/10 p-5">
                    <p className="text-base font-bold text-[#CC0000]">{metric}</p>
                    <p className="mt-2 text-sm text-gray-600">
                      Measured through community feedback and partner reporting.
                    </p>
                  </div>
                ))}
              </div>

              <h3 className="mt-10 text-lg font-semibold text-gray-900">What’s next</h3>
              <div className="mt-4 rounded-2xl bg-gray-50 border border-gray-100 p-5">
                <p className="text-sm text-gray-700 leading-relaxed">
                  After the initial sprint, {project.team} can continue refining the solution with community partners.
                  The next iteration typically focuses on expanding coverage, improving onboarding, and strengthening
                  local ownership so the project stays useful long after the demo day.
                </p>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  If you’re a partner, school, or community organization interested in collaborating with NavaHub,
                  reach out and we’ll help connect you with the right team.
                </p>
              </div>
            </div>
          </article>

          <aside className="lg:sticky lg:top-28 h-fit">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900">Project info</h2>

              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <HiUsers className="w-4 h-4 text-[#CC0000]" />
                  <span>
                    <strong className="text-gray-900">{project.team}</strong> ({project.members} members)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <HiMapPin className="w-4 h-4 text-[#CC0000]" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <HiCalendarDays className="w-4 h-4 text-[#CC0000]" />
                  <span>{project.date}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs uppercase tracking-wide text-gray-500">Community Impact</p>
                <p className="mt-2 text-base font-semibold text-emerald-600">🌍 {project.impact}</p>
              </div>

              <div className="mt-6">
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-gray-100 text-gray-900 font-semibold hover:bg-gray-200 transition-colors"
                >
                  Browse more projects
                  <HiArrowLeft className="w-4 h-4 rotate-180 ml-2" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
