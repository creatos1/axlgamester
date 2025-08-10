
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  
  constructor(private sanitizer: DomSanitizer) {}

  // Sanitizar entrada de usuario contra XSS
  sanitizeInput(input: string): string {
    if (!input) return '';
    
    // Remover scripts y tags peligrosos
    let sanitized = input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      .replace(/<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi, '')
      .replace(/<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/data:/gi, '')
      .replace(/on\w+\s*=/gi, '');

    // Escapar caracteres HTML
    const div = document.createElement('div');
    div.textContent = sanitized;
    return div.innerHTML;
  }

  // Validar formato de email de forma estricta
  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  // Validar contraseña contra patrones peligrosos
  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }
    
    if (password.length > 128) {
      errors.push('La contraseña no puede exceder 128 caracteres');
    }
    
    // Detectar patrones de inyección SQL
    const sqlPatterns = /(\bOR\b|\bAND\b|\bUNION\b|\bSELECT\b|\bINSERT\b|\bDELETE\b|\bUPDATE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/i;
    if (sqlPatterns.test(password)) {
      errors.push('La contraseña contiene caracteres no permitidos');
    }
    
    // Detectar scripts
    if (/<[^>]*>/.test(password)) {
      errors.push('La contraseña no puede contener etiquetas HTML');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Proteger contra CSRF
  generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Limpiar URLs para prevenir inyección
  sanitizeUrl(url: string): string {
    const allowedProtocols = ['http:', 'https:', 'mailto:'];
    try {
      const urlObj = new URL(url);
      if (!allowedProtocols.includes(urlObj.protocol)) {
        return '#';
      }
      return url;
    } catch {
      return '#';
    }
  }
}
