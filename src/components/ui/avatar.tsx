"use client"

import * as React from "react"

import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn, getInitials } from "@/lib/utils"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

function ProfileAvatar({
  image,
  name,
  className,
}: {
  image: string | null
  name: string
  className?: string
}) {
  return (
    <Avatar className={cn("rounded-full size-8", className)}>
      <AvatarImage src={image || undefined} />
      <AvatarFallback className="text-2xs font-semibold bg-accent">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  )
}

function WorkspaceAvatar({
  logo,
  company,
  className,
}: {
  logo: string | null
  company: string
  className?: string
}) {
  return (
    <Avatar className={cn("size-8 rounded-sm text-2xs", className)}>
      <AvatarImage className="rounded-sm" src={logo ?? ""} alt={company} />
      <AvatarFallback className="rounded-sm bg-gradient-to-t from-[color-mix(in_oklch,var(--accent),var(--primary)_40%)] to-[color-mix(in_oklch,var(--accent),var(--primary)_10%)] text-accent-foreground font-semibold">
        {getInitials(company)}
      </AvatarFallback>
    </Avatar>
  )
}

function SubredditAvatar({
  image,
  name,
  className,
  classFallback,
}: {
  image: string | null
  name: string
  className?: string
  classFallback?: string
}) {
  return (
    <Avatar className={cn("size-7 rounded-full", className)}>
      <AvatarImage src={image || undefined} alt={name} />
      <AvatarFallback
        className={cn(
          "text-sm font-semibold text-muted-foreground",
          classFallback
        )}
      >
        r/
      </AvatarFallback>
    </Avatar>
  )
}

function CompetitorAvatar({
  logo,
  company,
  className,
}: {
  logo: string | null
  company: string
  className?: string
}) {
  return (
    <Avatar className={cn("size-8 rounded-sm text-2xs", className)}>
      <AvatarImage className="rounded-sm" src={logo ?? ""} alt={company} />
      <AvatarFallback className="rounded-sm bg-gradient-to-t from-[color-mix(in_oklch,var(--secondary),black_10%)] to-[color-mix(in_oklch,var(--secondary),black_0%)] text-secondary-foreground font-semibold">
        {getInitials(company)}
      </AvatarFallback>
    </Avatar>
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  ProfileAvatar,
  WorkspaceAvatar,
  SubredditAvatar,
  CompetitorAvatar,
}
