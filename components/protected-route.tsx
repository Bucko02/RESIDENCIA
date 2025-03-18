"use client";

import * as React from "react";
import { useState, useEffect } from "react";
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

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAlertOpen, setIsAlertOpen] = useState(false); // Estado para controlar el AlertDialog

  useEffect(() => {
    // Verifica si el usuario ha iniciado sesión
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      // Si no hay token, abre el AlertDialog
      setIsAlertOpen(true);
    }
  }, []);

  // Función para cerrar el AlertDialog y redirigir al login
  const handleRedirectToLogin = () => {
    setIsAlertOpen(false); // Cierra el AlertDialog
    window.location.href = "/login"; // Redirige al login
  };

  return (
    <>
      {/* Contenedor del contenido principal */}
      <div className={isAlertOpen ? "hidden" : ""}>
        {children}
      </div>

      {/* AlertDialog para notificar al usuario */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Acceso restringido</AlertDialogTitle>
            <AlertDialogDescription>
              Debes iniciar sesión para acceder a esta página.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleRedirectToLogin}>Ir al login</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}