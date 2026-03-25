"use client";

import { motion } from "framer-motion";
import { FaXTwitter, FaLinkedinIn, FaFacebookF, FaYoutube } from "react-icons/fa6";
import { useI18n } from "@/components/I18nProvider";

const socials = [
  {
    icon: <FaXTwitter className="w-4 h-4" />,
    label: "X",
    href: "https://x.com/save_children",
  },
  {
    icon: <FaFacebookF className="w-4 h-4" />,
    label: "Facebook",
    href: "https://www.facebook.com/SavetheChildrenInternational",
  },
  {
    icon: <FaLinkedinIn className="w-4 h-4" />,
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/save-the-children-international",
  },
  {
    icon: <FaYoutube className="w-4 h-4" />,
    label: "YouTube",
    href: "https://www.youtube.com/@SavetheChildrenInternational",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const col = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Footer() {
  const { locale, t } = useI18n();
  const joinTitle = locale === "km" ? "ចូលរួមជាមួយយើង" : "Join Us";
  const quickTitle = locale === "km" ? "តំណភ្ជាប់រហ័ស" : "Quick Links";
  const followTitle = locale === "km" ? "តាមដានពួកយើង" : "FOLLOW US";

  const joinLinks =
    locale === "km"
      ? [
          {
            label: "បរិច្ចាគឥឡូវនេះ",
            href: "https://www.savethechildren.net/donate/donate-now-save-children-organic",
          },
          {
            label: "បរិច្ចាគជារៀងរាល់ខែ",
            href: "https://www.savethechildren.net/donate/donate-monthly-organic",
          },
          { label: "បេសកកម្មជាមួយយើង", href: "/campaign-with-us" },
          { label: "រៀន និងចែករំលែក", href: "/learn-share" },
          { label: "ដៃគូរបស់យើង", href: "/about-us/our-partners" },
          { label: "ការងារ", href: "/careers" },
        ]
      : [
          {
            label: "Donate Now",
            href: "https://www.savethechildren.net/donate/donate-now-save-children-organic",
          },
          {
            label: "Donate Monthly",
            href: "https://www.savethechildren.net/donate/donate-monthly-organic",
          },
          { label: "Campaign With Us", href: "/campaign-with-us" },
          { label: "Learn & Share", href: "/learn-share" },
          { label: "Our Partners", href: "/about-us/our-partners" },
          { label: "Careers", href: "/careers" },
        ];

  const quickLinks =
    locale === "km"
      ? [
          { label: "មជ្ឈដ្ឋានព័ត៌មាន", href: "/media-centre" },
          { label: "របាយការណ៍ស្រាវជ្រាវ", href: "/research-reports" },
          { label: "មជ្ឈមណ្ឌលទុកចិត្ត", href: "/about-us/accountability" },
          { label: "ទំនាក់ទំនង", href: "/about-us/contact-us" },
          { label: "អំពីយើង", href: "/about-us" },
        ]
      : [
          { label: "Media Centre", href: "/media-centre" },
          { label: "Research & Reports", href: "/research-reports" },
          { label: "Trust Centre", href: "/about-us/accountability" },
          { label: "Contact Us", href: "/about-us/contact-us" },
          { label: "About Us", href: "/about-us" },
        ];

  return (
    <footer className="bg-white text-gray-900 px-4 sm:px-6 lg:px-8 pt-14 pb-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10"
        >
          {/* Footer Image / Brand */}
          <motion.div variants={col}>
            <h2 className="sr-only">Footer Image</h2>
            <div className="space-y-3">
              <img
                loading="lazy"
                src="https://i.stci.uk/dam/-ch1876625.svg/3vpusv51ycd7wiqe5365d28lqc76w2lc.svg"
                width={266}
                height={56}
                alt="Footer brand"
                className="h-auto w-[170px] sm:w-[210px]"
              />
            </div>
          </motion.div>

          {/* Join Us */}
          <motion.div variants={col}>
            <h4 className="text-xs font-semibold text-black mb-4 uppercase tracking-wide">{joinTitle}</h4>
            <ul className="space-y-2.5">
              {joinLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-black/90 hover:text-[#CC0000] transition-colors"
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={col}>
            <h4 className="text-xs font-semibold text-black mb-4 uppercase tracking-wide">{quickTitle}</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-black/90 hover:text-[#CC0000] transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Follow Us */}
          <motion.div variants={col}>
            <h4 className="text-xs font-semibold text-black mb-4 uppercase tracking-wide">{followTitle}</h4>
            <ul className="flex items-center gap-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <motion.a
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.08, color: "#aa0000" }}
                    className="flex items-center justify-center text-[#CC0000] transition-colors"
                  >
                    {s.icon}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-xs text-gray-600">{t("footer.copy")}</p>
          <p className="text-xs text-gray-600">{t("footer.tagline")}</p>
        </motion.div>
      </div>
    </footer>
  );
}
