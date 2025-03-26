"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";

// Define el tipo User con los campos que necesitas
type User = {
  id: number; // Cambiado de string a number
  username: string;
  email: string;
  Nombre: string;
  Apellido_pat: string;
  Apellido_mat: string;
  Telefono: string;
  Fecha_nac: string;
  blocked: boolean;
};

interface DialogEditUserProps {
  user: User;
  onSave: (updatedUser: User) => void;
}

export function DialogEditUser({ user, onSave }: DialogEditUserProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [username, setUsuario] = React.useState(user.username || "");
  const [email, setCorreo] = React.useState(user.email || "");
  const [Nombre, setNombre] = React.useState(user.Nombre || "");
  const [Apellido_pat, setApellido_pat] = React.useState(user.Apellido_pat || "");
  const [Apellido_mat, setApellido_mat] = React.useState(user.Apellido_mat || "");
  const [Telefono, setTelefono] = React.useState(user.Telefono || "");
  const [Fecha_nac, setFecha_nac] = React.useState(user.Fecha_nac || "");

  const handleSave = () => {
    // Crea el objeto con los datos actualizados en el formato que espera la API
    const updatedUser = {
      id: user.id, // Mantén el ID del usuario
      username,
      email,
      Nombre,
      Apellido_pat,
      Apellido_mat,
      Telefono,
      Fecha_nac,
      blocked: user.blocked, // Añade la propiedad blocked
    };

    // Llama a la función onSave con los datos actualizados
    onSave(updatedUser);
    setIsOpen(false); // Cierra el diálogo
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
      <Button variant="ghost" className="justify-start w-full">
        <Pencil className="mr-2 h-4 w-4" />
        Editar Usuario
      </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Usuario</Label>
            <Input
              value={username}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>
          <div>
            <Label>Correo</Label>
            <Input
              value={email}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>
          <div>
            <Label>Nombre</Label>
            <Input
              value={Nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div>
            <Label>Apellido Paterno</Label>
            <Input
              value={Apellido_pat}
              onChange={(e) => setApellido_pat(e.target.value)}
            />
          </div>
          <div>
            <Label>Apellido Materno</Label>
            <Input
              value={Apellido_mat}
              onChange={(e) => setApellido_mat(e.target.value)}
            />
          </div>
          <div>
            <Label>Teléfono</Label>
            <Input
              value={Telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>
          <div>
            <Label>Fecha de nacimiento</Label>
            <Input
             type="date"
              value={Fecha_nac}
              onChange={(e) => setFecha_nac(e.target.value)}
            />
          </div>
          <Button onClick={handleSave}>Guardar Cambios</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}