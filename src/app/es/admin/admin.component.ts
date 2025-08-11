import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../auth/user.service';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  CollectionReference,
} from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

import { ModMaestroService } from '../../services/mod-maestro.service';
import { MigrationService } from '../../services/migration.service';
import { ModMaestro, ModDetalle } from '../../models/mod.model';

interface User {
  id?: string;
  email: string;
  role: string;
  createdAt: any;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {
  isAdmin: boolean = false;

  activeTab: 'images' | 'users' | 'mods' = 'images';

  users: User[] = [];
  newUser: Partial<User> = { email: '', role: 'user' };

  // Propiedades para mods
  modsMaestro: ModMaestro[] = [];
  newModMaestro: Partial<ModMaestro> = {
    nombre: '',
    imagen: '',
    descripcion: '',
    juego: 'gow1',
    link: '',
    activo: true
  };

  modDetalles: ModDetalle[] = [];
  selectedModMaestroId: string | null = null;
  newModDetalle: Partial<ModDetalle> = {
    version: '',
    changelog: '',
    archivos: [],
    tamano: '',
    requisitos: '',
    activo: true
  };

  private userSubscription?: Subscription;
  private currentUserEmail: string | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private firestore: Firestore,
    private modMaestroService: ModMaestroService,
    private migrationService: MigrationService
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.currentUser$.subscribe(async (user) => {
      if (!user) {
        this.router.navigate(['/']);
        return;
      }

      this.currentUserEmail = user.email;

      // Verificamos el rol admin en Firestore
      const isAdmin = await this.checkIfAdmin(this.currentUserEmail!);

      if (!isAdmin) {
        this.router.navigate(['/']); // Si no es admin, redirige a /
      } else {
        this.isAdmin = true;
        await this.loadUsers();
        await this.loadModsMaestro();
      }
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  // Función para checar si el usuario tiene rol admin
  async checkIfAdmin(email: string): Promise<boolean> {
    const usersRef = collection(this.firestore, 'users') as CollectionReference<User>;
    const q = query(usersRef, where('email', '==', email), where('role', '==', 'admin'));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  // Cargar todos los usuarios para el CRUD
  async loadUsers() {
    try {
      const usersCollection = collection(this.firestore, 'users') as CollectionReference<User>;
      const snapshot = await getDocs(usersCollection);
      this.users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  }

  // Agregar nuevo usuario
  async addUser() {
    if (!this.newUser.email) return;

    try {
      const usersCollection = collection(this.firestore, 'users') as CollectionReference<User>;
      await addDoc(usersCollection, {
        email: this.newUser.email,
        role: this.newUser.role || 'user',
        createdAt: new Date(),
      });
      this.newUser = { email: '', role: 'user' };
      this.loadUsers();
    } catch (error) {
      console.error('Error agregando usuario:', error);
    }
  }

  // Actualizar usuario (email o rol)
  async updateUser(user: User) {
    if (!user.id) return;

    try {
      const userDoc = doc(this.firestore, `users/${user.id}`);
      await updateDoc(userDoc, {
        email: user.email,
        role: user.role,
      });
      this.loadUsers();
    } catch (error) {
      console.error('Error actualizando usuario:', error);
    }
  }

  // Eliminar usuario
  async deleteUser(userId: string | undefined) {
    if (!userId) return;

    try {
      const userDoc = doc(this.firestore, `users/${userId}`);
      await deleteDoc(userDoc);
      this.loadUsers();
    } catch (error) {
      console.error('Error eliminando usuario:', error);
    }
  }

  // Métodos para gestión de mods maestro
  async loadModsMaestro() {
    try {
      this.modsMaestro = await this.modMaestroService.obtenerModsMaestro();
    } catch (error) {
      console.error('Error cargando mods maestro:', error);
    }
  }

  async addModMaestro() {
    if (!this.newModMaestro.nombre || !this.newModMaestro.imagen) return;

    try {
      const modData = {
        ...this.newModMaestro,
        fechaCreacion: new Date(),
        activo: true
      } as Omit<ModMaestro, 'id'>;

      await this.modMaestroService.crearModMaestro(modData);
      this.newModMaestro = {
        nombre: '',
        imagen: '',
        descripcion: '',
        juego: 'gow1',
        link: '',
        activo: true
      };
      this.loadModsMaestro();
    } catch (error) {
      console.error('Error agregando mod maestro:', error);
    }
  }

  async updateModMaestro(mod: ModMaestro) {
    if (!mod.id) return;

    try {
      await this.modMaestroService.actualizarModMaestro(mod.id, mod);
      this.loadModsMaestro();
    } catch (error) {
      console.error('Error actualizando mod maestro:', error);
    }
  }

  async deleteModMaestro(modId: string | undefined) {
    if (!modId) return;

    try {
      await this.modMaestroService.eliminarModMaestro(modId);
      this.loadModsMaestro();
      if (this.selectedModMaestroId === modId) {
        this.selectedModMaestroId = null;
        this.modDetalles = [];
      }
    } catch (error) {
      console.error('Error eliminando mod maestro:', error);
    }
  }

  // Métodos para gestión de detalles
  async loadModDetalles(modMaestroId: string) {
    this.selectedModMaestroId = modMaestroId;
    try {
      this.modDetalles = await this.modMaestroService.obtenerDetallesPorMaestro(modMaestroId);
    } catch (error) {
      console.error('Error cargando detalles del mod:', error);
    }
  }

  async addModDetalle() {
    if (!this.selectedModMaestroId || !this.newModDetalle.version) return;

    try {
      const detalleData = {
        ...this.newModDetalle,
        modMaestroId: this.selectedModMaestroId,
        fechaLanzamiento: new Date(),
        activo: true
      } as Omit<ModDetalle, 'id'>;

      await this.modMaestroService.crearModDetalle(detalleData);
      this.newModDetalle = {
        version: '',
        changelog: '',
        archivos: [],
        tamano: '',
        requisitos: '',
        activo: true
      };
      this.loadModDetalles(this.selectedModMaestroId);
    } catch (error) {
      console.error('Error agregando detalle del mod:', error);
    }
  }

  async updateModDetalle(detalle: ModDetalle) {
    if (!detalle.id) return;

    try {
      await this.modMaestroService.actualizarModDetalle(detalle.id, detalle);
      if (this.selectedModMaestroId) {
        this.loadModDetalles(this.selectedModMaestroId);
      }
    } catch (error) {
      console.error('Error actualizando detalle del mod:', error);
    }
  }

  async deleteModDetalle(detalleId: string | undefined) {
    if (!detalleId) return;

    try {
      await this.modMaestroService.eliminarModDetalle(detalleId);
      if (this.selectedModMaestroId) {
        this.loadModDetalles(this.selectedModMaestroId);
      }
    } catch (error) {
      console.error('Error eliminando detalle del mod:', error);
    }
  }

  // Método para manejar archivos como string separado por comas
  updateArchivos(event: any, detalle?: ModDetalle) {
    const archivosStr = event.target.value;
    const archivosArray = archivosStr.split(',').map((archivo: string) => archivo.trim()).filter((archivo: string) => archivo);

    if (detalle) {
      detalle.archivos = archivosArray;
    } else {
      this.newModDetalle.archivos = archivosArray;
    }
  }

  async verificarCards() {
    try {
      await this.migrationService.verificarDatosCards();
      alert('Verificación completada. Revisa la consola para ver los datos.');
    } catch (error) {
      console.error('Error en la verificación:', error);
      alert('Error durante la verificación');
    }
  }

  async migrarCards() {
    if (confirm('¿Estás seguro de que quieres migrar los datos de cards a mods maestro? Esta acción no se puede deshacer.')) {
      try {
        await this.migrationService.migrarCardsAModsMaestro();
        alert('Migración completada exitosamente');
        this.loadModsMaestro();
      } catch (error) {
        console.error('Error en la migración:', error);
        alert('Error durante la migración');
      }
    }
  }

  logout() {
    this.authService.logout()
      .then(() => {
        this.userService.clearUser();
        this.router.navigate(['/home']);
      })
      .catch(error => {
        console.error('Error al cerrar sesión:', error);
      });
  }
}