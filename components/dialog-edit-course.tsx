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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil } from "lucide-react";

type Course = {
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

interface DialogEditCourseProps {
  course: Course;
  onSave: (updatedCourse: Course) => void;
}

export function DialogEditCourse({ course, onSave }: DialogEditCourseProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [Nombre, setNombre] = React.useState(course.Nombre || "");
  const [Clave, setClave] = React.useState(course.Clave || "");
  const [Tipo, setTipo] = React.useState(course.Tipo || "");
  const [Objetivo, setObjetivo] = React.useState(course.Objetivo || "");
  const [Dirigido, setDirigido] = React.useState(course.Dirigido || "");
  const [Horas, setHoras] = React.useState(course.Horas || "");
  const [Capacidad, setCapacidad] = React.useState(course.Capacidad || "");
  const [Origen, setOrigen] = React.useState(course.Origen || "");
  const [Modalidad, setModalidad] = React.useState(course.Modalidad || "");
  const [Estado, setEstado] = React.useState(course.Estado || "");
  const [Modulo, setModulo] = React.useState(course.Modulo || "");
  const [Costo, setCosto] = React.useState(course.Costo || "");

  const handleSave = () => {
    const updatedCourse = {
      ...course,
      Nombre,
      Clave,
      Tipo,
      Objetivo,
      Dirigido,
      Horas,
      Capacidad,
      Origen,
      Modalidad,
      Estado,
      Modulo,
      Costo
    };

    onSave(updatedCourse);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>

      <Button variant="ghost" className="justify-start w-full">
        <Pencil className="mr-2 h-4 w-4" />
        Modificar curso
      </Button>
    
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Curso</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Nombre del Curso</Label>
            <Input
              value={Nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div>
            <Label>Clave del Curso</Label>
            <Input
              value={Clave}
              onChange={(e) => setClave(e.target.value)}
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
            <Input
              value={Objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
            />
          </div>

          <div>
            <Label>Dirigido A</Label>
            <Input
              value={Dirigido}
              onChange={(e) => setDirigido(e.target.value)}
            />
          </div>

          <div>
            <Label>Total de Horas</Label>
            <Input
              type="number"
              value={Horas}
              onChange={(e) => setHoras(e.target.value)}
            />
          </div>

          <div>
            <Label>Capacidad</Label>
            <Input
              type="number"
              value={Capacidad}
              onChange={(e) => setCapacidad(e.target.value)}
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
            <Input
              value={Modulo}
              onChange={(e) => setModulo(e.target.value)}
            />
          </div>

          <div>
            <Label>Costo</Label>
            <Input
              type="number"
              value={Costo}
              onChange={(e) => setCosto(e.target.value)}
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            Guardar Cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}