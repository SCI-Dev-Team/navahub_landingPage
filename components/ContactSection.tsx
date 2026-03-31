"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HiEnvelope, HiMapPin, HiPhone, HiPaperAirplane } from "react-icons/hi2";
import { useI18n } from "@/components/I18nProvider";

export default function ContactSection() {
  const { t } = useI18n();
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const contactInfo = [
    { icon: <HiEnvelope className="w-5 h-5" />, label: t("contact.info.email"), value: "cambodia@navahub.org" },
    { icon: <HiPhone className="w-5 h-5" />, label: t("contact.info.phone"), value: "+855 12 345 678" },
    {
      icon: <HiMapPin className="w-5 h-5" />,
      label: t("contact.info.address"),
      value: t("contact.info.addressValue"),
    },
  ];
  const faqs = [
    { q: t("contact.faq.q1"), a: t("contact.faq.a1") },
    { q: t("contact.faq.q2"), a: t("contact.faq.a2") },
    { q: t("contact.faq.q3"), a: t("contact.faq.a3") },
    { q: t("contact.faq.q4"), a: t("contact.faq.a4") },
  ];

  return (
    <>

      {/* Contact grid */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8">
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
              <h2 className="text-2xl font-bold text-[#222221] mb-4 uppercase tracking-wide">{t("contact.details.heading")}</h2>
              <div className="space-y-4">
                {contactInfo.map((c) => (
                  <div key={c.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 text-[#DA291C] flex items-center justify-center shrink-0">
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
            {/* Map */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden h-56"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.902278420078!2d104.92406337585975!3d11.558862844272856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109513a11e8253b%3A0x2655e7df533763a9!2sSave%20the%20Children%20in%20Cambodia!5e0!3m2!1sen!2skh!4v1774672614669!5m2!1sen!2skh"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Save the Children in Cambodia"
              />
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
                <h3 className="text-xl font-bold text-[#222221]">{t("contact.success.title")}</h3>
                <p className="text-[#4A4F53] text-sm max-w-xs">
                  {t("contact.success.body")}
                </p>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSubmitted(false)}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-[#DA291C] text-white text-sm font-semibold"
                >
                  {t("contact.success.cta")}
                </motion.button>
              </motion.div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-[#222221] mb-6 uppercase tracking-wide">{t("contact.form.title")}</h2>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">{t("contact.form.firstName")}</label>
                      <input
                        required
                        type="text"
                        placeholder="Sopheak"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#DA291C] focus:border-transparent transition-shadow"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">{t("contact.form.lastName")}</label>
                      <input
                        required
                        type="text"
                        placeholder="Meas"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#DA291C] focus:border-transparent transition-shadow"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">{t("contact.form.email")}</label>
                    <input
                      required
                      type="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#DA291C] focus:border-transparent transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">{t("contact.form.subject")}</label>
                    <input
                      required
                      type="text"
                      placeholder={t("contact.form.subject")}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#DA291C] focus:border-transparent transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">{t("contact.form.message")}</label>
                    <textarea
                      required
                      rows={4}
                      placeholder={t("contact.form.messagePlaceholder")}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#DA291C] focus:border-transparent resize-none transition-shadow"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(218,41,28,0.3)" }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3 rounded-xl bg-[#DA291C] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#A51414] transition-colors"
                  >
                    <HiPaperAirplane className="w-4 h-4" />
                    {t("contact.form.send")}
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
            className="text-2xl font-bold text-[#222221] mb-8 text-center uppercase tracking-wide"
          >
            {t("contact.faq.heading")}
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
                    className="text-[#DA291C] font-bold text-lg shrink-0 ml-3"
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

