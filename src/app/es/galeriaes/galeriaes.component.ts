import { Component, OnInit } from '@angular/core';
import { UserService } from '../../auth/user.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-galeriaes',
  templateUrl: './galeriaes.component.html',
  styleUrl: './galeriaes.component.css'
})
export class GaleriaesComponent {
  isVertical: boolean = false;
  toggleVertical() {
  this.isVertical = !this.isVertical;
  }
  public email: string | null = ''; 

  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.email = this.userService.getUserEmail(); 
  }

  logout() {
    this.authService.logout().then(() => {
      this.userService.clearUser(); 
      this.router.navigate(['/home']);
    }).catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
  }
}
