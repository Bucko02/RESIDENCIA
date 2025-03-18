"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react"; // Importar ícono de guardar

// Define el tipo Curso con los campos que necesitas
type Curso = {
  documentId: string;
  CUR_NOMBRE_CURSO: string;
  CUR_CLAVE: string;
  CUR_TIPO: string;
  CUR_OBJETIVO: string;
  CUR_DRIGIDO_A: string;
  CUR_TOTAL_HORAS: number;
  CUR_ORIGEN: string;
  CUR_CAPACIDAD: number;
  CUR_MODALIDAD: string;
  CUR_COSTO: number;
  CUR_MODULO: string;
};

interface DialogEditCourseProps {
  curso: Curso;
  onSave: (updatedCurso: Curso) => void;
  open: boolean; // Prop para controlar si el diálogo está abierto
  onOpenChange: (open: boolean) => void; // Prop para manejar cambios en el estado del diálogo
}

export function DialogEditCourse({ curso, onSave, open, onOpenChange }: DialogEditCourseProps) {
  const [nombreCurso, setNombreCurso] = React.useState(curso.CUR_NOMBRE_CURSO || "");
  const [tipo, setTipo] = React.useState(curso.CUR_TIPO || "");
  const [objetivo, setObjetivo] = React.useState(curso.CUR_OBJETIVO || "");
  const [dirigidoA, setDirigidoA] = React.useState(curso.CUR_DRIGIDO_A || "");
  const [totalHoras, setTotalHoras] = React.useState(curso.CUR_TOTAL_HORAS || 0);
  const [origen, setOrigen] = React.useState(curso.CUR_ORIGEN || "");
  const [capacidad, setCapacidad] = React.useState(curso.CUR_CAPACIDAD || 0);
  const [modalidad, setModalidad] = React.useState(curso.CUR_MODALIDAD || "");
  const [costo, setCosto] = React.useState(curso.CUR_COSTO || 0);
  const [modulo, setModulo] = React.useState(curso.CUR_MODULO || "");
  const [error, setError] = React.useState<string | null>(null);

  const handleSave = () => {
    // Validación de campos obligatorios
    if (!nombreCurso || !tipo) {
      setError("Nombre del curso y tipo son campos obligatorios.");
      return;
    }

    // Validación de campos numéricos
    if (totalHoras < 0 || capacidad < 0 || costo < 0) {
      setError("Los valores numéricos no pueden ser negativos.");
      return;
    }

    setError(null); // Limpiar el error si la validación es exitosa

    const updatedCurso = {
      ...curso,
      CUR_NOMBRE_CURSO: nombreCurso,
      CUR_CLAVE: curso.CUR_CLAVE,
      CUR_TIPO: tipo,
      CUR_OBJETIVO: objetivo,
      CUR_DRIGIDO_A: dirigidoA,
      CUR_TOTAL_HORAS: totalHoras,
      CUR_ORIGEN: origen,
      CUR_CAPACIDAD: capacidad,
      CUR_MODALIDAD: modalidad,
      CUR_COSTO: costo,
      CUR_MODULO: modulo,
    };

    onSave(updatedCurso);
    onOpenChange(false); // Cierra el diálogo después de guardar
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Curso</DialogTitle>
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
              value={nombreCurso}
              onChange={(e) => setNombreCurso(e.target.value)}
              className="w-full p-2 border rounded-md resize-none"
              rows={2}
            />
          </div>

          {/* Tipo (Combobox) */}
          <div>
            <Label><strong>Tipo</strong></Label>
            <Select value={tipo} onValueChange={setTipo}>
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
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              className="w-full p-2 border rounded-md resize-none"
              rows={4}
              maxLength={500}
            />
            <p className="text-sm text-gray-500">{objetivo.length}/500 caracteres</p>
          </div>

          {/* Dirigido A */}
          <div>
            <Label><strong>Dirigido A</strong></Label>
            <textarea
              value={dirigidoA}
              onChange={(e) => setDirigidoA(e.target.value)}
              className="w-full p-2 border rounded-md resize-none"
              rows={3}
            />
          </div>

          {/* Total de Horas */}
          <div>
            <Label><strong>Total de Horas</strong></Label>
            <Input
              type="number"
              value={totalHoras}
              onChange={(e) => setTotalHoras(Number(e.target.value))}
            />
          </div>

          {/* Origen (Combobox) */}
          <div>
            <Label><strong>Origen</strong></Label>
            <Select value={origen} onValueChange={setOrigen}>
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

          {/* Capacidad */}
          <div>
            <Label><strong>Capacidad</strong></Label>
            <Input
              type="number"
              value={capacidad}
              onChange={(e) => setCapacidad(Number(e.target.value))}
            />
          </div>

          {/* Modalidad (Combobox) */}
          <div>
            <Label><strong>Modalidad</strong></Label>
            <Select value={modalidad} onValueChange={setModalidad}>
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

          {/* Costo */}
          <div>
            <Label><strong>Costo</strong></Label>
            <Input
              type="number"
              value={costo}
              onChange={(e) => setCosto(Number(e.target.value))}
            />
          </div>

          {/* Módulo */}
          <div>
            <Label><strong>Módulo</strong></Label>
            <textarea
              value={modulo}
              onChange={(e) => setModulo(e.target.value)}
              className="w-full p-2 border rounded-md resize-none"
              rows={4}
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
  );
}