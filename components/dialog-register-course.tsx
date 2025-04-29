"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  onSave: (newCourse: RegisterCourse) => void;
}

export function DialogRegisterCourse({ onSave }: DialogRegisterCourseProps) {
  const [isOpen, setIsOpen] = React.useState(false);
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

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      setFecha_crea(formattedDate);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!Nombre || !Clave || !Tipo || !Objetivo || !Dirigido || !Horas || !Capacidad || !Origen || !Modalidad || !Estado || !Modulo || !Costo) {
      setAlertTitle("Error");
      setAlertMessage("Todos los campos son obligatorios");
      setIsAlertOpen(true);
      return;
    }

    if (Horas <= 0 || Capacidad <= 0 || Costo <= 0) {
      setAlertTitle("Error");
      setAlertMessage("Horas, Capacidad y Costo deben ser números positivos");
      setIsAlertOpen(true);
      return;
    }

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

    onSave(newCourse);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-green-800 border-green-500 hover:bg-green-600 hover:text-white"
        >
          <Plus className="w-4 h-4" />
          Nuevo Curso
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Curso</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Nombre del Curso</Label>
            <textarea
              value={Nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-2 border rounded-md resize-none"
              rows={2}
              maxLength={500}
              required
            />
          </div>

          <div>
            <Label>Clave del Curso</Label>
            <Input
              value={Clave}
              onChange={(e) => setClave(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Fecha de Creación</Label>
            <Input
              type="date"
              value={Fecha_crea}
              onChange={(e) => setFecha_crea(e.target.value)}
              disabled
            />
          </div>

          <div>
            <Label>Tipo</Label>
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

          <div>
            <Label>Objetivo</Label>
            <textarea
              value={Objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              className="w-full p-2 border rounded-md resize-none"
              rows={4}
              maxLength={500}
              required
            />
          </div>

          <div>
            <Label>Dirigido A</Label>
            <textarea
              value={Dirigido}
              onChange={(e) => setDirigido(e.target.value)}
              className="w-full p-2 border rounded-md resize-none"
              rows={3}
              maxLength={500}
              required
            />
          </div>

          <div>
            <Label>Total de Horas</Label>
            <Input
              type="number"
              value={Horas}
              onChange={(e) => setHoras(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <Label>Capacidad</Label>
            <Input
              type="number"
              value={Capacidad}
              onChange={(e) => setCapacidad(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <Label>Origen</Label>
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

          <div>
            <Label>Modalidad</Label>
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

          <div>
            <Label>Estado</Label>
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

          <div>
            <Label>Módulo</Label>
            <textarea
              value={Modulo}
              onChange={(e) => setModulo(e.target.value)}
              className="w-full p-2 border rounded-md resize-none"
              rows={4}
              maxLength={500}
              required
            />
          </div>

          <div>
            <Label>Costo</Label>
            <Input
              type="number"
              value={Costo}
              onChange={(e) => setCosto(Number(e.target.value))}
              required
            />
          </div>

          <Button onClick={handleSave} className="w-full mt-4">
            Registrar Curso
          </Button>
        </div>
      </DialogContent>

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
    </Dialog>
  );
}