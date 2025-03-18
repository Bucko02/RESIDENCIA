import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Power, Trash2, Plus, CheckCircle, Wrench, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { DialogEditCourse } from "./dialog-edit-course";
import { DialogRegisterCourse } from "./dialog-register-course"; // Importa el nuevo componente
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { API_URL } from "@/app/config";

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
  onEdit: () => void;
  onChangeStatus: (newStatus: string) => void; // Nueva prop para cambiar el estado
  onDelete: () => void; // Nueva prop para eliminar el curso
}

const CourseCard = ({ course, onEdit, onChangeStatus, onDelete }: CourseCardProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

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
      <CardFooter
        className={`mt-auto`}
      >
        <div
          className={`flex w-full flex-col items-start justify-between rounded-md border px-4 py-3 sm:flex-row sm:items-start 
            ${
              course.Estado === "VIGENTE"
                ? "bg-green-100 border-green-200" // Verde para VIGENTE
                : course.Estado === "EN DESARROLLO"
                ? "bg-blue-100 border-blue-200" // Azul para EN DESARROLLO
                : "bg-red-100 border-red-200" // Rojo para BAJA
            }`}
        >
          <p className="text-sm font-medium leading-none">
            <span className="text-muted-foreground">Curso brindado por: {course.Tipo}</span>
          </p>
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Opciones</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Modificar curso
                </DropdownMenuItem>
                {/* Submenú para cambiar el estado del curso */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger
                    onMouseEnter={() => setIsSubmenuOpen(true)}
                    onMouseLeave={() => setIsSubmenuOpen(false)}
                  >
                    <Power className="mr-2 h-4 w-4" />
                    Cambiar estado del curso
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent
                    alignOffset={-10}
                    className="w-[180px]"
                    onMouseEnter={() => setIsSubmenuOpen(true)}
                    onMouseLeave={() => setIsSubmenuOpen(false)}
                  >
                    <DropdownMenuItem onClick={() => onChangeStatus("VIGENTE")}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      <span>VIGENTE</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onChangeStatus("EN DESARROLLO")}>
                      <Wrench className="mr-2 h-4 w-4" />
                      <span>EN DESARROLLO</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onChangeStatus("BAJA")}>
                      <XCircle className="mr-2 h-4 w-4" />
                      <span>BAJA</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem className="text-red-600" onClick={onDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar curso
                  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
};

// Define el componente CourseGrid
interface CourseGridProps {
  courses: Course[];
  onUpdate: () => void; // Nueva prop para actualizar la lista de cursos
}

