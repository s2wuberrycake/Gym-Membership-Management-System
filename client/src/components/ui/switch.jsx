import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-8 w-16 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}>
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-foreground/85 dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-background/85 pointer-events-none block size-6.5 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%+8px)] data-[state=unchecked]:translate-x-[calc(6%)]"
        )} />
    </SwitchPrimitive.Root>
  );
}

export { Switch }
