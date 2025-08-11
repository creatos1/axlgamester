import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../auth/user.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit, OnDestroy {
  isVertical: boolean = false;
  isAdmin: boolean = false;
  public email: string | null = '';

  private userSubscription?: Subscription;
  private readonly ADMIN_EMAIL = 'www.gamercracks@gmail.com';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private firestore: Firestore
  ) {}

  async ngOnInit(): Promise<void> {
    this.userSubscription = this.authService.currentUser$.subscribe(async (user) => {
      if (user) {
        this.email = user.email;
        this.isAdmin = await this.checkIfAdmin(this.email!);
      } else {
        this.email = null;
        this.isAdmin = false;
      }
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  async checkIfAdmin(email: string): Promise<boolean> {
    try {
      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log('❌ No se encontró el usuario en Firestore');
        return false;
      }

      const userData = querySnapshot.docs[0].data();
      console.log('✅ Datos del usuario:', userData);
      console.log('✅ Rol del usuario:', userData['role']);
      
      return userData['role'] === 'admin';
    } catch (error) {
      console.error('❌ Error verificando rol de admin:', error);
      return false;
    }
  }

  toggleVertical() {
    this.isVertical = !this.isVertical;
  }

  logout() {
    this.authService.logout().then(() => {
      this.userService.clearUser();
      this.router.navigate(['/home']);
    }).catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
  }

  goToAdmin() {
    this.router.navigate(['/admin.es']);
  }

  async deleteOwnAccount() {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        alert('No hay usuario autenticado');
        return;
      }

      const confirmDelete = confirm('¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.');
      if (!confirmDelete) return;

      // Solo eliminar usuario en Auth
      await currentUser.delete();

      // Logout y redirigir
      await this.authService.logout();
      this.userService.clearUser();
      alert('Cuenta eliminada correctamente.');
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Error eliminando cuenta:', error);
      if (error.code === 'auth/requires-recent-login') {
        alert('Por seguridad, vuelve a iniciar sesión e intenta de nuevo.');
        this.router.navigate(['/login']); // Ajusta esta ruta según tu flujo de re-login
      } else {
        alert('Error al eliminar la cuenta: ' + error.message);
      }
    }
  }
}
