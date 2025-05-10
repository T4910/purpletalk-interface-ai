
import { X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyListing from "./PropertyListing";

interface PropertiesPanelProps {
  onClose: () => void;
}

const PropertiesPanel = ({ onClose }: PropertiesPanelProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b border-border/50">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <h2 className="text-lg font-medium">Available Properties</h2>
        
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <User className="h-4 w-4" />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        <PropertyListing />
      </div>
    </div>
  );
};

export default PropertiesPanel;
