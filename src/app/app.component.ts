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
    const hostname = window.location.hostname;
    return !hostname.includes('localhost') &&
           !hostname.includes('127.0.0.1') &&
           !hostname.includes('replit.dev') &&
           (hostname.includes('replit.app') ||
            hostname.includes('vercel.app') || 
            hostname.includes('axlgamester.com'));
  }
}