
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
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserSettings } from "./UserSettings";
import { useGetUserQuery, useUserLogoutMutation } from "@/services/provider/auth";
import SpinLoader from "./SpinLoader";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/services/keys";
import { useNavigate } from "@tanstack/react-router";
import { Badge } from "./ui/badge";

export function NavUser() {
  const { isMobile } = useSidebar();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate()
  const { mutateAsync: logout, isPending: isLoggingOut } = useUserLogoutMutation();
  const queryClient = useQueryClient()
  const { data: user } = useGetUserQuery()

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
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage src={'user.avatar'} alt={user.username} />
                  <AvatarFallback className="rounded-lg">
                    {user.username
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.username}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
                <MoreVerticalIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-popover border shadow-md"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={'user.avatar'} alt={user.username} />
                    <AvatarFallback className="rounded-lg">
                      {user.username
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.username}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
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
                  Settings
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
        </SidebarMenuItem>
      </SidebarMenu>

      <UserSettings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
