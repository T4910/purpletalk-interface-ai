import * as React from "react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  TooltipProvider
} from "@/components/ui/tooltip"
import PropertiesPanel from "@/components/PropertiesPanel";
import { usePropertiesPanel } from "@/hooks/usePropertiesPanel";
import { Button } from "@/components/ui/button"
// import { Drawer } from "vaul"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "./drawer"
import { PropertyPanelSidebarContext, TPropertyPanelSidebarContext, usePropertyPanelSidebar } from "./usePropertyPanelContext"

const PropertyPanelSIDEBAR_WIDTH_MOBILE = "0rem"
const PropertyPanelSIDEBAR_KEYBOARD_SHORTCUT = "p"


const PropertyPanelSidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    propertyPaneldefaultOpen?: boolean
    propertyPanelopen?: boolean
    propertyPanelonOpenChange?: (open: boolean) => void
    // id: string
  }
>(
  (
    {
      propertyPaneldefaultOpen = false,
      propertyPanelopen: openProp,
      propertyPanelonOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)
    const globalStoreSetOpen  = usePropertiesPanel(store => store.setOpen)

    // This is the internal state of the PropertyPanelsidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(propertyPaneldefaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
          globalStoreSetOpen(openState)
        } else {
          _setOpen(openState)
          globalStoreSetOpen(openState)
        }
      },
      [setOpenProp, open, globalStoreSetOpen]
    )

    // Helper to toggle the PropertyPanelsidebar.
    const togglePropertyPanelSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the PropertyPanelsidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === PropertyPanelSIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          togglePropertyPanelSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [togglePropertyPanelSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the PropertyPanelsidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<TPropertyPanelSidebarContext>(
      () => ({
        state,
        propertyPanelopen: open,
        propertyPanelsetOpen: setOpen,
        propertyPanelisMobile: isMobile,
        propertyPanelopenMobile: openMobile,
        propertyPanelsetOpenMobile: setOpenMobile,
        togglePropertyPanelSidebar,
        id: props.id,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, togglePropertyPanelSidebar, props.id]
    )

    return (
      <PropertyPanelSidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/PropertyPanelsidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-PropertyPanelsidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </PropertyPanelSidebarContext.Provider>
    )
  }
)
PropertyPanelSidebarProvider.displayName = "PropertyPanelSidebarProvider"

const PropertyPanelSidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "PropertyPanelsidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }
>(
  (
    {
      side = "left",
      variant = "PropertyPanelsidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { propertyPanelisMobile, state, propertyPanelopenMobile, propertyPanelsetOpenMobile } = usePropertyPanelSidebar()

    if (propertyPanelisMobile) {
      return (
        <Drawer
          open={propertyPanelopenMobile}
          onOpenChange={propertyPanelsetOpenMobile}
        >
          {/* <DrawerTrigger>Open</DrawerTrigger> */}
          <DrawerContent>
            {/* <DrawerHeader>
              <DrawerTitle>Are you absolutely sure?</DrawerTitle>
              <DrawerDescription>This action cannot be undone.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter> */}
            <div className="flex h-[90dvh] w-[100dvw] mx-auto flex-col">{children}</div>
          </DrawerContent>
        </Drawer>
      );
    }

    return (
      <div
        ref={ref}
        className="group peer hidden md:block text-PropertyPanelsidebar-foreground"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the PropertyPanelsidebar gap on desktop */}
        <div
          className={cn(
            "duration-200 relative h-svh w-[70vw] bg-transparent transition-[width] ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
          )}
        />
        <div
          className={cn(
            "duration-200 fixed inset-y-0 z-10 hidden h-svh w-[70vw] transition-[left,right,width] ease-linear md:flex border-l",
            className
          )}
          {...props}
        >
          <div
            data-PropertyPanelsidebar="PropertyPanelsidebar"
            className="flex h-full w-full flex-col bg-PropertyPanelsidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-PropertyPanelsidebar-border group-data-[variant=floating]:shadow"
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
PropertyPanelSidebar.displayName = "PropertyPanelSidebar"


const PropertyPanelSidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className
      )}
      {...props}
    />
  )
})
PropertyPanelSidebarInset.displayName = "PropertyPanelSidebarInset"

const PropertiesPanelWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <PropertyPanelSidebarProvider>
      <PropertyPanelSidebarInset>
        {children}
      </PropertyPanelSidebarInset>
      {/* <AppPropertyPanelSidebar /> */}
        <PropertyPanelSidebar side="right"> 
            <div className="flex-1 h-full border- border-border/50 overflow-hidden">
                <PropertiesPanel />
            </div>
      </PropertyPanelSidebar>
    </PropertyPanelSidebarProvider>
  );
};

export default PropertiesPanelWrapper;