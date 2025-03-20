"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Save } from "lucide-react"; // Importa los íconos
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define el tipo RegisterCourse con los campos que necesitas
type RegisterCourse = {
  Nombre: string;
  Clave: string;
  Fecha_crea: string;
  Tipo: string;
  Objetivo: string;
  Dirigido: string;
  Horas: number;
  Capacidad: number;
  Origen: string;
  Modalidad: string;
  Estado: string;
  Modulo: string;
  Costo: number;
};

interface DialogRegisterCourseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (newCourse: RegisterCourse) => void; // Usa el tipo RegisterCourse
}

export function DialogRegisterCourse({ open, onOpenChange, onSave }: DialogRegisterCourseProps) {
  const [Nombre, setNombre] = React.useState("");
  const [Clave, setClave] = React.useState("");
  const [Fecha_crea, setFecha_crea] = React.useState("");
  const [Tipo, setTipo] = React.useState("");
  const [Objetivo, setObjetivo] = React.useState("");
  const [Dirigido, setDirigido] = React.useState("");
  const [Horas, setHoras] = React.useState(0);
  const [Capacidad, setCapacidad] = React.useState(0);
  const [Origen, setOrigen] = React.useState("");
  const [Modalidad, setModalidad] = React.useState("");
  const [Estado, setEstado] = React.useState("");
  const [Modulo, setModulo] = React.useState("");
  const [Costo, setCosto] = React.useState(0);
  const [error, setError] = React.useState("");

  // Estados para el AlertDialog de mensajes
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  // Establecer la fecha actual cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
      const day = String(today.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setFecha_crea(formattedDate);
    }
  }, [open]);

  // Limpiar el formulario cuando el diálogo se cierra
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setNombre("");
    setClave("");
    setTipo("");
    setObjetivo("");
    setDirigido("");
    setHoras(0);
    setCapacidad(0);
    setOrigen("");
    setModalidad("");
    setEstado("");
    setModulo("");
    setCosto(0);
  };

  const handleSave = () => {
    // Validar campos obligatorios
    if (!Nombre || !Clave || !Tipo || !Objetivo || !Dirigido || !Horas || !Capacidad || !Origen || !Modalidad || !Estado || !Modulo || !Costo) {
      setAlertMessage("Todos los campos son obligatorios");
      setAlertTitle("Error");
      setIsAlertOpen(true);
      return;
    }

    // Validar que Horas, Capacidad y Costo sean números positivos
    if (Horas <= 0 || Capacidad <= 0 || Costo <= 0) {
      setAlertMessage("Horas, Capacidad y Costo deben ser números positivos");
      setAlertTitle("Error");
      setIsAlertOpen(true);
      return;
    }

    // Si no hay errores, limpiar el mensaje de error
    setError("");

    // Crea el objeto con los datos del nuevo curso
    const newCourse = {
      Nombre,
      Clave,
      Fecha_crea,
      Tipo,
      Objetivo,
      Dirigido,
      Horas,
      Capacidad,
      Origen,
      Modalidad,
      Estado,
      Modulo,
      Costo,
    };

    // Llama a la función onSave con los datos del nuevo curso
    onSave(newCourse);
    onOpenChange(false); // Cierra el diálogo
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Curso</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 overflow-y-auto h-[600px]">
            {error && (
              <div className="text-red-500 text-sm mb-4">
                {error}
              </div>
            )}

            {/* Nombre del Curso */}
            <div>
              <Label><strong>Nombre del Curso</strong></Label>
              <textarea
                value={Nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-2 border rounded-md resize-none"
                rows={2}
              />
            </div>

            {/* Clave del Curso */}
            <div>
              <Label><strong>Clave del Curso</strong></Label>
              <Input
                value={Clave}
                onChange={(e) => setClave(e.target.value)}
              />
            </div>

            {/* Fecha de Creación */}
            <div>
              <Label><strong>Fecha de Creación</strong></Label>
              <Input
                type="date"
                value={Fecha_crea}
                onChange={(e) => setFecha_crea(e.target.value)}
                disabled // Deshabilita la edición del campo
              />
            </div>

            {/* Tipo (Combobox) */}
            <div>
              <Label><strong>Tipo</strong></Label>
              <Select value={Tipo} onValueChange={setTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONOCER">CONOCER</SelectItem>
                  <SelectItem value="DC3">DC3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Objetivo */}
            <div>
              <Label><strong>Objetivo</strong></Label>
              <textarea
                value={Objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
                className="w-full p-2 border rounded-md resize-none"
                rows={4}
                maxLength={500}
              />
              <p className="text-sm text-gray-500">{Objetivo.length}/500 caracteres</p>
            </div>

            {/* Dirigido A */}
            <div>
              <Label><strong>Dirigido A</strong></Label>
              <textarea
                value={Dirigido}
                onChange={(e) => setDirigido(e.target.value)}
                className="w-full p-2 border rounded-md resize-none"
                rows={3}
              />
            </div>

            {/* Total de Horas */}
            <div>
              <Label><strong>Total de Horas</strong></Label>
              <Input
                type="number"
                value={Horas}
                onChange={(e) => setHoras(Number(e.target.value))}
              />
            </div>

            {/* Capacidad */}
            <div>
              <Label><strong>Capacidad</strong></Label>
              <Input
                type="number"
                value={Capacidad}
                onChange={(e) => setCapacidad(Number(e.target.value))}
              />
            </div>

            {/* Origen (Combobox) */}
            <div>
              <Label><strong>Origen</strong></Label>
              <Select value={Origen} onValueChange={setOrigen}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un origen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ESPECIALIZADO">ESPECIALIZADO</SelectItem>
                  <SelectItem value="GENERAL">GENERAL</SelectItem>
                  <SelectItem value="SOLICITADO">SOLICITADO</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Modalidad (Combobox) */}
            <div>
              <Label><strong>Modalidad</strong></Label>
              <Select value={Modalidad} onValueChange={setModalidad}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una modalidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRESENCIAL">PRESENCIAL</SelectItem>
                  <SelectItem value="VIRTUAL">VIRTUAL</SelectItem>
                  <SelectItem value="DIGITAL">DIGITAL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Estado (Combobox) */}
            <div>
              <Label><strong>Estado</strong></Label>
              <Select value={Estado} onValueChange={setEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIGENTE">VIGENTE</SelectItem>
                  <SelectItem value="EN DESARROLLO">EN DESARROLLO</SelectItem>
                 
                </SelectContent>
              </Select>
            </div>

            {/* Módulo */}
            <div>
              <Label><strong>Módulo</strong></Label>
              <textarea
                value={Modulo}
                onChange={(e) => setModulo(e.target.value)}
                className="w-full p-2 border rounded-md resize-none"
                rows={4}
              />
            </div>

            {/* Costo */}
            <div>
              <Label><strong>Costo</strong></Label>
              <Input
                type="number"
                value={Costo}
                onChange={(e) => setCosto(Number(e.target.value))}
              />
            </div>

            {/* Botón para guardar */}
            <Button onClick={handleSave} className="mt-4">
              <Save className="mr-2 h-4 w-4" /> {/* Ícono de guardar */}
              Guardar Cambios
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AlertDialog para mostrar mensajes de error */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsAlertOpen(false)}>
              Cerrar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}