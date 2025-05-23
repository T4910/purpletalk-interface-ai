
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { PlusCircleIcon, LayoutDashboard } from "lucide-react";

export default function MainSidebar() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div className="p-4 flex flex-col gap-2">
        <Button
          variant="default"
          className="justify-start w-full"
          onClick={() => navigate({ to: "/c/new" })}
        >
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          New Chat
        </Button>

        <Button
          variant="outline"
          className="justify-start w-full"
          onClick={() => navigate({ to: "/dashboard" })}
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
      </div>
    </div>
  );
}
