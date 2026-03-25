"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HiEnvelope, HiMapPin, HiPhone, HiPaperAirplane } from "react-icons/hi2";
import { FaFacebook, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

const contactInfo = [
  { icon: <HiEnvelope className="w-5 h-5" />, label: "Email", value: "cambodia@navahub.org" },
  { icon: <HiPhone className="w-5 h-5" />, label: "Phone", value: "+855 12 345 678" },
  { icon: <HiMapPin className="w-5 h-5" />, label: "Address", value: "Phnom Penh, Cambodia" },
];

const socials = [
  { icon: <FaXTwitter />, label: "X (Twitter)", href: "#" },
  { icon: <FaLinkedinIn />, label: "LinkedIn", href: "#" },
  { icon: <FaFacebook />, label: "Facebook", href: "#" },
  { icon: <FaInstagram />, label: "Instagram", href: "#" },
];

const faqs = [
  {
    q: "What is a Navathon?",
    a: "A Navathon is a hackathon organized by Save the Children focused on building tech solutions for real community challenges.",
  },
  {
    q: "Do I need coding experience?",
    a: "Not at all! We welcome designers, problem-solvers, community workers, and domain experts just as much as developers.",
  },
  {
    q: "Are Navathons free to join?",
    a: "Yes — all Navathons are completely free for participants. Some in-person events may provide meals and accommodation too.",
  },
  {
    q: "Can I organize a Navathon?",
    a: "Absolutely. Fill out the contact form with 'Organize a Navathon' as your subject and our team will be in touch.",
  },
];

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <section
        id="contact"
        className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-linear-to-b from-red-50 to-white"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="animate-blob absolute -top-20 -right-20 w-72 h-72 bg-red-100 rounded-full opacity-40 blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 text-[#CC0000] text-sm font-medium mb-5"
          >
            <span className="w-2 h-2 rounded-full bg-[#CC0000] animate-pulse" />
            Cambodia Support & Partnerships
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4"
          >
            Get in <span className="text-[#CC0000]">Touch Cambodia</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500"
          >
            Whether you want to join, organize, sponsor, or support programs in Cambodia, we&apos;re here to help.
          </motion.p>
        </div>
      </section>

      {/* Contact grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-10">
          {/* Left — info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cambodia Contact Details</h2>
              <div className="space-y-4">
                {contactInfo.map((c) => (
                  <div key={c.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 text-[#CC0000] flex items-center justify-center shrink-0">
                      {c.icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{c.label}</p>
                      <p className="text-sm font-medium text-gray-800">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Follow us</h3>
              <div className="flex gap-3">
                {socials.map(({ icon, label, href }) => (
                  <motion.a
                    key={label}
                    href={href}
                    aria-label={label}
                    whileHover={{ scale: 1.1, backgroundColor: "#CC0000", color: "#fff" }}
                    className="w-9 h-9 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center transition-colors"
                  >
                    {icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden h-44 bg-linear-to-br from-red-100 to-orange-100 flex items-center justify-center"
            >
              <div className="text-center">
                <span className="text-4xl">🗺️</span>
                <p className="text-sm text-gray-500 mt-2">Phnom Penh, Cambodia Office</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-sm p-8"
          >
            {submitted ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-12 gap-4"
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center"
                >
                  <span className="text-3xl">🎉</span>
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900">Message Sent!</h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  Thank you for reaching out. Our team will get back to you within 1–2 business days.
                </p>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSubmitted(false)}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-[#CC0000] text-white text-sm font-semibold"
                >
                  Send another message
                </motion.button>
              </motion.div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Send a Message</h2>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">First Name</label>
                      <input
                        required
                        type="text"
                        placeholder="Sopheak"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#CC0000] focus:border-transparent transition-shadow"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Last Name</label>
                      <input
                        required
                        type="text"
                        placeholder="Meas"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#CC0000] focus:border-transparent transition-shadow"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
                    <input
                      required
                      type="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#CC0000] focus:border-transparent transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Subject</label>
                    <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#CC0000] focus:border-transparent bg-white transition-shadow">
                      <option>Join a Navathon Cambodia</option>
                      <option>Organize a Navathon</option>
                      <option>Sponsor / Partner</option>
                      <option>Media Inquiry</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us what's on your mind..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#CC0000] focus:border-transparent resize-none transition-shadow"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(204,0,0,0.3)" }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3 rounded-xl bg-[#CC0000] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#aa0000] transition-colors"
                  >
                    <HiPaperAirplane className="w-4 h-4" />
                    Send Message
                  </motion.button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-gray-900 mb-8 text-center"
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    className="text-[#CC0000] font-bold text-lg shrink-0 ml-3"
                  >
                    +
                  </motion.span>
                </button>

                <motion.div
                  initial={false}
                  animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

