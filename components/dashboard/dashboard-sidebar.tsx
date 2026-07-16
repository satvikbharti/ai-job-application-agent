"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AccountSetting01Icon,
  Briefcase01Icon,
  ChartEvaluationIcon,
  CoinsDollarIcon,
  CreditCardIcon,
  File02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const primaryNav = [
  {
    title: "Jobs",
    href: "/dashboard/jobs",
    icon: Briefcase01Icon,
  },
  {
    title: "Resume",
    href: "/dashboard/resume",
    icon: File02Icon,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: UserIcon,
  },
  {
    title: "Application Status",
    href: "/dashboard/application-status",
    icon: ChartEvaluationIcon,
  },
];

const footerNav = [
  {
    title: "Billing / Credits",
    href: "/dashboard/billing",
    icon: CreditCardIcon,
  },
  {
    title: "Profile Settings",
    href: "/dashboard/settings",
    icon: AccountSetting01Icon,
  },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="border-sidebar-border bg-sidebar/95"
    >
      <SidebarHeader className="border-b border-sidebar-border/70 p-3">
        <Link
          href="/dashboard"
          className="flex h-10 items-center gap-2 overflow-hidden rounded-md px-1.5 outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent focus-visible:ring-2"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
            <HugeiconsIcon
              icon={Briefcase01Icon}
              strokeWidth={2}
              className="size-5"
            />
          </span>
          <span className="min-w-0 text-base font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
            JobBuddy AI
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-1.5 py-3">
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {primaryNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    tooltip={item.title}
                    isActive={isActivePath(pathname, item.href)}
                    className="h-11 px-2.5 text-[0.95rem]"
                  >
                    <HugeiconsIcon
                      icon={item.icon}
                      strokeWidth={2}
                      className="size-5"
                    />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/70 p-3">
        <div
          className={cn(
            "rounded-md border border-sidebar-border bg-background/70 p-3 shadow-sm",
            "group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              <HugeiconsIcon
                icon={CoinsDollarIcon}
                strokeWidth={2}
                className="size-4"
              />
            </span>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="text-xs font-medium text-foreground">Credits</p>
              <p className="text-xs text-muted-foreground">128 available</p>
            </div>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-muted group-data-[collapsible=icon]:hidden">
            <div className="h-full w-2/3 rounded-full bg-emerald-500" />
          </div>
        </div>

        <SidebarSeparator className="mx-0" />

        <SidebarMenu className="gap-1">
          {footerNav.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                render={<Link href={item.href} />}
                tooltip={item.title}
                isActive={isActivePath(pathname, item.href)}
                className="h-11 px-2.5 text-[0.95rem]"
              >
                <HugeiconsIcon
                  icon={item.icon}
                  strokeWidth={2}
                  className="size-5"
                />
                <span className="font-medium">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
