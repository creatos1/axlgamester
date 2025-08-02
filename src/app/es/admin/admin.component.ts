import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
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

  activeTab: 'images' | 'users' = 'images';

  users: User[] = [];
  newUser: Partial<User> = { email: '', role: 'user' };

  private userSubscription?: Subscription;
  private currentUserEmail: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private firestore: Firestore
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
}
