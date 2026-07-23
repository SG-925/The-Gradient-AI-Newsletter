"use client";

import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right";
  staggerChildren?: [stagger?: number, delayChildren?: number];
}

const containerVariants = {
  up: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: -32 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0 },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function ScrollReveal({
  children,
  delay = 0,
  className = "",
  direction = "up",
  staggerChildren,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const containerVariant = containerVariants[direction];

  const transition = staggerChildren
    ? {
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: staggerChildren[0] ?? 0.1,
        delayChildren: staggerChildren[1] ?? 0,
      }
    : {
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      };

  const shouldStagger =
    staggerChildren !== undefined && React.Children.count(children) > 1;

  const content: ReactNode = shouldStagger
    ? React.Children.map(children, (child, i) => (
        <motion.div
          key={i}
          variants={childVariants}
          custom={i}
        >
          {child}
        </motion.div>
      ))
    : children;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariant}
      transition={transition}
      className={className}
    >
      {content}
    </motion.div>
  );
}
