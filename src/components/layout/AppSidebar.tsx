'use client';
import Link from "next/link";
import Image from "next/image";
import * as React from "react";
import { Plus } from 'lucide-react';

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useTheme } from "@/hooks/useTheme";

const navigation = {
  main: [{ title: "sidebar_item", icon: Plus, url: "#" }],
  configuration: [{ title: "sidebar_item", icon: Plus, url: "#" }],
  activity: [{ title: "sidebar_item", icon: Plus, url: "#" }],
  management: [{ title: "sidebar_item", icon: Plus, url: "#" }],
};

export default function AppSidebar() {
  const { theme, isLoading } = useTheme();

  return (
    <Sidebar collapsible="icon" className="z-20">
      <SidebarHeader className="flex items-center justify-between relative px-4 py-6 border-b-2 z-50">
        <div className="flex items-center gap-2">
          {!isLoading && theme?.logoUrl ? (
            <Image
              src={theme.logoUrl}
              alt={`${theme.themeName} Logo`}
              className="size-6 group-data-[collapsible=icon]:hidden "
              width={40}
              height={24}
            />
          ) : (
            <Image
              src="/icons/logo.png" // fallback if no logo in DB
              alt="Default Logo"
              className="size-6 group-data-[collapsible=icon]:hidden"
              width={24}
              height={24}
            />
          )}
        </div>

        <span className="text-sm group-data-[collapsible=icon]:hidden">
          Powered by{" "}
          <Link
            href="https://prabisha.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 ml-1"
          >
            Prabisha Consulting
          </Link>
        </span>

        <SidebarTrigger className="h-7 w-7 rounded-full absolute z-50 top-6 -right-4 bg-primary text-primary-foreground hover:bg-primary/90" />
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto px-2">
        {Object.entries(navigation).map(([section, items]) => (
          <SidebarGroup key={section}>
            <SidebarGroupLabel className="uppercase text-xs font-bold text-muted-foreground group-data-[collapsible=icon]:hidden">
              {section}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon className="size-4" />
                        <span className="group-data-[collapsible=icon]:sr-only">
                          {item.title}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
