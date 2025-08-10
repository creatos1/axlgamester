
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AntiTamperService {
  private isDevToolsOpen = false;
  private checkInterval: any;

  constructor(private router: Router) {
    this.initProtection();
  }

  private initProtection() {
    this.detectDevTools();
    this.protectConsole();
    this.monitorDOM();
    this.preventKeyboardShortcuts();
  }

  private detectDevTools() {
    this.checkInterval = setInterval(() => {
      const threshold = 160;
      const devToolsOpen = 
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold;

      if (devToolsOpen && !this.isDevToolsOpen) {
        this.isDevToolsOpen = true;
        this.handleTamperAttempt();
      } else if (!devToolsOpen) {
        this.isDevToolsOpen = false;
      }

      // Detector adicional usando performance
      const start = performance.now();
      debugger;
      const end = performance.now();
      
      if (end - start > 100) {
        this.handleTamperAttempt();
      }
    }, 300);
  }

  private protectConsole() {
    const methods = ['log', 'debug', 'info', 'warn', 'error', 'assert', 'dir', 'dirxml', 'group', 'groupEnd', 'time', 'timeEnd', 'count', 'trace', 'profile', 'profileEnd'];
    
    methods.forEach(method => {
      (console as any)[method] = function() {
        throw new Error('Console access denied');
      };
    });

    // Limpiar consola periódicamente
    setInterval(() => {
      console.clear();
    }, 1000);
  }

  private monitorDOM() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.tagName === 'SCRIPT' && !element.hasAttribute('data-approved')) {
              element.remove();
              this.handleTamperAttempt();
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private preventKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Prevenir teclas comunes de desarrollo
      const forbiddenKeys = [
        { key: 123 }, // F12
        { ctrl: true, shift: true, key: 73 }, // Ctrl+Shift+I
        { ctrl: true, shift: true, key: 74 }, // Ctrl+Shift+J
        { ctrl: true, key: 85 }, // Ctrl+U
        { ctrl: true, shift: true, key: 67 }, // Ctrl+Shift+C
        { ctrl: true, key: 83 }, // Ctrl+S
        { key: 116 }, // F5
        { ctrl: true, key: 116 } // Ctrl+F5
      ];

      const currentKey = {
        key: e.keyCode,
        ctrl: e.ctrlKey,
        shift: e.shiftKey,
        alt: e.altKey
      };

      const isForbidden = forbiddenKeys.some(forbidden => {
        return Object.keys(forbidden).every(key => 
          currentKey[key as keyof typeof currentKey] === forbidden[key as keyof typeof forbidden]
        );
      });

      if (isForbidden) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      return true;
    });
  }

  private handleTamperAttempt() {
    console.clear();
    document.body.style.display = 'none';
    
    // Registrar intento de manipulación
    console.error('Unauthorized access attempt detected');
    
    // Redireccionar o mostrar mensaje
    alert('Acceso no autorizado detectado. La aplicación se cerrará.');
    window.location.href = 'about:blank';
  }

  public destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }
}
