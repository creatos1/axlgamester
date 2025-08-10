
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SslService {

  constructor() {}

  // Verificar si la conexión es segura
  isSecureConnection(): boolean {
    return window.location.protocol === 'https:';
  }

  // Forzar redirección a HTTPS
  enforceHttps(): void {
    // Skip HTTPS enforcement in development environments
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname.includes('replit');
    
    if (!this.isSecureConnection() && !isDevelopment) {
      const httpsUrl = 'https://' + window.location.hostname + window.location.pathname + window.location.search;
      window.location.replace(httpsUrl);
    }
  }

  // Verificar certificado SSL (solo funciona en producción)
  checkSslCertificate(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.isSecureConnection()) {
        resolve(false);
        return;
      }

      // En un entorno real, aquí verificarías el certificado
      // Por ahora, asumimos que si estamos en HTTPS, el certificado es válido
      resolve(true);
    });
  }

  // Configurar políticas de seguridad SSL
  configureSslPolicies(): void {
    // Agregar meta tags de seguridad si no existen
    this.addMetaTag('http-equiv', 'Content-Security-Policy', 
      "default-src 'self'; script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https:; media-src 'self'");
    
    this.addMetaTag('http-equiv', 'Strict-Transport-Security', 
      'max-age=31536000; includeSubDomains; preload');
    
    this.addMetaTag('http-equiv', 'X-Content-Type-Options', 'nosniff');
    this.addMetaTag('http-equiv', 'X-Frame-Options', 'DENY');
  }

  private addMetaTag(httpEquiv: string, content: string, contentValue: string): void {
    const existingTag = document.querySelector(`meta[http-equiv="${httpEquiv}"]`);
    if (!existingTag) {
      const meta = document.createElement('meta');
      meta.httpEquiv = httpEquiv;
      meta.content = contentValue;
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  }
}
