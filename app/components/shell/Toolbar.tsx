"use client";

import {
  MaximizeIcon,
  MinimizeIcon,
  MoonIcon,
  PanelLeftIcon,
  Settings2Icon,
  SunIcon,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import * as React from "react";
import { useThemeToggle } from "@/components/motion/theme-toggle";
import { IconButton } from "@/components/ui/icon-button";
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuLinkItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuTrigger,
} from "@/components/ui/menu";
import { cn } from "@/lib/utils";
import { useShell } from "./ShellContext";

function useFullscreen() {
  const { fullscreenTarget } = useShell();
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    const onChange = () => setActive(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggle = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }
    const element = fullscreenTarget.current ?? document.documentElement;
    void element.requestFullscreen?.().catch(() => {});
  };

  return { active, toggle, hasTarget: () => Boolean(fullscreenTarget.current) };
}

/** The floating pill in the card's top-right corner. */
export function Toolbar({ className }: { className?: string }) {
  const { openDeposit, openCommand, toggleSidebar, sidebarCollapsed } =
    useShell();
  const { isDark, mounted, toggle: toggleTheme } = useThemeToggle({
    variant: "circle",
    start: "top-right",
  });
  const { theme, setTheme } = useTheme();
  const fullscreen = useFullscreen();

  return (
    <div
      className={cn(
        "border-apple flex items-center gap-1 rounded-full bg-surface p-1",
        className,
      )}
      role="toolbar"
    >
      <button
        className="tap-target inline-flex h-10 cursor-pointer items-center rounded-full px-4 font-medium text-foreground/80 text-sm outline-none transition-[background-color,color,scale] duration-150 ease-out hover:bg-surface-hover hover:text-heading focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-[0.97]"
        onClick={openDeposit}
        type="button"
      >
        Deposit
      </button>

      <span aria-hidden="true" className="mx-1 h-6 w-px bg-foreground/10" />

      <IconButton
        label={mounted && isDark ? "Light theme" : "Dark theme"}
        onClick={toggleTheme}
      >
        {mounted && !isDark ? <MoonIcon /> : <SunIcon />}
      </IconButton>

      <IconButton
        className="max-sm:hidden"
        label={fullscreen.active ? "Exit fullscreen" : "Fullscreen"}
        onClick={fullscreen.toggle}
      >
        {fullscreen.active ? <MinimizeIcon /> : <MaximizeIcon />}
      </IconButton>

      <IconButton
        active={sidebarCollapsed}
        className="max-lg:hidden"
        label={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
        onClick={toggleSidebar}
      >
        <PanelLeftIcon />
      </IconButton>

      <Menu>
        <MenuTrigger
          render={
            <button
              aria-label="Settings"
              className="tap-target inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground/80 outline-none transition-[background-color,color,scale] duration-150 ease-out hover:bg-surface-hover hover:text-heading focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-[0.94] data-popup-open:bg-surface-hover data-popup-open:text-heading [&_svg]:size-[18px] [&_svg]:stroke-[1.5]"
              type="button"
            />
          }
        >
          <Settings2Icon />
        </MenuTrigger>
        <MenuPopup align="end" className="w-56" sideOffset={10}>
          <MenuGroup>
            <MenuGroupLabel>Appearance</MenuGroupLabel>
            <MenuRadioGroup
              onValueChange={(value) => setTheme(String(value))}
              value={mounted ? theme : "dark"}
            >
              <MenuRadioItem value="dark">Dark</MenuRadioItem>
              <MenuRadioItem value="light">Light</MenuRadioItem>
              <MenuRadioItem value="system">System</MenuRadioItem>
            </MenuRadioGroup>
          </MenuGroup>
          <MenuSeparator />
          <MenuItem onClick={openCommand}>
            Command menu
            <MenuShortcut>⌘K</MenuShortcut>
          </MenuItem>
          <MenuLinkItem render={<Link href="/design" />}>
            Design system
          </MenuLinkItem>
        </MenuPopup>
      </Menu>
    </div>
  );
}
