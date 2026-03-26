"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { useI18n } from "@/components/I18nProvider";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]  = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const pathname = usePathname();
  const { locale, setLocale, t } = useI18n();
  const isHome = pathname === "/";
  const isTransparent = isHome && !scrolled;
  const homeActiveRoute = isHome
    ? activeHash && activeHash.startsWith("#")
      ? activeHash
      : "/"
    : pathname;
  const navLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.projects"), href: isHome ? "#projects" : "/projects" },
    { label: t("nav.about"), href: isHome ? "#about" : "/about" },
    { label: t("nav.contact"), href: isHome ? "#contact" : "/contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sync = () => setActiveHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const scrollToHash = (hash: string) => {
    if (!hash.startsWith("#")) return;
    const id = hash.slice(1);
    const el = document.getElementById(id);
    if (!el) return;

    // Offset for fixed navbar.
    const navOffset = 72;
    // Extra spacing so the next section doesn't feel "stuck" to the previous one.
    const top = el.getBoundingClientRect().top + window.scrollY - navOffset + 10;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent border-transparent"
          : "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-md shadow-red-100/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-center h-16">
          <div className="hidden md:flex absolute left-0 items-center gap-1 rounded-full border border-gray-200 bg-white px-1 py-1">
            <button
              onClick={() => setLocale("en")}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                locale === "en" ? "bg-[#CC0000] text-white" : "text-black hover:text-[#CC0000]"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLocale("km")}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                locale === "km" ? "bg-[#CC0000] text-white" : "text-black hover:text-[#CC0000]"
              }`}
            >
              KM
            </button>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => {
              const isActive = homeActiveRoute === link.href;
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i + 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={(e) => {
                      if (link.href.startsWith("#") && isHome) {
                        e.preventDefault();
                        setActiveHash(link.href);
                        window.history.replaceState(null, "", link.href);
                        scrollToHash(link.href);
                      }
                    }}
                    className={`relative text-sm font-medium transition-colors group ${
                      isActive
                        ? "text-black"
                        : "text-black hover:text-[#CC0000]"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-0.5 bg-[#CC0000] rounded-full transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden absolute right-0 p-2 rounded-md ${
              "text-black hover:text-[#CC0000]"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <AnimatePresence mode="wait">
              {menuOpen ? (
                <motion.span key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
                  <HiXMark className="w-5 h-5" />
                </motion.span>
              ) : (
                <motion.span key="open" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
                  <HiBars3 className="w-5 h-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              <div className="mb-1 flex items-center gap-2">
                <button
                  onClick={() => setLocale("en")}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    locale === "en" ? "bg-[#CC0000] text-white" : "bg-gray-100 text-black"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLocale("km")}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    locale === "km" ? "bg-[#CC0000] text-white" : "bg-gray-100 text-black"
                  }`}
                >
                  KM
                </button>
              </div>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    onClickCapture={(e) => {
                      if (link.href.startsWith("#") && isHome) {
                        e.preventDefault();
                        setActiveHash(link.href);
                        window.history.replaceState(null, "", link.href);
                        scrollToHash(link.href);
                      }
                    }}
                    className={`block text-sm py-1 font-medium ${
                      homeActiveRoute === link.href
                        ? "text-black"
                        : "text-black hover:text-[#CC0000]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
