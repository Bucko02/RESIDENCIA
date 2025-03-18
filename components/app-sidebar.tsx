"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  User2,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Define el tipo de datos del usuario
interface User {
  id: number;
  username: string;
  email: string;
}

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Usuarios",
      url: "/dashboard",
      icon: User2,
      isActive: true,
      items: [
        {
          title: "Administradores",
          url: "/Usuarios/Administradores",
        },
        {
          title: "Instructores",
          url: "/Usuarios/Instructores",
        },
        {
          title: "Participantes",
          url: "/Usuarios/Participantes",
        },
      ],
    },
    {
      title: "Cursos",
      url: "#",
      icon: GalleryVerticalEnd,
      items: [
        {
          title: "Gestionar Cursos",
          url: "/gestionar_cursos",
        },
        {
          title: "Recursos",
          url: "#",
        },
        {
          title: "Catalogo de cursos",
          url: "/catalogo_cursos",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Recupera los datos del usuario desde el localStorage
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;


  // Concatena el nombre completo
  const fullName = user
    ? `${user.Nombre} ${user.Apellido_pat} ${user.Apellido_mat}`
    : "Usuario";

  // Define los datos del usuario para el NavUser
  const userNavData = {
    name: fullName || "Usuario",
    email: user?.email || "example@example.com",
    avatar: "/logo_synergyex.png", // Puedes cambiar esto por la URL de la imagen del usuario
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userNavData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}