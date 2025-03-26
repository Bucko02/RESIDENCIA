"use client";

import * as React from "react";
import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus, CheckCircle, Wrench, XCircle, Pencil, Trash2, Power } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DialogEditCourse } from "./dialog-edit-course";
import { DialogRegisterCourse } from "./dialog-register-course";
import { API_URL } from "@/app/config";

export type Course = {
  documentId: string;
  Clave: string;
  Nombre: string;
  Objetivo: string;
  Tipo: string;
  Dirigido: string;
  Horas: string;
  Origen: string;
  Modulo: string;
  Capacidad: string;
  Costo: string;
  Modalidad: string;
  Estado: string;
  CUR_IMAGEN: {
    url: string; // URL de la imagen
  };
};

type RegisterCourse = {
  Nombre: string;
  Clave: string;
  Tipo: string;
  Objetivo: string;
  Dirigido: string;
  Horas: number;
  Origen: string;
  Modulo: string;
  Capacidad: number;
  Costo: number;
  Modalidad: string;
};

const columns = (
  onUpdate: () => void,
  setAlertTitle: (title: string) => void,
  setAlertMessage: (message: string) => void,
  setIsAlertOpen: (isOpen: boolean) => void,
  setIsDeleteDialogOpen: (isOpen: boolean) => void,
  setCourseToDelete: (course: Course | null) => void
): ColumnDef<Course>[] => [
  {
    accessorKey: "Clave",
    header: "Clave",
  },
  {
    accessorKey: "Nombre",
    header: "Nombre",
  },
  {
    accessorKey: "Tipo",
    header: "Tipo",
  },
  {
    accessorKey: "Horas",
    header: "Horas",
  },
  {
    accessorKey: "Modalidad",
    header: "Modalidad",
  },
  {
    accessorKey: "Costo",
    header: "Costo",
    cell: ({ row }) => `$${row.original.Costo}`,
  },

  {
    accessorKey: "CUR_IMAGEN",
    header: "Imagen",
    cell: ({ row }) => (
      <div className="relative group h-12 w-12">
        {/* Miniatura */}
        <img
          src={row.original.CUR_IMAGEN.url}
          alt="Miniatura"
          className="h-full w-full object-cover rounded border border-gray-200 cursor-pointer"
        />
  
        {/* Overlay de zoom (centrado en pantalla) */}
        <div className="
          fixed inset-0 flex items-center justify-center 
          hidden group-hover:flex z-[9999] 
          bg-black bg-opacity-70 backdrop-blur-sm
          pointer-events-none
        ">
          <div className="
            relative w-[60vw] max-w-2xl h-[60vh] max-h-[400px]
            p-4 bg-white rounded-xl shadow-2xl border border-gray-300
            pointer-events-auto  // Permite interactuar con este div
          ">
            <img
              src={row.original.CUR_IMAGEN.url}
              alt="Zoom"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    ),
    size: 60,
  },
  {
    accessorKey: "Estado",
    header: "Estado",
    cell: ({ row }) => (
      <div
        className={`px-2 py-1 rounded-md text-center text-xs font-medium ${
          row.original.Estado === "VIGENTE"
            ? "bg-green-100 text-green-800"
            : row.original.Estado === "EN DESARROLLO"
            ? "bg-blue-100 text-blue-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {row.original.Estado}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const course = row.original;

      const handleChangeStatus = async (newStatus: string) => {
        try {
          const response = await fetch(`${API_URL}/cursos/${course.documentId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: {
                CUR_ESTADO: newStatus,
              },
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error?.message || "Error desconocido";
            throw new Error(errorMessage);
          }

          setAlertTitle("Éxito");
          setAlertMessage("Estado del curso actualizado correctamente");
          setIsAlertOpen(true);
          onUpdate();
        } catch (error) {
          console.error("Error:", error);
          setAlertTitle("Error");
          setAlertMessage("Hubo un error al cambiar el estado del curso");
          setIsAlertOpen(true);
        }
      };

      const handleUpdateCourse = async (updatedCourse: Course) => {
        try {
          const response = await fetch(`${API_URL}/cursos/${updatedCourse.documentId}?populate=*`, {
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
                  CUR_TOTAL_HORAS: Number(updatedCourse.Horas),
                  CUR_ORIGEN: updatedCourse.Origen,
                  CUR_CAPACIDAD: Number(updatedCourse.Capacidad),
                  CUR_MODALIDAD: updatedCourse.Modalidad,
                  CUR_COSTO: Number(updatedCourse.Costo),
                  CUR_MODULO: updatedCourse.Modulo,
                  CUR_ESTADO: updatedCourse.Estado
                }
              }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error?.message || "Error desconocido";
              console.error("Error:", errorMessage);
            setAlertTitle("Error");
            setAlertMessage(`Error al actualizar el usuario: ${errorMessage}`);
            setIsAlertOpen(true);
            throw new Error(errorMessage);
          }

          setAlertTitle("Éxito");
          setAlertMessage("Curso actualizado correctamente");
          setIsAlertOpen(true);
          onUpdate();
        } catch (error) {
          console.error("Error:", error);
          setAlertTitle("Error");
          setAlertMessage("Hubo un error al actualizar el curso");
          setIsAlertOpen(true);
        }
      };

      const handleDeleteCourse = () => {
        setCourseToDelete(course);
        setIsDeleteDialogOpen(true);
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Opciones</DropdownMenuLabel>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Power className="mr-2 h-4 w-4" />
                Cambiar estado
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleChangeStatus("VIGENTE")}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  VIGENTE
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleChangeStatus("EN DESARROLLO")}>
                  <Wrench className="mr-2 h-4 w-4" />
                  EN DESARROLLO
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleChangeStatus("BAJA")}>
                  <XCircle className="mr-2 h-4 w-4" />
                  BAJA
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DialogEditCourse course={course} onSave={handleUpdateCourse} />
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600" 
              onClick={handleDeleteCourse}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar curso
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const CourseTable = ({ courses, onUpdate }: { courses: Course[]; onUpdate: () => void }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const handleRegisterCourse = async (newCourse: RegisterCourse) => {
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
            CUR_TOTAL_HORAS: newCourse.Horas,
            CUR_ORIGEN: newCourse.Origen,
            CUR_CAPACIDAD: newCourse.Capacidad,
            CUR_MODALIDAD: newCourse.Modalidad,
            CUR_COSTO: newCourse.Costo,
            CUR_MODULO: newCourse.Modulo,
            CUR_ESTADO: "VIGENTE",
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || "Error desconocido";
        throw new Error(errorMessage);
      }

      setAlertTitle("Éxito");
      setAlertMessage("Curso registrado correctamente");
      setIsAlertOpen(true);
      onUpdate();
    } catch (error) {
      console.error("Error:", error);
      setAlertTitle("Error");
      setAlertMessage("Hubo un error al registrar el curso");
      setIsAlertOpen(true);
    }
  };

  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      const response = await fetch(`${API_URL}/cursos/${courseToDelete.documentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || "Error desconocido";
        throw new Error(errorMessage);
      }

      setAlertTitle("Éxito");
      setAlertMessage("Curso eliminado correctamente");
      setIsAlertOpen(true);
      onUpdate();
    } catch (error) {
      console.error("Error:", error);
      setAlertTitle("Error");
      setAlertMessage("Hubo un error al eliminar el curso");
      setIsAlertOpen(true);
    } finally {
      setIsDeleteDialogOpen(false);
      setCourseToDelete(null);
    }
  };

  const table = useReactTable({
    data: courses || [],
    columns: columns(
      onUpdate,
      setAlertTitle,
      setAlertMessage,
      setIsAlertOpen,
      setIsDeleteDialogOpen,
      setCourseToDelete
    ),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por nombre..."
          value={(table.getColumn("Nombre")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("Nombre")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="ml-auto flex gap-2">
          <DialogRegisterCourse onSave={handleRegisterCourse} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columnas <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron cursos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction>Aceptar</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. ¿Deseas eliminar el curso{" "}
              <strong>{courseToDelete?.Nombre}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCourse}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};