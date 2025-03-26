"use client";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DataTableDemo, User } from "@/components/table-user"; // Importa el componente de tabla
import ProtectedRoute from "@/components/protected-route"; // Importa el componente ProtectedRoute
import { API_URL } from "@/app/config"; // Importa la URL de la API
export default function Page() {
  const [users, setUsers] = useState<User[]>([]); // Estado para almacenar los usuarios
  const [loading, setLoading] = useState(true); // Estado para manejar el loading
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores

  // Función para obtener los usuarios de Strapi
  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${API_URL}/users?filters[role][type][$eq]=participante&populate=*`
      );
      if (!response.ok) {
        throw new Error("Error al obtener los usuarios");
      }
      const result = await response.json();
      console.log(result); // Verifica la estructura de la respuesta

      // Filtra los campos que no se necesitan
      const filteredUsers = result.map((user: any) => ({
        id: user.id,
        Nombre: user.Nombre,
        Apellido_pat: user.Apellido_pat,
        Apellido_mat: user.Apellido_mat,
        username: user.username,
        Telefono: user.Telefono,
        email: user.email,
        Fecha_nac: user.Fecha_nac,
        blocked: user.blocked,
      }));

      setUsers(filteredUsers); // Asigna los usuarios filtrados
    } catch (error) {
      console.error("Error:", error);
      setError("Hubo un error al cargar los usuarios");
    } finally {
      setLoading(false); // Finaliza el loading
    }
  };

  // Llamar a fetchUsers al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []); // El array vacío asegura que solo se ejecute una vez al montar el componente

  // Función para actualizar la lista de usuarios
  const handleUpdate = () => {
    fetchUsers(); // Obtener la lista actualizada de usuarios
  };

  return (
    <ProtectedRoute>
      {" "}
      {/* Envuelve el contenido con ProtectedRoute */}
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/Usuarios">Usuarios</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Instructores</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div>
            <h1 className="text-custom-red text-4xl font-bold p-5 text-center">USUARIOS</h1>
          </div>
            <div className="bg-custom-red text-white w-full">
              <h1 className="text-3xl p-4">Gestionar Participantes</h1>
            </div>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
              {loading ? (
                <p>Cargando usuarios...</p> // Muestra un mensaje de carga
              ) : error ? (
                <p>{error}</p> // Muestra un mensaje de error
              ) : (
                <DataTableDemo
                  data={users || []}
                  onUpdate={handleUpdate}
                  role="6" // Pasa el rol como prop
                />
              )}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}