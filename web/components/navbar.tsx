"use client";

import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold">
          The Gradient
        </Link>
        <div className="flex items-center gap-4">
          <Link className="hover:underline" href="/">Home</Link>
          <Link className="hover:underline" href="/archive">Archive</Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
