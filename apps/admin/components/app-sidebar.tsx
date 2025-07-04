"use client";

import * as React from "react";
import {
  IconCamera,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconHelp,
  IconInnerShadowTop,
  IconReport,
  IconSearch,
  IconSettings,
  IconUserCog,
} from "@tabler/icons-react";

import { BookOpen, Bot, SquareTerminal, UserCog } from "lucide-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Дүрэм журам",
      url: "/dashboard/policy", //profile_role: {name : ДХШМ}
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Нийт",
          url: "/dashboard/policy", // permission:{ path=/dashboard/policy action=READ }
        },
        {
          title: "Шинэ журам нэмэх",
          url: "/dashboard/policy/new", //  permission:{ path=/dashboard/policy/new action=CREATE }
        },
        {
          title: "Ангилал",
          url: "#",
        },
      ],
    },
    {
      title: "Үнэлгээ",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Нийт",
          url: "/dashboard/rating",
        },
        {
          title: "Шинэ үнэлгээ",
          url: "#",
        },
        {
          title: "Хүлээгдэж буй",
          url: "#",
        },
        {
          title: "Дууссан",
          url: "#",
        },
      ],
    },
    {
      title: "Үнэлгээний Тайлан",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Хураангуй тайлан",
          url: "#",
        },
        {
          title: "Тренд график",
          url: "#",
        },
        // {
        //   title: "Эрсдлийн үнэлгээ",
        //   url: "#",
        // },
      ],
    },
    {
      title: "Админ тохиргоо",
      url: "#",
      icon: UserCog,
      items: [
        {
          title: "Permission Control",
          url: "/dashboard/admin/permissions",
        },
        {
          title: "Role Control",
          url: "/dashboard/admin/roles",
        },
        {
          title: "Хэрэглэгчийн бүртгэл",
          url: "/dashboard/admin/users",
        },
      ],
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  // documents: [
  //   {
  //     name: "Бичиг баримт",
  //     url: "#",
  //     icon: IconDatabase,
  //   },
  //   {
  //     name: "Тайлан",
  //     url: "#",
  //     icon: IconReport,
  //   },
  //   {
  //     name: "Туслах",
  //     url: "#",
  //     icon: IconFileWord,
  //   },
  // ],
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  allPaths: string[]; // шинэ prop нэмж байна
};

export function AppSidebar({ allPaths, ...props }: AppSidebarProps) {
  console.log("ALLPATHS in App Side Bar =====>", allPaths);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">BGS.MN</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} allPaths={allPaths} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
