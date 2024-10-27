// admin.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  isAdmin: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser(); // Obtén el usuario actual
    console.log(user); // Verifica el usuario actual en la consola
    if (user && user.email === 'www.gamercracks@gmail.com') {
      this.isAdmin = true; // El usuario es el admin permitido
    } else {
      this.router.navigate(['/']); // Redirigir si no es el admin permitido
    }
  }
}
