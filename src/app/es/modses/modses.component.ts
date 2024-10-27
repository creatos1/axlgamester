import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../auth/user.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { CardListComponent } from '../../shared/card-list-component/card-list-component.component'; // Importa tu componente de lista de tarjetas

@Component({
  selector: 'app-modses',
  templateUrl: './modses.component.html',
  styleUrls: ['./modses.component.scss'], // Corrige aquí `styleUrl` a `styleUrls`
})
export class ModsesComponent implements OnInit {
  public email: string | null = '';

  @ViewChild(CardListComponent) cardListComponent!: CardListComponent; // Acceder al CardListComponent

  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.email = this.userService.getUserEmail();
  }

  toggleFilters() {
    if (this.cardListComponent) {
      this.cardListComponent.toggleFilters(); // Llama al método toggleFilters del CardListComponent
    }
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
