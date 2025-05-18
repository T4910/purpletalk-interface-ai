import React from "react";

export type TPropertyPanelSidebarContext = {
  state: "expanded" | "collapsed";
  propertyPanelopen: boolean;
  propertyPanelsetOpen: (open: boolean) => void;
  propertyPanelopenMobile: boolean;
  propertyPanelsetOpenMobile: (open: boolean) => void;
  propertyPanelisMobile: boolean;
  togglePropertyPanelSidebar: () => void;
  id: string;
};

export const PropertyPanelSidebarContext =
  React.createContext<TPropertyPanelSidebarContext | null>(null);

export function usePropertyPanelSidebar() {
  const context = React.useContext(PropertyPanelSidebarContext);
  if (!context) {
    throw new Error(
      "usePropertyPanelSidebar must be used within a PropertyPanelSidebarProvider."
    );
  }

  return context;
}
