"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/protected-route";
import { Course, CourseGrid } from "@/components/course-list"; // Importa el tipo Course y el componente CourseGrid
import { API_URL } from "@/app/config";

export default function Page() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_URL}/cursos`);
      if (!response.ok) {
        throw new Error("Error al obtener los cursos");
      }
      const result = await response.json();
      console.log(result);

      if (Array.isArray(result.data)) {
        // Filtra solo los cursos vigentes
        const vigentes = result.data
          .filter((course: any) => course.CUR_ESTADO === "VIGENTE") // Filtra por estado
          .map((course: any) => ({
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
          }));

        setCourses(vigentes); // Guarda solo los cursos vigentes
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

  // Función para actualizar la lista de cursos
  const handleUpdate = () => {
    fetchCourses(); // Obtener la lista actualizada de cursos
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
          {loading ? (
            <p>Cargando cursos...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <CourseGrid courses={courses} onUpdate={handleUpdate} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}