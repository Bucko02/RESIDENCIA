import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

// Define y exporta el tipo Course
export type Course = {
  documentId: string;
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
  Estado: string;
  CUR_IMAGEN: {
    url: string;
  };
};

// Define el componente CourseCard
interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-full max-w-sm overflow-hidden rounded-lg shadow-lg cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen del curso */}
      <img
        src={course.CUR_IMAGEN.url}
        alt={course.Nombre}
        className="w-full h-48 object-cover"
      />

      {/* Información básica (siempre visible) */}
      <div className="p-4 bg-white">
        <h3 className="text-lg font-semibold">{course.Nombre}</h3>
        <p className="text-sm text-gray-600">{course.Clave}</p>
      </div>

      {/* Detalles adicionales (visible solo en hover) */}

      <div
        className={`absolute inset-0 bg-white bg-opacity-75 text-black p-4 transition-opacity duration-300 ${
          isHovered ? "opacity-120" : "opacity-0 " 
        }`}
      >
        <div className="space-y-4 overflow-y-auto h-[300px]">
        <h3 className="text-lg font-semibold">{course.Nombre}</h3>
        <p className="text-sm">{course.Objetivo}</p>
        <p className="text-sm"><strong>Horas totales:</strong> {course.Horas_tot}</p>
        <p className="text-sm"><strong>Modalidad:</strong> {course.Modalidad}</p>
        <p className="text-sm"><strong>Costo:</strong> ${course.Costo}</p>
        <p className="text-sm"><strong>Dirigido a:</strong> {course.Dirigido}</p>
        <p className="text-sm"><strong>Origen:</strong> {course.Origen}</p>
        <p className="text-sm"><strong>Módulo:</strong> {course.Modulo}</p>
        </div>
      </div>
    </div>
  );
};

// Define el componente CourseGrid
interface CourseGridProps {
  courses: Course[];
  onUpdate: () => void;
}

export const CourseGrid = ({ courses }: CourseGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar cursos basados en el término de búsqueda
  const filteredCourses = courses.filter((course) =>
    course.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Buscar cursos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-[50%] p-2 border rounded-md"
        />
      </div>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {filteredCourses.map((course) => (
          <CourseCard key={course.documentId} course={course} />
        ))}
      </div>
    </div>
  );
};