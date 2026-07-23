"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ThemeProvider from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

const pageTransition = {
  duration: 0.25,
  ease: "easeInOut",
};

export const metadata: Metadata = {
  title: "The Gradient",
  description: "AI newsletter with daily updates",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <AnimatePresence mode="wait" initial={false}>
            <motion.main
              key={pathname}
              className="min-h-screen transition-colors duration-300"
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              transition={pageTransition}
            >
              {children}
            </motion.main>
          </AnimatePresence>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
