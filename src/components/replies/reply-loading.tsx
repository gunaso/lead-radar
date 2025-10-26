"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import LoadingShapes from "@/components/ui/loading-shapes"

const sentences = [
  "Reading the comments...",
  "Tailoring the bullet points to this post...",
  "Respcting the subreddit rules...",
  "Collecting information...",
  "Crafting value-driven ideas...",
  "Optimizing for conversion...",
]

export function ReplyLoading({ className }: { className?: string }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % sentences.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      className={
        className
          ? className
          : "flex flex-col items-center justify-center gap-3"
      }
    >
      <LoadingShapes className="size-8 opacity-40" />
      <AnimatePresence mode="wait">
        <motion.p
          key={sentences[index]}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.7, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="text-center text-primary/70 text-sm"
        >
          {sentences[index]}
        </motion.p>
      </AnimatePresence>
    </section>
  )
}

export default ReplyLoading
