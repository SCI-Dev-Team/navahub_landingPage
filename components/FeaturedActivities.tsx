"use client";

import { motion, type Variants } from "framer-motion";
import { HiCalendarDays, HiMapPin, HiUsers, HiChevronRight } from "react-icons/hi2";

const activities = [
  {
    id: 1,
    type: "Navathon",
    typeColor: "bg-red-100 text-[#CC0000]",
    title: "Navathon: Clean Water Solutions",
    org: "Save the Children",
    date: "Apr 12–14, 2025",
    location: "Phnom Penh + Online",
    prize: "Community Impact Award",
    participants: "320",
    tags: ["Water", "Health", "Rural Communities"],
    badge: "🔥 Trending",
    badgeColor: "bg-orange-100 text-orange-600",
    gradient: "from-[#CC0000] to-orange-500",
  },
  {
    id: 2,
    type: "Workshop",
    typeColor: "bg-orange-100 text-orange-700",
    title: "Design Thinking for Social Good",
    org: "NavaHub Community",
    date: "Apr 5, 2025",
    location: "Online",
    prize: null,
    participants: "180",
    tags: ["Design", "Problem Solving", "Impact"],
    badge: "✨ Free",
    badgeColor: "bg-emerald-100 text-emerald-600",
    gradient: "from-orange-400 to-amber-500",
  },
  {
    id: 3,
    type: "Navathon",
    typeColor: "bg-red-100 text-[#CC0000]",
    title: "Navathon: Education Access Hack",
    org: "Save the Children",
    date: "May 2–4, 2025",
    location: "Siem Reap, Cambodia",
    prize: "Community Impact Award",
    participants: "200",
    tags: ["Education", "EdTech", "Children"],
    badge: "🏆 Featured",
    badgeColor: "bg-amber-100 text-amber-600",
    gradient: "from-[#CC0000] to-red-400",
  },
  {
    id: 4,
    type: "Training",
    typeColor: "bg-blue-100 text-blue-700",
    title: "Tech for Humanitarian Response",
    org: "NavaHub Academy",
    date: "Apr 21–25, 2025",
    location: "Online",
    prize: null,
    participants: "90",
    tags: ["Humanitarian", "Tech", "Response"],
    badge: "🆕 New",
    badgeColor: "bg-blue-100 text-blue-600",
    gradient: "from-blue-500 to-teal-500",
  },
  {
    id: 5,
    type: "Navathon",
    typeColor: "bg-red-100 text-[#CC0000]",
    title: "Navathon: Child Safety Tech",
    org: "Save the Children",
    date: "May 10–12, 2025",
    location: "Online",
    prize: "Community Impact Award",
    participants: "450",
    tags: ["Child Safety", "Digital", "Protection"],
    badge: "🌱 Cause",
    badgeColor: "bg-green-100 text-green-600",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: 6,
    type: "Community",
    typeColor: "bg-amber-100 text-amber-700",
    title: "Community Builders Meetup",
    org: "NavaHub Community",
    date: "May 20, 2025",
    location: "Battambang, Cambodia",
    prize: null,
    participants: "75",
    tags: ["Networking", "Community", "Impact"],
    badge: "🤝 Open",
    badgeColor: "bg-red-100 text-[#CC0000]",
    gradient: "from-amber-500 to-orange-400",
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function FeaturedActivities() {
  return (
    <section id="activities" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Activities</h2>
            <p className="text-gray-500">Hand-picked Navathons and programs making a real difference.</p>
          </motion.div>
          <motion.a
            href="#"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-[#CC0000] hover:text-[#aa0000]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            whileHover={{ x: 4 }}
          >
            View all <HiChevronRight className="w-4 h-4" />
          </motion.a>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {activities.map((activity) => (
            <motion.article
              key={activity.id}
              variants={card}
              whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.10)" }}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer group"
            >
              {/* Gradient bar */}
              <div className={`h-1.5 bg-linear-to-r ${activity.gradient}`} />

              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${activity.typeColor}`}>
                    {activity.type}
                  </span>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${activity.badgeColor}`}>
                    {activity.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#CC0000] transition-colors mb-1 leading-snug">
                  {activity.title}
                </h3>
                <p className="text-xs text-gray-500 mb-4">{activity.org}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <HiCalendarDays className="w-3.5 h-3.5 shrink-0" />
                    {activity.date}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <HiMapPin className="w-3.5 h-3.5 shrink-0" />
                    {activity.location}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <HiUsers className="w-3.5 h-3.5 shrink-0" />
                    {activity.participants} participants
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {activity.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  {activity.prize ? (
                    <span className="text-sm font-bold text-[#CC0000]">🏅 {activity.prize}</span>
                  ) : (
                    <span className="text-sm font-medium text-emerald-600">Free to join</span>
                  )}
                  <motion.button
                    whileHover={{ x: 4 }}
                    className="text-xs font-semibold text-[#CC0000] hover:text-[#aa0000] transition-colors flex items-center gap-0.5"
                  >
                    Learn more <HiChevronRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
