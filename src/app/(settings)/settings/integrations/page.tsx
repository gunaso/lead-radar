"use client"

import Image from "next/image"

import { CommingSoon } from "@/components/ui/comming-soon"
import {
  SettingsContainerElem,
  SettingsContainer,
} from "@/components/ui/settings-container"

import reddit from "@/assets/img/reddit.svg"
import slack from "@/assets/img/slack.svg"

export default function IntegrationsPage() {
  return (
    <section className="settings-section">
      <SettingsContainer>
        <SettingsContainerElem
          title="Reddit"
          preTitle={<Icon image={reddit} />}
        >
          <CommingSoon />
        </SettingsContainerElem>
        <SettingsContainerElem title="Slack" preTitle={<Icon image={slack} />}>
          <CommingSoon />
        </SettingsContainerElem>
      </SettingsContainer>
    </section>
  )
}

function Icon({ image }: { image: string }) {
  return (
    <div className="flex items-center justify-center w-10 h-10 p-2.5 rounded-md bg-background">
      <Image src={image} alt="icon" className="size-full" />
    </div>
  )
}
