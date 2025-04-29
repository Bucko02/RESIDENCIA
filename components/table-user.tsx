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
import { ArrowUpDown, CheckCircle, ChevronDown, MoreHorizontal, Plus, Trash2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

import { DialogEditUser } from "@/components/dialog-edit_user";
import { DialogRegisterUser } from "@/components/dialog-register-user"; // Importa el componente DialogRegisterUser

import { API_URL } from "@/app/config";

// Define el tipo User con los campos que necesitas
export type User = {
  id: number;
  Nombre: string;
  Apellido_pat: string;
  Apellido_mat: string;
  username: string;
  email: string;
  Telefono: string;
  Fecha_nac: string;
  blocked: boolean;
};

type RegisterUser = {
  username: string;
  email: string;
  password: string;
  Nombre: string;
  Apellido_pat: string;
  Apellido_mat: string;
  Telefono: string;
  Fecha_nac: string;
  role: string; // Añade el rol al tipo RegisterUser
};

// Define las columnas de la tabla
export const columns = (
  onUpdate: () => void,
  setAlertTitle: (title: string) => void,
  setAlertMessage: (message: string) => void,
  setIsAlertOpen: (isOpen: boolean) => void,
  setIsDeleteDialogOpen: (isOpen: boolean) => void, // Nuevo estado para el diálogo de eliminación
  setUserToDelete: (user: User | null) => void // Nuevo estado para almacenar el usuario a eliminar

): ColumnDef<User>[] => [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "Nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <div>
        {`${row.original.Nombre} ${row.original.Apellido_pat} ${row.original.Apellido_mat}`}
      </div>
    ),
  },
  {
    accessorKey: "username",
    header: "Usuario",
  },
  {
    accessorKey: "email",
    header: "Correo",
  },
  {
    accessorKey: "Telefono",
    header: "Teléfono",
  },
  {
    accessorKey: "Fecha_nac",
    header: "Fecha de Nacimiento",
  },
  {
    accessorKey: "blocked",
    header: "Activo",
    cell: ({ row }) => (
      <div
        className={`px-4 py-2 rounded-md text-center font-semibold ${
          row.original.blocked ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
        }`}
      >
        {row.original.blocked ? "Inactivo" : "Activo"}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

      // Función para manejar la desactivación del usuario
      const handleDeactivateUser = async () => {
        try {
          const response = await fetch(`${API_URL}/users/${user.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              blocked: !user.blocked, // Invertir el estado de blocked
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error?.message || "Error desconocido";
            console.error("Error:", errorMessage);
            setAlertMessage(`Error al actualizar el usuario: ${errorMessage}`);
            setAlertTitle("Error");
            setIsAlertOpen(true);
            throw new Error(errorMessage);
          }

          setAlertTitle("Éxito");
          setAlertMessage(`Usuario ${user.blocked ? "activado" : "desactivado"} correctamente`);
          setIsAlertOpen(true);
          onUpdate(); // Llama a la función onUpdate para actualizar la lista de usuarios
        } catch (error) {
          console.error("Error:", error);
          setAlertTitle("Error");
          setAlertMessage("Hubo un error al actualizar el usuario");
          setIsAlertOpen(true);
        }
      };

      // Función para manejar la actualización del usuario
      const handleUpdateUser = async (updatedUser: User) => {
        try {
          const response = await fetch(`${API_URL}/users/${updatedUser.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
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
          setAlertMessage("Usuario actualizado correctamente");
          setIsAlertOpen(true);
          onUpdate(); // Llama a la función onUpdate para actualizar la lista de usuarios
        } catch (error) {
          console.error("Error:", error);
          setAlertTitle("Error");
          setAlertMessage("Hubo un error al actualizar el usuario");
          setIsAlertOpen(true);
        }
      };

      // Función para manejar la eliminación del usuario
      const handleDeleteUser = () => {
        setUserToDelete(user); // Almacena el usuario a eliminar
        setIsDeleteDialogOpen(true); // Abre el diálogo de confirmación
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Opciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleDeactivateUser}>
            {user.blocked ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                Activar usuario
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4 text-red-600" />
                Desactivar usuario
              </>
            )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            
            <DialogEditUser user={user} onSave={handleUpdateUser} />
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDeleteUser}>
            <Trash2 className="mr-2 h-4 w-4" />
              Eliminar usuario
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Componente principal de la tabla
export function DataTableDemo({
  data,
  onUpdate,
  role, // Acepta la prop role
}: {
  data: User[];
  onUpdate: () => void;
  role: string; // Define la prop role
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Estados para el AlertDialog de mensajes
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  // Estados para el diálogo de confirmación de eliminación
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Función para manejar el registro de un nuevo usuario
  const handleRegisterUser = async (newUser: RegisterUser) => {
    try {
      const response = await fetch(`${API_URL}/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: newUser.username,
          email: newUser.email,
          password: newUser.password,
        }),
      });

      const registerData = await response.json();

      if (!response.ok) {
        throw new Error(registerData.error?.message || "Error al registrar el usuario");
      }

      console.log("Usuario registrado:", registerData);
      
      // Paso 2: Actualizar el perfil del usuario con los campos adicionales
      const updateResponse = await fetch(`${API_URL}/users/${registerData.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${registerData.jwt}`, // Usar el token JWT del usuario registrado
        },
        body: JSON.stringify({
          Nombre: newUser.Nombre,
          Apellido_pat: newUser.Apellido_pat,
          Apellido_mat: newUser.Apellido_mat,
          Telefono: newUser.Telefono,
          Fecha_nac: newUser.Fecha_nac,
          role: role, // Incluye el rol en la solicitud de registro
        }),
      });

      const updateData = await updateResponse.json();

      if (!updateResponse.ok) {
        throw new Error(updateData.error?.message || "Error al actualizar el perfil del usuario");
      }

      setAlertTitle("Éxito");
      setAlertMessage("Usuario registrado correctamente: " +newUser.Nombre+" "+newUser.Apellido_pat+" "+newUser.Apellido_mat);
      setIsAlertOpen(true);
      
      // Actualiza la lista de usuarios
      onUpdate();
    } catch (error) {
      console.error("Error:", error);
      setAlertTitle("Error");
      setAlertMessage("Hubo un error al registrar el usuario");
      setIsAlertOpen(true);
    }
  };

  // Función para confirmar la eliminación del usuario
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`${API_URL}/users/${userToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || "Error desconocido";
        console.error("Error:", errorMessage);
        setAlertTitle("Error");
        setAlertMessage(`Error al eliminar el usuario: ${errorMessage}`);
        setIsAlertOpen(true);
        throw new Error(errorMessage);
      }

      setAlertTitle("Éxito");
      setAlertMessage("Usuario eliminado correctamente");
      setIsAlertOpen(true);
      onUpdate(); // Llama a la función onUpdate para actualizar la lista de usuarios
    } catch (error) {
      console.error("Error:", error);
      setAlertTitle("Error");
      setAlertMessage("Hubo un error al eliminar el usuario");
      setIsAlertOpen(true);
    } finally {
      setIsDeleteDialogOpen(false); // Cierra el diálogo de confirmación
      setUserToDelete(null); // Limpia el usuario a eliminar
    }
  };

  const table = useReactTable({
    data: data || [], // Asegúrate de que data sea un array
    columns: columns(
      onUpdate,
      setAlertTitle,
      setAlertMessage,
      setIsAlertOpen,
      setIsDeleteDialogOpen,
      setUserToDelete
    ), // Pasa los estados y funciones a las columnas
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
          placeholder="Filtrar correos..."
          value={String(table.getColumn("email")?.getFilterValue() ?? "")}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columnas <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DialogRegisterUser onSave={handleRegisterUser} role={role} /> {/* Pasa el rol */}
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
                  Sin resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
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

      {/* AlertDialog para confirmar la eliminación */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. ¿Deseas eliminar al usuario{" "}
              <strong>{userToDelete?.username}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}