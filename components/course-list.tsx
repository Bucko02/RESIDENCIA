import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";


// Define y exporta el tipo Course
export type Course = {
  documentId: string; // Usamos documentId en lugar de id
  Clave: string;
  Nombre: string;
  Objetivo: string;
  Tipo: string;
  Dirigido: string;
  Horas_tot: string;
  Origen: string;
  Modulo: string;
  Capacidad: string;
  Costo: string;
  Modalidad: string;
  Estado: string; // Nuevo campo para el estado del curso
};

// Define el componente CourseCard
interface CourseCardProps {
  course: Course;
  
}

const CourseCard = ({ course}: CourseCardProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Card className="w-full max-w-sm flex flex-col">
      <CardHeader>
        <CardTitle>{course.Nombre}</CardTitle>
        <CardDescription>{course.Clave}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-justify"><strong>Objetivo:</strong> {course.Objetivo}</p>
        <p><strong>Horas totales:</strong> {course.Horas_tot}</p>
        <p><strong>Modalidad:</strong> {course.Modalidad}</p>
        <p><strong>Costo: $</strong> {course.Costo}</p>
      </CardContent>
      
    </Card>
  );
};

// Define el componente CourseGrid
interface CourseGridProps {
  courses: Course[];
  onUpdate: () => void; // Nueva prop para actualizar la lista de cursos
}

export const CourseGrid = ({ courses}: CourseGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");


  // Filtrar cursos basados en el término de búsqueda
  const filteredCourses = courses.filter((course) =>
    course.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y botón para agregar cursos */}
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Buscar cursos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm flex-grow"
        />
      </div>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.documentId} // Usamos documentId como clave
            course={course}
          />
        ))}
      </div>
    </div>
  );
};