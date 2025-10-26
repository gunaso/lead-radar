"use client"

import { CommingSoon } from "@/components/ui/comming-soon"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"

export default function NavCompetitors() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarGroupLabel className="gap-2">
          Competitors
          <CommingSoon />
        </SidebarGroupLabel>
      </SidebarMenu>
    </SidebarGroup>
  )
}

// import { useState } from "react"
// import Link from "next/link"
// import { motion, AnimatePresence } from "framer-motion"

// import { Ellipsis } from "lucide-react"

// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
// import { SidebarMenuButton } from "@/components/ui/sidebar"
// import { NavGroupContainer } from "./nav-group"
// import { collapseVariants } from "@/lib/motion-config"

// type CompetitorEntry = {
//   name: string
//   image: string | null
// }

// export default function NavCompetitors({
//   competitors,
// }: {
//   competitors: CompetitorEntry[]
// }) {
//   const [totalShowing, setTotalShowing] = useState(3)

//   return (
//     <NavGroupContainer label="Competitors">
//       <AnimatePresence initial={false}>
//         {competitors.slice(0, totalShowing).map((competitor) => (
//           <motion.div
//             key={competitor.name}
//             initial="closed"
//             animate="open"
//             exit="closed"
//             variants={collapseVariants}
//             className="overflow-hidden"
//           >
//             <SidebarMenuButton asChild>
//               <Link href={`/subreddits/${competitor.name}`}>
//                 <Avatar className="size-4 rounded-full">
//                   <AvatarImage
//                     src={competitor.image || undefined}
//                     alt={competitor.name}
//                   />
//                   <AvatarFallback className="text-2xs text-muted-foreground">
//                     r/
//                   </AvatarFallback>
//                 </Avatar>
//                 <span>{competitor.name}</span>
//               </Link>
//             </SidebarMenuButton>
//           </motion.div>
//         ))}
//       </AnimatePresence>
//       {totalShowing < competitors.length && (
//         <SidebarMenuButton onClick={() => setTotalShowing(totalShowing + 5)}>
//           <Ellipsis className="size-4" />
//           <span>More</span>
//         </SidebarMenuButton>
//       )}
//     </NavGroupContainer>
//   )
// }
