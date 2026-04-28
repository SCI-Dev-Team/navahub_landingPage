"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type SiteChromeProps = {
  children: React.ReactNode;
};

export default function SiteChrome({ children }: SiteChromeProps) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const isRegisterPage = pathname.startsWith("/register");
  const hideChrome = isAdminPage || isRegisterPage;

  return (
    <>
      {!hideChrome ? <Navbar /> : null}
      <div className="flex-1">{children}</div>
      {!hideChrome ? <Footer /> : null}
    </>
  );
}
