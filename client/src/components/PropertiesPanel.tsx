import { X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyListing from "./PropertyListing";
import { usePropertiesPanel } from "@/hooks/usePropertiesPanel";
import { useSidebar } from "./ui/sidebar";
import { usePropertyPanelSidebar } from "./ui/usePropertyPanelContext";
import { NavUser } from "./nav-user";
import { TopNavUser } from "./TopNavUser";
import { usePropertyStore } from "@/store/usePropertyStore";

const PropertiesPanel = () => {
  const { togglePropertyPanelSidebar } = usePropertyPanelSidebar();
  const clearProperties = usePropertyStore((store) => store.clearProperties);


  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-center p-4 border-b border-border/50">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => {
            // close property panel
            togglePropertyPanelSidebar();
            clearProperties();
          }}
        >
          <X className="size-6" />
        </Button>

        <h2 className="text-lg font-medium">Available Properties</h2>
        <TopNavUser user={{
          name: "John Doe",
          email: "john@example.com",
          avatar: "/placeholder.svg",
        }} />
      </div>

      <div className="flex-1 overflow-hidden p-4 mx-auto">
        <PropertyListing />
      </div>
    </div>
  );
};

export default PropertiesPanel;
