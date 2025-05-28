
import React, { useState } from "react";
import {
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon,
  SettingsIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserSettings } from "./UserSettings";
import { QueryKeys } from "@/services/keys";
import { useGetUserQuery, useUserLogoutMutation } from "@/services/provider/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import SpinLoader from "./SpinLoader";
import { Badge } from "./ui/badge";
import { useSidebar } from "./ui/sidebar";

export function TopNavUser() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { open } = useSidebar();
  const navigate = useNavigate();
  const { data: user } = useGetUserQuery()
  const { mutateAsync: logout, isPending: isLoggingOut } = useUserLogoutMutation();
  const queryClient = useQueryClient();

  if(open) return null;

  const handleLogout = () => {
    // Implement logout functionality here
    logout().then(() => {
      queryClient.clear()
      console.log("Logging out...");
      navigate({ to: "/", reloadDocument: true });
    });
  };
  const handleSettings = () => {
    setSettingsOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={'user.avatar'} alt={user.username} />
              <AvatarFallback>
                {user.username
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 bg-popover border shadow-md"
          align="end"
          forceMount
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.username}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="flex justify-between">
                <span className="flex items-center">
                  <CreditCardIcon className="mr-2 h-4 w-4" />
                  Billing
                </span>
                <Badge>{user.credits} credits</Badge>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettings}>
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOutIcon className="mr-2 h-4 w-4" />
            Log out
            {isLoggingOut && <SpinLoader className="ml-4" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserSettings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
