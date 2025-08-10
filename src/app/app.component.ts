import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AntiTamperService } from './services/anti-tamper.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'gamester';

  constructor(private antiTamperService: AntiTamperService) {}

  ngOnInit() {
    // El servicio se inicializa automáticamente
    this.addRuntimeProtections();
  }

  ngOnDestroy() {
    this.antiTamperService.destroy();
  }

  private addRuntimeProtections() {
    // Protección adicional contra modificación de elementos
    document.addEventListener('DOMContentLoaded', () => {
      const allElements = document.querySelectorAll('*');
      allElements.forEach(element => {
        // Proteger atributos críticos
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes') {
              const target = mutation.target as Element;
              if (target.hasAttribute('data-protected')) {
                // Revertir cambios no autorizados
                target.setAttribute(mutation.attributeName!, mutation.oldValue || '');
              }
            }
          });
        });

        observer.observe(element, {
          attributes: true,
          attributeOldValue: true
        });
      });
    });
  }
}