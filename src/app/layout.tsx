"use client";

import "./globals.css";
import HelloMsg from "@/components/hello-msg";
import { NavBarElements, MobileNavBarElements } from "@/components/nav-bar-elements";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { use, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { AuthButton } from "@/components/auth-button";



export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);


  return (
    <html lang="de">
      <body className="bg-gray-50 text-gray-900">
        <SessionProvider>

          <header className="bg-white shadow-sm sticky top-0 z-50">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
              <Link href="/" className="text-xl font-bold text-cyan-600 hover:text-blue-700">

                🚀 TechRadar
              </Link>

              <div className="hidden md:flex items-center space-x-6">
                <NavBarElements />
                <AuthButton />
              </div>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:outline-none"
                aria-label="Toggle navigation"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </nav>

            <HelloMsg />

            {menuOpen && (
              <div className="md:hidden border-t bg-white shadow-md">
                <div className="flex flex-col px-4 py-3 space-y-2">
                  <MobileNavBarElements onItemClick={() => setMenuOpen(false)} />
                  <AuthButton variant="mobile" onClickItem={() => setMenuOpen(false)} />
                </div>
              </div>
            )}
          </header>

          <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>

          <footer className="mt-12 border-t py-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} – Technology Radar
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
