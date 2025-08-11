
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

  // Método de diagnóstico para verificar el estado de las colecciones
  async diagnosticarColecciones(): Promise<void> {
    try {
      console.log('🔍 DIAGNÓSTICO DE COLECCIONES FIRESTORE');
      
      // Verificar modsMaestro
      const maestrosSnapshot = await getDocs(this.modMaestroCollection);
      console.log('📊 modsMaestro - Total documentos:', maestrosSnapshot.size);
      maestrosSnapshot.forEach(doc => {
        console.log('📄 Maestro Doc ID:', doc.id, 'Data:', doc.data());
      });
      
      // Verificar modsDetalle
      const detallesSnapshot = await getDocs(this.modDetalleCollection);
      console.log('📊 modsDetalle - Total documentos:', detallesSnapshot.size);
      detallesSnapshot.forEach(doc => {
        console.log('📄 Detalle Doc ID:', doc.id, 'Data:', doc.data());
      });
      
      // Verificar si hay datos en cards (colección antigua)
      const cardsCollection = collection(this.firestore, 'cards');
      const cardsSnapshot = await getDocs(cardsCollection);
      console.log('📊 cards (antigua) - Total documentos:', cardsSnapshot.size);
      
    } catch (error) {
      console.error('❌ Error en diagnóstico:', error);
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

  // Método para obtener mods completos con sus detalles
  async obtenerModsCompletos(): Promise<ModCompleto[]> {
    try {
      console.log('🔍 Iniciando obtención de mods completos...');
      
      // Primero verificar si las colecciones existen
      const maestrosSnapshot = await getDocs(this.modMaestroCollection);
      console.log('📊 Total documentos en modsMaestro:', maestrosSnapshot.size);
      
      const detallesSnapshot = await getDocs(this.modDetalleCollection);
      console.log('📊 Total documentos en modsDetalle:', detallesSnapshot.size);
      
      const maestros = await this.obtenerModsMaestro();
      console.log('🎯 Maestros obtenidos:', maestros.length);
      console.log('📋 Datos maestros:', maestros);
      
      const modsCompletos: ModCompleto[] = [];

      for (const maestro of maestros) {
        console.log(`🔄 Procesando maestro: ${maestro.nombre} (ID: ${maestro.id})`);
        try {
          const detalles = await this.obtenerDetallesPorMaestro(maestro.id!);
          console.log(`✅ Detalles para ${maestro.nombre}:`, detalles.length, detalles);
          
          modsCompletos.push({
            ...maestro,
            detalles
          });
        } catch (detalleError) {
          console.error(`❌ Error obteniendo detalles para ${maestro.nombre}:`, detalleError);
          // Añadir el maestro sin detalles en caso de error
          modsCompletos.push({
            ...maestro,
            detalles: []
          });
        }
      }

      console.log('🎉 Mods completos finales:', modsCompletos.length);
      console.log('📝 Detalle completo:', modsCompletos);
      return modsCompletos;
      
    } catch (error) {
      console.error('💥 Error crítico en obtenerModsCompletos:', error);
      throw error;
    }
  }
}
