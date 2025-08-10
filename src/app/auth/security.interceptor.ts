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
        'Expires': '0',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://firebaseapp.com https://*.firebaseapp.com https://www.gstatic.com https://cdn.jsdelivr.net https://pagead2.googlesyndication.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https: blob: https://i.ytimg.com https://yt3.ggpht.com; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://identitytoolkit.googleapis.com; frame-src 'self' https://www.youtube.com https://youtube.com; media-src 'self'"
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