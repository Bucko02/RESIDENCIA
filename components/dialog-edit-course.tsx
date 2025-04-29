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
import { API_URL } from "@/app/config";
import Image from "next/image";

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
    id: number;
    url: string;
  }| null;
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
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState(course.CUR_IMAGEN?.url || "");
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        alert("El archivo no debe exceder los 5MB.");
        return;
      }
      
      setImageFile(file);
      
      // Crear vista previa
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("files", imageFile);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al subir la imagen");
      }

      const data = await response.json();
      return data[0].id; // Retorna el ID de la imagen subida
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleSave = async () => {
    setIsUploading(true);
    
    try {
      let imageId = null;
      
      // Si hay una nueva imagen, subirla
      if (imageFile) {
        imageId = await uploadImage();
      }

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
        Costo,
        CUR_IMAGEN: imageId 
        ? imageId 
        : course.CUR_IMAGEN?.id 
          ? course.CUR_IMAGEN.id 
          : null,
      };

      onSave(updatedCourse);
      setIsOpen(false);
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      alert("Hubo un error al guardar los cambios");
    } finally {
      setIsUploading(false);
    }
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
          {/* Vista previa de la imagen */}
          <div className="flex flex-col items-center">
            {imagePreview && (
              <div className="relative w-32 h-32 mb-4">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
            <Label htmlFor="image-upload">Imagen del Curso</Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Máximo 5MB. Formatos: JPG, PNG.
            </p>
          </div>

          <div>
            <Label>Nombre del Curso</Label>
            <textarea
              value={Nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-2 border rounded-md resize-none"
              rows={2}
              maxLength={500}
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
            <textarea
              value={Objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              className="w-full p-2 border rounded-md resize-none"
              rows={4}
              maxLength={500}
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
            <textarea
              value={Modulo}
              onChange={(e) => setModulo(e.target.value)}
              className="w-full p-2 border rounded-md resize-none"
              rows={4}
              maxLength={500}
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

          <Button 
            onClick={handleSave} 
            className="w-full"
            disabled={isUploading}
          >
            {isUploading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}