import type { StaticImageData } from "next/image"
import type { LucideProps } from "lucide-react"
import { forwardRef } from "react"

import microsoft from "@/assets/img/microsoft.svg"
import linkedin from "@/assets/img/linkedin.svg"
import google from "@/assets/img/google.svg"
import quote from "@/assets/img/quote.svg"

type SvgModule =
  | string
  | StaticImageData
  | React.ComponentType<React.SVGProps<SVGSVGElement>>

function createLucideFromSvg(svg: SvgModule, displayName: string) {
  const Icon = forwardRef<SVGSVGElement, LucideProps>(
    (
      {
        size = 24,
        color = "currentColor",
        strokeWidth = 2,
        absoluteStrokeWidth,
        className,
        style,
        ...rest
      },
      ref
    ) => {
      if (typeof svg === "function") {
        const SvgComponent = svg as React.ComponentType<
          React.SVGProps<SVGSVGElement>
        >
        return (
          <SvgComponent
            ref={ref as unknown as React.Ref<SVGSVGElement>}
            width={size}
            height={size}
            className={className}
            style={style}
            {...(rest as unknown as React.SVGProps<SVGSVGElement>)}
          />
        )
      }
      const url = typeof svg === "string" ? svg : (svg as StaticImageData).src
      return (
        <span
          ref={ref as unknown as React.Ref<HTMLSpanElement>}
          aria-hidden="true"
          className={className}
          style={{
            display: "inline-block",
            width: Number(size),
            height: Number(size),
            backgroundColor: color,
            WebkitMaskImage: `url(${url})`,
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            WebkitMaskSize: "contain",
            maskImage: `url(${url})`,
            maskRepeat: "no-repeat",
            maskPosition: "center",
            maskSize: "contain",
            ...(style as React.CSSProperties),
          }}
        />
      )
    }
  )
  Icon.displayName = displayName
  return Icon
}

export const GoogleIcon = createLucideFromSvg(
  google as unknown as SvgModule,
  "GoogleIcon"
)
export const LinkedInIcon = createLucideFromSvg(
  linkedin as unknown as SvgModule,
  "LinkedInIcon"
)
export const MicrosoftIcon = createLucideFromSvg(
  microsoft as unknown as SvgModule,
  "MicrosoftIcon"
)
export const QuoteIcon = createLucideFromSvg(
  quote as unknown as SvgModule,
  "QuoteIcon"
)
