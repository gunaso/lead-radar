import type { Metadata } from "next"
import type { ReactElement, ReactNode } from "react"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { ReactQueryProvider } from "../providers/react-query-provider"

export const metadata: Metadata = {
  title: "Lead Radar",
  description:
    "Track keywords and subreddits to find leads and rank higher in LLM's searches.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>): ReactElement {
  return (
    <html lang="en">
      <body className="antialiased">
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster richColors />
      </body>
    </html>
  )
}
