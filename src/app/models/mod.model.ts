export interface ModMaestro {
  id?: string;
  nombre: string;
  imagen: string;
  descripcion: string;
  juego: 'gow1' | 'gow2';
  link?: string;
  fechaCreacion: Date;
  activo: boolean;
}

export interface ModDetalle {
  id?: string;
  modMaestroId: string;
  version: string;
  changelog: string;
  archivos?: string[];
  tamano?: string;
  requisitos?: string;
  fechaLanzamiento: Date;
  activo: boolean;
}

export interface ModCompleto extends ModMaestro {
  detalles?: ModDetalle[];

  // Props inglesas opcionales para compatibilidad
  title?: string;
  img?: string;
  description?: string;
}
