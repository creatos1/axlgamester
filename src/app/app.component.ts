import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SslService } from './services/ssl.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'axlgamester';

  constructor(private sslService: SslService) {}

  ngOnInit(): void {
    // Configurar SSL y políticas de seguridad
    this.sslService.configureSslPolicies();

    // Forzar HTTPS en producción
    if (this.isProduction()) {
      this.sslService.enforceHttps();
    }
  }

  private isProduction(): boolean {
    return window.location.hostname !== 'localhost' &&
           window.location.hostname !== '127.0.0.1' &&
           !window.location.hostname.includes('replit');
  }
}