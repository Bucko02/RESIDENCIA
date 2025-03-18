"use client";

import * as React from "react";
import { useState } from "react";
import { UserPlus } from "lucide-react"; // Importa el ícono
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

// Define el tipo RegisterUser con los campos que necesitas
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

interface DialogRegisterUserProps {
  onSave: (newUser: RegisterUser) => void; // Usa el tipo RegisterUser
  role: string; // Acepta la prop role
}

export function DialogRegisterUser({ onSave, role }: DialogRegisterUserProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [username, setUsuario] = React.useState("");
  const [email, setCorreo] = React.useState("");
  const [Nombre, setNombre] = React.useState("");
  const [Apellido_pat, setApellido_pat] = React.useState("");
  const [Apellido_mat, setApellido_mat] = React.useState("");
  const [Telefono, setTelefono] = React.useState("");
  const [Fecha_nac, setFecha_nac] = React.useState("");
  const [password, setPassword] = React.useState(""); // Estado para la contraseña
  const [confirmPassword, setConfirmPassword] = React.useState(""); // Estado para confirmar la contraseña
  const [error, setError] = React.useState(""); // Estado para manejar errores de validación

  // Estados para el AlertDialog de mensajes
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  // Función para validar el correo electrónico
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSave = () => {
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setAlertMessage(`Las contraseñas no coinciden`); // Mensaje de error
      setAlertTitle("Error");
      setIsAlertOpen(true);
      return; // Detener la ejecución si las contraseñas no coinciden
    }

    // Validar que el correo electrónico esté bien escrito
    if (!validateEmail(email)) {
      setAlertMessage(`El correo electrónico no es válido`); // Mensaje de error
      setAlertTitle("Error");
      setIsAlertOpen(true);
      return; // Detener la ejecución si el correo no es válido
    }

    // Si las contraseñas coinciden y el correo es válido, limpiar el mensaje de error
    setError("");

    // Crea el objeto con los datos del nuevo usuario
    const newUser = {
      username,
      email,
      password,
      Nombre,
      Apellido_pat,
      Apellido_mat,
      Telefono,
      Fecha_nac,
      role, // Incluye el rol en el objeto newUser
    };

    // Llama a la función onSave con los datos del nuevo usuario
    onSave(newUser);
    setIsOpen(false); // Cierra el diálogo
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-green-800 border-green-500 hover:bg-green-600 hover:text-white">
          <UserPlus className="w-4 h-4" /> {/* Ícono */}
          Nuevo Usuario {/* Texto del botón */}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Usuario</DialogTitle>
        </DialogHeader>
        
          <div className="space-y-4 overflow-y-auto h-[650px]">
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
                type="email"
                value={email}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Nombre</Label>
              <Input
                value={Nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Apellido Paterno</Label>
              <Input
                value={Apellido_pat}
                onChange={(e) => setApellido_pat(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Apellido Materno</Label>
              <Input
                value={Apellido_mat}
                onChange={(e) => setApellido_mat(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input
                type="tel"
                value={Telefono}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Elimina todos los caracteres no numéricos
                  if (value.length <= 10) {
                    // Limita la longitud a 10 dígitos
                    setTelefono(value); // Actualiza el estado con el valor filtrado
                  }
                }}
                required
              />
            </div>
            <div>
              <Label>Fecha de nacimiento</Label>
              <Input
                type="date"
                value={Fecha_nac}
                onChange={(e) => setFecha_nac(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Contraseña</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Confirmar Contraseña</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}{" "}
            {/* Mostrar mensaje de error */}
            <Button onClick={handleSave}>Registrar</Button>
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
      </DialogContent>
    </Dialog>
  );
}