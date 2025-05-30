"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  IconBook,
  IconDashboard,
  IconEye,
  IconInnerShadowTop,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavMain } from "./nav-main";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const data = [
    {
      title: "Dashboard",
      icon: IconDashboard,
      url: "/",
      isActive: pathname === "/",
    },
    {
      title: "Books",
      icon: IconBook,
      url: "/books",
      isActive: pathname === "/books",
      items: [
        {
          title: "List",
          url: "/books/list",
          icon: IconEye,
          isActive: pathname?.includes("/books/list"),
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">UNSADA Training</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data} />
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
