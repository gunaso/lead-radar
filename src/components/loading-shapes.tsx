import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

export default function LoadingShapes({
  className = "",
}: {
  className?: string
}) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <motion.div
        animate={{
          scale: [1, 1.7, 1.7, 1.7, 1],
          rotate: [0, 0, 180, 180, 0],
          borderRadius: ["0%", "0%", "50%", "50%", "0%"],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
          repeatDelay: 0.1,
        }}
        className="h-[70%] w-[70%] bg-primary"
      />
    </div>
  )
}
