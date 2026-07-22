"use client";

import { motion } from "framer-motion";

export default function ThemeToggle() {
  return (
    <motion.button
      className="p-2"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
    </motion.button>
  );
}
