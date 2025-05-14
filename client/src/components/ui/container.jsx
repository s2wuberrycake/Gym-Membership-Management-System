import * as React from "react"

import { cn } from "@/lib/utils"

function Container({ className, children, ...props }) {
  return (
    <div
      data-slot="container"
      className={cn(
        "bg-card text-card-foreground rounded-2xl border",
        className
      )}
      {...props}
    >
      <div className="flex flex-col space-y-6 p-6">{children}</div>
    </div>
  )
}

function ContainerHeader({ className, ...props }) {
  return (
    <div
      data-slot="container-header"
      className={cn(
        "@container/container-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=container-action]:grid-cols-[1fr_auto]",
        className
      )}
      {...props}
    />
  )
}

function ContainerTitle({ className, ...props }) {
  return (
    <div
      data-slot="container-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function ContainerDescription({ className, ...props }) {
  return (
    <div
      data-slot="container-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function ContainerAction({ className, ...props }) {
  return (
    <div
      data-slot="container-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function ContainerContent({ className, ...props }) {
  return (
    <div
      data-slot="container-content"
      className={cn("", className)}
      {...props}
    />
  )
}

function ContainerFooter({ className, ...props }) {
  return (
    <div
      data-slot="container-footer"
      className={cn("flex items-center", className)}
      {...props}
    />
  )
}

export {
  Container,
  ContainerHeader,
  ContainerFooter,
  ContainerTitle,
  ContainerAction,
  ContainerDescription,
  ContainerContent,
}