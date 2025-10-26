"use client"
import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"

import LoadingShapes from "@/components/ui/loading-shapes"

const sentences = [
  "Decoding your digital DNA...",
  "Analyzing your website for top keywords...",
  "Uncovering hidden gems on your site...",
  "Our AI is learning about your business...",
  "Assembling your digital command center...",
  "Finding your future customers...",
  "Just a few more moments...",
]

export default function WebsiteLoading() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % sentences.length)
    }, 3000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <section className="flex grow flex-col items-center justify-center gap-12 h-full w-full">
      <LoadingShapes className="size-16 opacity-40" />
      <div className="flex flex-col items-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Processing your website content
        </h2>
        <AnimatePresence mode="wait">
          <motion.p
            key={sentences[index]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.6, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-center text-primary opacity-60 max-w-md"
          >
            {sentences[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </section>
  )
}
