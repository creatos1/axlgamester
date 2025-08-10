
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // Agregar headers de seguridad
    const secureReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    // Validar que la URL sea segura
    if (this.isUrlSafe(req.url)) {
      return next.handle(secureReq);
    } else {
      throw new Error('URL no segura detectada');
    }
  }
  
  private isUrlSafe(url: string): boolean {
    // Lista de patrones peligrosos
    const dangerousPatterns = [
      /javascript:/i,
      /vbscript:/i,
      /data:/i,
      /<script/i,
      /eval\s*\(/i,
      /expression\s*\(/i
    ];
    
    return !dangerousPatterns.some(pattern => pattern.test(url));
  }
}
