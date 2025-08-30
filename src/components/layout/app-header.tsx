"use client";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useRef, useState } from "react";
import { Bell, Search, LogOut, X, Plus, Sun } from "lucide-react";

import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ThemeToggle from "../featuers/theme-toggle";
import GoogleTranslate from "../featuers/google-translate";
import Microphone from "../featuers/microphone";

interface AppHeaderProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export default function AppHeader({ user }: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [microphoneTranscript, setMicrophoneTranscript] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // Sync microphone transcript with search query when it changes
  React.useEffect(() => {
    if (microphoneTranscript.length > 0) {
      setSearchQuery(microphoneTranscript[microphoneTranscript.length - 1]);
      setMicrophoneTranscript([]); // Clear transcript after using it
    }
  }, [microphoneTranscript]);

  const clearSearch = () => {
    setSearchQuery("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handlePathnameChange = useCallback(() => {
    if (pathname) {
      const parts = pathname.split("/").filter(Boolean);
      let pageName = parts[parts.length - 1] || "dashboard";
      pageName = pageName
        .split(/[-_]/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      setActivePage(pageName);
    }
  }, [pathname]);

  React.useEffect(() => {
    handlePathnameChange();
  }, [handlePathnameChange]);

  const handleLogout = () => {
    signOut({
      callbackUrl: "/login",
    });
  };

  if (!user) {
    return (
      <header className="w-full backdrop-blur-lg bg-background/80 border-b">
        <div className="flex items-center justify-between px-4 lg:px-6 py-4">
          <Skeleton className="w-full h-10 rounded-md" />
        </div>
      </header>
    );
  }

  return (
    <header className="w-full backdrop-blur-lg bg-background/80 border-b-2 sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 lg:px-6 py-5">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex w-[350px] mx-4 relative">
            <div className="relative w-full max-w-md">
              {/* Search Icon */}
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

              {/* Input Field */}
              <Input
                ref={searchInputRef}
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                className="pl-10 pr-20 border border-input bg-background focus-visible:ring-2 focus-visible:ring-primary/40 transition-all"
              />

              {/* Clear (X) Button */}
              {searchQuery && (
                <X
                  onClick={clearSearch}

                />
              )}

              {/* Microphone Button */}
              <Microphone 
                setText={setMicrophoneTranscript} 
                className="absolute right-3 top-1/2 -translate-y-1/2 " 
              />
            </div>


            {/* Search Results Dropdown */}
            {searchOpen && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg  max-h-[400px] overflow-y-auto">
                <p>Search Results</p>
              </div>
            )}
          </div>

          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => {
              setSearchOpen(true);
              setTimeout(() => searchInputRef.current?.focus(), 0);
            }}
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Mobile Search Modal */}
          {searchOpen && (
            <div className="fixed inset-0 bg-background/90 backdrop-blur-sm  md:hidden p-4 z-20">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    ref={searchInputRef}
                    placeholder="Search posts, media, brands..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="rounded-sm pl-10 focus-visible:ring-primary/50"
                  />
                  {searchQuery && (
                    <X
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground cursor-pointer"
                      onClick={clearSearch}
                    />
                  )}
                </div>
                <Button variant="ghost" onClick={() => setSearchOpen(false)}>
                  Cancel
                </Button>
              </div>

              {/* Search Results */}
              {searchQuery && (
                <div className="bg-background rounded-md border max-h-[70vh] overflow-y-auto">
                  <p>Search Results</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications with dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-accent"
              >
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-96 max-h-[80vh] overflow-y-auto backdrop-blur-sm"
            >
              <DropdownMenuLabel className="flex justify-between items-center">
                <span>Notifications</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6"
                  disabled={isSubmitting}
                >
                  Mark all as read
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />
          <GoogleTranslate />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-2">
                <Avatar className="size-8">
                  <AvatarImage src={user?.image ?? ""} alt={user?.name ?? ""} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-sm">
                  <span className="font-semibold">{user.name}</span>
                  <span className="text-muted-foreground">{user.email}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 backdrop-blur-sm">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Plus className="mr-2 h-4 w-4" />
                <span>dropdonw_menu_item_1</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Plus className="mr-2 h-4 w-4" />
                <span>dropdonw_menu_item_2</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Plus className="mr-2 h-4 w-4" />
                <span>dropdonw_menu_item_3</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Plus className="mr-2 h-4 w-4" />
                <span>dropdonw_menu_item_4</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}