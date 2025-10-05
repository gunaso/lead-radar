import type { ReactElement, ReactNode } from "react"
import type { Metadata } from "next"

import { Toaster } from "@/components/ui/sonner"

import { MotionConfigProvider } from "@/providers/motion-config-provider"
import { ReactQueryProvider } from "@/providers/react-query-provider"

import "@/assets/css/styles.css"

export const metadata: Metadata = {
  title: "Prompted",
  description:
    "Track keywords and subreddits to find leads and rank higher in LLM's searches.",
  icons: {
    icon: "/favicon.webp",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>): ReactElement {
  return (
    <html lang="en">
      <body className="antialiased">
        <ReactQueryProvider>
          <MotionConfigProvider>{children}</MotionConfigProvider>
        </ReactQueryProvider>
        <Toaster richColors />
      </body>
    </html>
  )
}
