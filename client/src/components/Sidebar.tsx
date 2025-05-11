
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, Bookmark, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  // Group chats by date
  const chatsByDate = {
    "Today": [
      { id: 1, title: "What Are You In Pdf" },
      { id: 2, title: "Image Generation Help" }
    ],
    "Yesterday": [
      { id: 3, title: "React Query Tutorial" },
      { id: 4, title: "Tailwind CSS Tricks" }
    ]
  };
  
  return (
    <div 
      className={cn(
        "fixed left-0 top-0 h-full bg-chat-sidebar border-r border-border transition-all duration-300 z-10",
        isOpen ? "w-64" : "w-0 border-r-0"
      )}
    >
      {isOpen && (
        <>
          {/* Sidebar Content */}
          <div className="flex flex-col h-full">
            {/* Top section with buttons and close button */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex gap-2">
                <Button variant="outline" className="justify-start gap-2 bg-chat-sidebar rounded-md">
                  <Plus className="h-4 w-4" />
                  <span className="text-sm">New chat</span>
                </Button>
                <Button variant="outline" className="w-10 p-0 bg-chat-sidebar rounded-md">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Chat list */}
            <div className="flex-1 overflow-auto scrollbar-thin p-2">
              {Object.entries(chatsByDate).map(([date, chats]) => (
                <div key={date} className="mb-4">
                  <div className="text-xs text-muted-foreground font-medium mb-2 px-3">{date}</div>
                  <div className="space-y-1">
                    {chats.map(chat => (
                      <Button 
                        key={chat.id}
                        variant="ghost" 
                        className="w-full justify-start text-sm font-normal hover:bg-secondary/40 px-3 rounded-lg"
                      >
                        <div className="flex-1 text-left truncate">{chat.title}</div>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* User section */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-sm font-medium">U</span>
                </div>
                <div className="text-sm truncate">User</div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Sidebar Trigger (only visible when sidebar is closed) */}
      {!isOpen && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 left-4 bg-secondary/50 h-8 w-8 rounded-full"
          onClick={() => setIsOpen(true)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default Sidebar;
