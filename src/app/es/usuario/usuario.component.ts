
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../auth/user.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {
  isVertical: boolean = false;
  isAdmin: boolean = false;
  private readonly ADMIN_EMAIL = 'www.gamercracks@gmail.com';
  public email: string | null = ''; 

  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.email = this.userService.getUserEmail();
    this.isAdmin = this.email === this.ADMIN_EMAIL;
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
}