export const CourseGrid = ({ courses, onUpdate }: CourseGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false); // Estado para el diálogo de registro

  // Filtrar cursos basados en el término de búsqueda
  const filteredCourses = courses.filter((course) =>
    course.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para manejar la creación de un nuevo curso
  const handleRegisterCourse = async (newCourse: any) => {
    try {
      const response = await fetch(`${API_URL}/cursos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            CUR_NOMBRE_CURSO: newCourse.Nombre,
            CUR_CLAVE: newCourse.Clave,
            CUR_TIPO: newCourse.Tipo,
            CUR_OBJETIVO: newCourse.Objetivo,
            CUR_DRIGIDO_A: newCourse.Dirigido,
            CUR_TOTAL_HORAS: parseInt(newCourse.Horas),
            CUR_ORIGEN: newCourse.Origen,
            CUR_CAPACIDAD: parseInt(newCourse.Capacidad),
            CUR_MODALIDAD: newCourse.Modalidad,
            CUR_COSTO: parseFloat(newCourse.Costo),
            CUR_MODULO: newCourse.Modulo,
            CUR_ESTADO: "VIGENTE", // Estado por defecto
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || "Error desconocido";
        console.error("Error:", errorMessage);
        setAlertTitle("Error");
        setAlertMessage(`Error al registrar el curso: ${errorMessage}`);
        setIsAlertOpen(true);
        throw new Error(errorMessage);
      }

      setAlertTitle("Éxito");
      setAlertMessage("Curso registrado correctamente");
      setIsAlertOpen(true);

      // Llamar a onUpdate para actualizar la lista de cursos en el componente padre
      onUpdate();

      // Cerrar el diálogo de registro
      setIsRegisterDialogOpen(false);
    } catch (error) {
      console.error("Error:", error);
      setAlertTitle("Error");
      setAlertMessage("Hubo un error al registrar el curso");
      setIsAlertOpen(true);
    }
  };

  // Función para manejar la actualización del curso
  const handleSaveCourse = async (updatedCourse: Course) => {
    try {
      const response = await fetch(`${API_URL}/cursos/${editingCourse?.documentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            CUR_NOMBRE_CURSO: updatedCourse.Nombre,
            CUR_CLAVE: updatedCourse.Clave,
            CUR_TIPO: updatedCourse.Tipo,
            CUR_OBJETIVO: updatedCourse.Objetivo,
            CUR_DRIGIDO_A: updatedCourse.Dirigido,
            CUR_TOTAL_HORAS: parseInt(updatedCourse.Horas_tot),
            CUR_ORIGEN: updatedCourse.Origen,
            CUR_CAPACIDAD: parseInt(updatedCourse.Capacidad),
            CUR_MODALIDAD: updatedCourse.Modalidad,
            CUR_COSTO: parseInt(updatedCourse.Costo),
            CUR_MODULO: updatedCourse.Modulo,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || "Error desconocido";
        console.error("Error:", errorMessage);
        setAlertTitle("Error");
        setAlertMessage(`Error al actualizar el curso: ${errorMessage}`);
        setIsAlertOpen(true);
        throw new Error(errorMessage);
      }

      setAlertTitle("Éxito");
      setAlertMessage("Curso actualizado correctamente");
      setIsAlertOpen(true);

      // Llamar a onUpdate para actualizar la lista de cursos en el componente padre
      onUpdate();

      // Cerrar el diálogo de edición
      setEditingCourse(null);
    } catch (error) {
      console.error("Error:", error);
      setAlertTitle("Error");
      setAlertMessage("Hubo un error al actualizar el curso");
      setIsAlertOpen(true);
    }
  };

  // Función para manejar el cambio de estado del curso
  const handleChangeStatus = async (courseId: string, newStatus: string) => {
    try {
      const response = await fetch(`${API_URL}/cursos/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            CUR_ESTADO: newStatus, // Nuevo estado del curso
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || "Error desconocido";
        console.error("Error:", errorMessage);
        setAlertTitle("Error");
        setAlertMessage(`Error al cambiar el estado del curso: ${errorMessage}`);
        setIsAlertOpen(true);
        throw new Error(errorMessage);
      }

      setAlertTitle("Éxito");
      setAlertMessage("Estado del curso actualizado correctamente");
      setIsAlertOpen(true);

      // Llamar a onUpdate para actualizar la lista de cursos en el componente padre
      onUpdate();
    } catch (error) {
      console.error("Error:", error);
      setAlertTitle("Error");
      setAlertMessage("Hubo un error al cambiar el estado del curso");
      setIsAlertOpen(true);
    }
  
  };

  // Función para manejar la eliminación del curso
  const handleDeleteCourse = async (courseId: string) => {
    try {
      const response = await fetch(`${API_URL}/cursos/${courseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || "Error desconocido";
        console.error("Error:", errorMessage);
        setAlertTitle("Error");
        setAlertMessage(`Error al eliminar el curso: ${errorMessage}`);
        setIsAlertOpen(true);
        throw new Error(errorMessage);
      }

      setAlertTitle("Éxito");
      setAlertMessage("Curso eliminado correctamente");
      setIsAlertOpen(true);

      // Llamar a onUpdate para actualizar la lista de cursos en el componente padre
      onUpdate();
    } catch (error) {
      console.error("Error:", error);
      setAlertTitle("Error");
      setAlertMessage("Hubo un error al eliminar el curso");
      setIsAlertOpen(true);
    }
  };

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
        <Button onClick={() => setIsRegisterDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar curso
        </Button>
      </div>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.documentId} // Usamos documentId como clave
            course={course}
            onEdit={() => setEditingCourse(course)} // Abre el diálogo de edición
            onChangeStatus={(newStatus) => handleChangeStatus(course.documentId, newStatus)} // Cambiar estado
            onDelete={() => handleDeleteCourse(course.documentId)} // Eliminar curso
          />
        ))}
      </div>

      {/* Diálogo de edición */}
      {editingCourse && (
        <DialogEditCourse
          curso={{
            documentId: editingCourse.documentId,
            CUR_NOMBRE_CURSO: editingCourse.Nombre,
            CUR_CLAVE: editingCourse.Clave,
            CUR_TIPO: editingCourse.Tipo,
            CUR_OBJETIVO: editingCourse.Objetivo,
            CUR_DRIGIDO_A: editingCourse.Dirigido,
            CUR_TOTAL_HORAS: parseInt(editingCourse.Horas_tot),
            CUR_ORIGEN: editingCourse.Origen,
            CUR_CAPACIDAD: parseInt(editingCourse.Capacidad),
            CUR_MODALIDAD: editingCourse.Modalidad,
            CUR_COSTO: parseFloat(editingCourse.Costo),
            CUR_MODULO: editingCourse.Modulo,
          }}
          onSave={(updatedCurso) => {
            const updatedCourse: Course = {
              documentId: updatedCurso.documentId,
              Clave: updatedCurso.CUR_CLAVE,
              Nombre: updatedCurso.CUR_NOMBRE_CURSO,
              Objetivo: updatedCurso.CUR_OBJETIVO,
              Tipo: updatedCurso.CUR_TIPO,
              Dirigido: updatedCurso.CUR_DRIGIDO_A,
              Horas_tot: updatedCurso.CUR_TOTAL_HORAS.toString(),
              Origen: updatedCurso.CUR_ORIGEN,
              Modulo: updatedCurso.CUR_MODULO,
              Capacidad: updatedCurso.CUR_CAPACIDAD.toString(),
              Costo: updatedCurso.CUR_COSTO.toString(),
              Modalidad: updatedCurso.CUR_MODALIDAD,
              Estado: editingCourse.Estado, // Asegúrate de incluir el estado
            };
            handleSaveCourse(updatedCourse);
          }}
          open={!!editingCourse}
          onOpenChange={(open) => setEditingCourse(open ? editingCourse : null)}
        />
      )}

      {/* Diálogo de registro de nuevo curso */}
      <DialogRegisterCourse
        open={isRegisterDialogOpen}
        onOpenChange={setIsRegisterDialogOpen}
        onSave={handleRegisterCourse} // Función para manejar el registro
      />

      {/* AlertDialog para mostrar mensajes */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={() => setIsAlertOpen(false)}>
            Aceptar
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};