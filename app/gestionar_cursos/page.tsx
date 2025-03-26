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
import ProtectedRoute from "@/components/protected-route";
import { Course, CourseTable } from "@/components/table-course"; // Cambia CourseGrid por CourseTable

import { API_URL } from "@/app/config";
import { STRAPI_URL } from "@/app/config";

export default function Page() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_URL}/cursos?populate=*`);
      if (!response.ok) {
        throw new Error("Error al obtener los cursos");
      }
      const result = await response.json();
      
      if (Array.isArray(result.data)) {
        const filteredCourses = result.data.map((course: any) => ({
          documentId: course.documentId,
          Clave: course.CUR_CLAVE,
          Nombre: course.CUR_NOMBRE_CURSO,
          Objetivo: course.CUR_OBJETIVO,
          Tipo: course.CUR_TIPO,
          Dirigido: course.CUR_DRIGIDO_A,
          Horas_tot: course.CUR_TOTAL_HORAS.toString(),
          Origen: course.CUR_ORIGEN,
          Modulo: course.CUR_MODULO || "N/A",
          Capacidad: course.CUR_CAPACIDAD.toString(),
          Costo: course.CUR_COSTO.toString(),
          Modalidad: course.CUR_MODALIDAD,
          Estado: course.CUR_ESTADO.toString(),
          CUR_IMAGEN: {
            url: course.CUR_IMAGEN?.url
              ? `${STRAPI_URL}${course.CUR_IMAGEN.url}`
              : "/logo_synergyex.png",
          },
        }));
        console.log(filteredCourses);
        setCourses(filteredCourses);
      } else {
        throw new Error("La respuesta de la API no contiene un array de cursos");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Hubo un error al cargar los cursos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleUpdate = () => {
    fetchCourses();
  };
  
  return (
    <ProtectedRoute>
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
                    <BreadcrumbLink href="#">
                      dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Gestionar Cursos</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div>
            <h1 className="text-custom-red text-4xl font-bold p-5 text-center">CURSOS</h1>
          </div>
            <div className="bg-custom-red text-white w-full">
              <h1 className="text-3xl p-4">Gestionar Cursos</h1>
            </div>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
              {loading ? (
                <p>Cargando cursos...</p>
              ) : error ? (
                <p>{error}</p>
              ) : (
                <CourseTable courses={courses} onUpdate={handleUpdate} />
              )}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}