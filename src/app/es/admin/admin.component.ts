
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
  private readonly ADMIN_EMAIL = 'www.gamercracks@gmail.com';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user && user.email === this.ADMIN_EMAIL) {
      this.isAdmin = true;
    } else {
      this.router.navigate(['/']);
    }
  }
}
