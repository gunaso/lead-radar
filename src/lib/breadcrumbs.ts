import type { BreadcrumbCrumb } from "@/components/header/header-context"

function base64Encode(input: string): string {
  try {
    if (typeof window === "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const nodeBuf = require("buffer").Buffer as typeof Buffer
      return nodeBuf.from(input, "utf-8").toString("base64")
    }
    return btoa(unescape(encodeURIComponent(input)))
  } catch {
    return ""
  }
}

function base64Decode(input: string): string {
  try {
    if (typeof window === "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const nodeBuf = require("buffer").Buffer as typeof Buffer
      return nodeBuf.from(input, "base64").toString("utf-8")
    }
    return decodeURIComponent(escape(atob(input)))
  } catch {
    return ""
  }
}

export function encodeBreadcrumbParam(
  crumbs: Array<Pick<BreadcrumbCrumb, "label" | "href">>
): string {
  try {
    const payload = JSON.stringify(
      crumbs.map((c) => ({ label: c.label, href: c.href }))
    )
    return base64Encode(payload)
  } catch {
    return ""
  }
}

export function decodeBreadcrumbParam(
  param: string
): Array<{ label: string; href?: string }> | null {
  if (!param) return null
  try {
    const json = base64Decode(param)
    const arr = JSON.parse(json)
    if (!Array.isArray(arr)) return null
    return arr
      .filter(
        (x: unknown) =>
          !!x && typeof (x as { label?: unknown }).label === "string"
      )
      .map((x: { label: string; href?: string }) => ({
        label: x.label,
        href: typeof x.href === "string" ? x.href : undefined,
      }))
  } catch {
    return null
  }
}


