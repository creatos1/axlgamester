
import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  CollectionReference 
} from '@angular/fire/firestore';
import { ModMaestro, ModDetalle, ModCompleto } from '../models/mod.model';

@Injectable({
  providedIn: 'root'
})
export class ModMaestroService {
  
  private modMaestroCollection: CollectionReference<ModMaestro>;
  private modDetalleCollection: CollectionReference<ModDetalle>;

  constructor(private firestore: Firestore) {
    this.modMaestroCollection = collection(this.firestore, 'modsMaestro') as CollectionReference<ModMaestro>;
    this.modDetalleCollection = collection(this.firestore, 'modsDetalle') as CollectionReference<ModDetalle>;
  }

  // Método de diagnóstico optimizado (solo para depuración)
  async diagnosticarColecciones(verbose: boolean = false): Promise<void> {
    if (!verbose) return; // Skip en producción
    
    try {
      const [maestrosSnapshot, detallesSnapshot] = await Promise.all([
        getDocs(this.modMaestroCollection),
        getDocs(this.modDetalleCollection)
      ]);
      
      console.log(`Maestros: ${maestrosSnapshot.size}, Detalles: ${detallesSnapshot.size}`);
    } catch (error) {
      console.error('Error en diagnóstico:', error);
    }
  }

  // CRUD para ModMaestro
  async crearModMaestro(mod: Omit<ModMaestro, 'id'>): Promise<string> {
    const docRef = await addDoc(this.modMaestroCollection, mod);
    return docRef.id;
  }

  async obtenerModsMaestro(): Promise<ModMaestro[]> {
    const snapshot = await getDocs(query(this.modMaestroCollection, orderBy('fechaCreacion', 'desc')));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  async actualizarModMaestro(id: string, mod: Partial<ModMaestro>): Promise<void> {
    const docRef = doc(this.firestore, `modsMaestro/${id}`);
    await updateDoc(docRef, mod);
  }

  async eliminarModMaestro(id: string): Promise<void> {
    // Primero eliminamos todos los detalles asociados
    const detallesSnapshot = await getDocs(
      query(this.modDetalleCollection, where('modMaestroId', '==', id))
    );
    
    const deletePromises = detallesSnapshot.docs.map(detalle => 
      deleteDoc(doc(this.firestore, `modsDetalle/${detalle.id}`))
    );
    await Promise.all(deletePromises);

    // Luego eliminamos el maestro
    const docRef = doc(this.firestore, `modsMaestro/${id}`);
    await deleteDoc(docRef);
  }

  // CRUD para ModDetalle
  async crearModDetalle(detalle: Omit<ModDetalle, 'id'>): Promise<string> {
    const docRef = await addDoc(this.modDetalleCollection, detalle);
    return docRef.id;
  }

  async obtenerDetallesPorMaestro(modMaestroId: string): Promise<ModDetalle[]> {
    const snapshot = await getDocs(
      query(
        this.modDetalleCollection, 
        where('modMaestroId', '==', modMaestroId),
        orderBy('fechaLanzamiento', 'desc')
      )
    );
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  async actualizarModDetalle(id: string, detalle: Partial<ModDetalle>): Promise<void> {
    const docRef = doc(this.firestore, `modsDetalle/${id}`);
    await updateDoc(docRef, detalle);
  }

  async eliminarModDetalle(id: string): Promise<void> {
    const docRef = doc(this.firestore, `modsDetalle/${id}`);
    await deleteDoc(docRef);
  }

  // Método optimizado para obtener mods completos
  async obtenerModsCompletos(): Promise<ModCompleto[]> {
    try {
      // Obtener maestros y todos los detalles en paralelo
      const [maestros, todosLosDetalles] = await Promise.all([
        this.obtenerModsMaestro(),
        getDocs(this.modDetalleCollection)
      ]);

      // Crear mapa de detalles por modMaestroId para acceso O(1)
      const detallesPorMaestro = new Map<string, ModDetalle[]>();
      todosLosDetalles.docs.forEach(doc => {
        const detalle = { id: doc.id, ...doc.data() } as ModDetalle;
        const maestroId = detalle.modMaestroId;
        
        if (!detallesPorMaestro.has(maestroId)) {
          detallesPorMaestro.set(maestroId, []);
        }
        detallesPorMaestro.get(maestroId)!.push(detalle);
      });

      // Combinar maestros con sus detalles
      const modsCompletos: ModCompleto[] = maestros.map(maestro => ({
        ...maestro,
        detalles: detallesPorMaestro.get(maestro.id!) || []
      }));

      return modsCompletos;
      
    } catch (error) {
      console.error('Error en obtenerModsCompletos:', error);
      throw error;
    }
  }
}
