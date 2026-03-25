"use client";

import { motion, type Variants } from "framer-motion";

const categories = [
  { icon: "⚡", label: "Navathon",    count: 48, color: "bg-red-50 text-[#CC0000] border-red-100 hover:bg-red-100" },
  { icon: "🎓", label: "Workshops",   count: 35, color: "bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100" },
  { icon: "🌍", label: "Community",   count: 27, color: "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100" },
  { icon: "🏆", label: "Competitions",count: 19, color: "bg-yellow-50 text-yellow-700 border-yellow-100 hover:bg-yellow-100" },
  { icon: "🤝", label: "Networking",  count: 22, color: "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100" },
  { icon: "💡", label: "Ideathons",   count: 14, color: "bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-100" },
  { icon: "🎤", label: "Talks",       count: 11, color: "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100" },
  { icon: "📚", label: "Training",    count: 9,  color: "bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100" },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function Categories() {
  return (
    <section id="categories" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse by Program</h2>
          <p className="text-gray-500">Find the type of activity that matches your passion for impact.</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.label}
              variants={item}
              whileHover={{ scale: 1.08, y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border cursor-pointer transition-colors ${cat.color}`}
            >
              <motion.span
                className="text-2xl"
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.4 }}
              >
                {cat.icon}
              </motion.span>
              <span className="text-xs font-semibold text-center leading-tight">{cat.label}</span>
              <span className="text-xs opacity-60">{cat.count}</span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
