
import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  getDocs, 
  addDoc,
  CollectionReference,
  query,
  where 
} from '@angular/fire/firestore';
import { ModMaestro, ModDetalle } from '../models/mod.model';

@Injectable({
  providedIn: 'root'
})
export class MigrationService {
  
  constructor(private firestore: Firestore) {}

  async verificarDatosCards(): Promise<void> {
    try {
      const cardsCollection = collection(this.firestore, 'cards');
      const cardsSnapshot = await getDocs(cardsCollection);
      
      console.log('🔍 VERIFICACIÓN DE DATOS EN CARDS');
      console.log(`📊 Total de cards encontradas: ${cardsSnapshot.size}`);
      
      cardsSnapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        console.log(`\n📄 Card ${index + 1} (ID: ${doc.id}):`, {
          title: data['title'],
          img: data['img'],
          description: data['description'],
          link: data['link'],
          creationDate: data['creationDate'],
          allFields: Object.keys(data)
        });
      });
      
    } catch (error) {
      console.error('❌ Error verificando datos de cards:', error);
    }
  }

  async migrarCardsAModsMaestro(): Promise<void> {
    try {
      // Obtener datos de las colecciones
      const cardsCollection = collection(this.firestore, 'cards');
      const cardsSnapshot = await getDocs(cardsCollection);
      
      const modsMaestroCollection = collection(this.firestore, 'modsMaestro') as CollectionReference<ModMaestro>;
      const modsDetalleCollection = collection(this.firestore, 'modsDetalle') as CollectionReference<ModDetalle>;

      // Obtener mods maestro existentes para evitar duplicados
      const existingMaestrosSnapshot = await getDocs(modsMaestroCollection);
      const existingTitles = new Set<string>();
      
      existingMaestrosSnapshot.docs.forEach(doc => {
        const data = doc.data();
        existingTitles.add(data.nombre.toLowerCase().trim());
      });

      console.log(`🔄 Iniciando migración de ${cardsSnapshot.size} cards...`);
      console.log(`📋 Títulos existentes en modsMaestro:`, Array.from(existingTitles));

      let migratedCount = 0;
      let skippedCount = 0;

      for (const cardDoc of cardsSnapshot.docs) {
        const cardData = cardDoc.data();
        const cardTitle = (cardData['title'] || '').toLowerCase().trim();
        
        // Verificar si ya existe
        if (existingTitles.has(cardTitle)) {
          console.log(`⏭️ Saltando card "${cardData['title']}" - ya existe en modsMaestro`);
          skippedCount++;
          continue;
        }

        console.log(`📄 Migrando card: ${cardData['title']}`);
        
        // Crear ModMaestro a partir de los datos de cards
        const modMaestro: Omit<ModMaestro, 'id'> = {
          nombre: cardData['title'] || 'Sin título',
          imagen: cardData['img'] || '',
          descripcion: cardData['description'] || 'Sin descripción',
          juego: this.determinarJuego(cardData['description'] || cardData['title'] || ''),
          link: cardData['link'] || '',
          fechaCreacion: this.convertirFecha(cardData['creationDate']),
          activo: true
        };

        // Agregar el mod maestro
        const maestroDocRef = await addDoc(modsMaestroCollection, modMaestro);
        console.log(`✅ Mod maestro creado: ${maestroDocRef.id} - ${modMaestro.nombre}`);

        // Crear un detalle inicial por defecto
        const modDetalle: Omit<ModDetalle, 'id'> = {
          modMaestroId: maestroDocRef.id,
          version: '1.0',
          changelog: `Versión inicial migrada desde cards. ${cardData['description'] || ''}`,
          fechaLanzamiento: this.convertirFecha(cardData['creationDate']),
          activo: true
        };

        // Agregar el detalle
        const detalleDocRef = await addDoc(modsDetalleCollection, modDetalle);
        console.log(`✅ Detalle creado: ${detalleDocRef.id}`);
        
        migratedCount++;
      }

      console.log(`🎉 Migración completada:`);
      console.log(`✅ Cards migradas: ${migratedCount}`);
      console.log(`⏭️ Cards saltadas (ya existían): ${skippedCount}`);
      console.log(`📊 Total procesadas: ${migratedCount + skippedCount}`);
      
    } catch (error) {
      console.error('❌ Error durante la migración:', error);
      throw error;
    }
  }

  private convertirFecha(timestamp: any): Date {
    if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000);
    }
    if (timestamp instanceof Date) {
      return timestamp;
    }
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate();
    }
    return new Date();
  }

  private determinarJuego(text: string): 'gow1' | 'gow2' {
    const textLower = text.toLowerCase();
    
    // Verificar específicamente para God of War II
    if (textLower.includes('god of war ii') || 
        textLower.includes('god of war 2') ||
        textLower.includes('gow ii') ||
        textLower.includes('gow 2')) {
      return 'gow2';
    }
    
    // Verificar específicamente para God of War I
    if (textLower.includes('god of war i') && !textLower.includes('god of war ii')) {
      return 'gow1';
    }
    
    // Si contiene simplemente "god of war" sin especificar, asumimos GOW I
    if (textLower.includes('god of war') || 
        textLower.includes('gow') ||
        textLower.includes('kratos') ||
        textLower.includes('blade')) {
      return 'gow1';
    }
    
    // Por defecto God of War I
    return 'gow1';
  }

  // Método para limpiar datos de prueba si es necesario
  async limpiarDatosPrueba(): Promise<void> {
    try {
      const modsMaestroCollection = collection(this.firestore, 'modsMaestro');
      const snapshot = await getDocs(modsMaestroCollection);
      
      console.log('🧹 Buscando datos de prueba para limpiar...');
      
      for (const doc of snapshot.docs) {
        const data = doc.data();
        const nombre = data['nombre'] || '';
        
        // Identificar datos de prueba por nombres sospechosos
        if (nombre.match(/^\d+$/) || // Solo números
            nombre.length < 3 ||     // Muy cortos
            nombre.includes('test') ||
            nombre.includes('prueba')) {
          console.log(`🗑️ Encontrado dato de prueba: ${nombre} (ID: ${doc.id})`);
          // Aquí podrías eliminar si lo deseas
          // await deleteDoc(doc.ref);
        }
      }
      
    } catch (error) {
      console.error('❌ Error limpiando datos de prueba:', error);
    }
  }
}
