
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="hidden md:flex flex-col h-full w-64 bg-chat-sidebar border-r border-border">
      <div className="p-4">
        <Button variant="outline" className="w-full justify-start gap-2 bg-chat-sidebar">
          <Plus className="h-4 w-4" />
          <span>New chat</span>
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto scrollbar-thin px-2 py-2">
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm font-normal hover:bg-secondary/40 px-3"
          >
            <div className="flex-1 text-left truncate">What Are You In Pdf</div>
          </Button>
        </div>
      </div>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <span className="text-sm font-medium">U</span>
          </div>
          <div className="text-sm truncate">User</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
