"use client"

import type { CSSProperties, ReactElement } from "react"

import Lottie from "lottie-react"

import animationData from "@/assets/lottie/404.json"

type NotFoundAnimationProps = {
  className?: string
  style?: CSSProperties
}

export default function NotFoundAnimation({
  className,
  style,
}: NotFoundAnimationProps): ReactElement {
  return (
    <Lottie
      animationData={animationData}
      loop
      autoplay
      className={className}
      style={style}
    />
  )
}
