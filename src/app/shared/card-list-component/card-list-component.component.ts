import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { Firestore, collection, collectionData, CollectionReference } from '@angular/fire/firestore';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

interface Card {
  img: string;
  title: string;
  description: string;
  link: string;
  creationDate: Date;
}

@Component({
  selector: 'app-card-list',
  styleUrls: ['./card-list-component.component.css'],
  template: `
    <div class="container">
  <div class="hamburger" (click)="toggleFilters()">
    &#9776; <!-- Ícono de hamburguesa -->
  </div>

  <aside class="filter-section" [ngClass]="{ 'active': filtersVisible }">
    <section>
    <input type="text" placeholder="Buscar por nombre" [(ngModel)]="searchQuery">
    <button (click)="onSearch()">Buscar</button>
    </section>

    <select (change)="onFilterChange($event)">
      <option value="all">Todos</option>
      <option value="gow1">God of War I</option>
      <option value="gow2">God of War II</option>
    </select>
    <select (change)="onSortChange('title', $event)">
      <option value="asc">Ordenar por Nombre (Asc)</option>
      <option value="desc">Ordenar por Nombre (Desc)</option>
    </select>
  </aside>

  <div class="cards-container">
    <div class="card" *ngFor="let card of (filteredCards$ | async)">
      <img [src]="card.img" alt="{{ card.title }}">
      <div class="card-overlay">
        <h5 class="card-title">{{ card.title }}</h5>
        <p class="card-text">{{ card.description }}</p>
        <button class="ebnn" (click)="confirmDownload(card.link)">Descargar</button>
        </div>
    </div>
  </div>
<!-- Modal de donación -->
<div class="donation-modal" *ngIf="showDonationModal">
  <div class="modal-content">
    <div class="icon-container">
      <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal Icon" class="paypal-icon">
    </div>
    <p>¿Te gustaría apoyar con una donación?</p>
    <div class="modal-buttons">
      <button (click)="handleDonationResponse(true)">Sí</button>
      <button (click)="handleDonationResponse(false)">No</button>
    </div>
  </div>
</div>



</div>

  `,
})
export class CardListComponent implements OnInit {
  filtersVisible = false; // Estado de visibilidad de los filtros
  cards$: Observable<Card[]>;
  filteredCards$: Observable<Card[]> = new Observable<Card[]>();
  searchQuery: string = '';
  filterType: string = 'all';
  sortField: string = 'title';
  sortDirection: string = 'asc';
  showDonationModal = false;
  downloadLink: string | null = null; // Guarda el link temporalmente
  
  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private router: Router
  ) {
    const cardCollection = collection(this.firestore, 'cards') as CollectionReference<Card>;
    this.cards$ = collectionData(cardCollection);
  }

  ngOnInit(): void {
    this.filteredCards$ = combineLatest([this.cards$]).pipe(
      map(([cards]) => {
        let filteredCards = cards.filter(card => {
          const description = card.description.toLowerCase();
          if (this.filterType === 'gow1') {
            return description.includes('god of war i') && !description.includes('god of war ii');
          } else if (this.filterType === 'gow2') {
            return description.includes('god of war ii');
          }
          return true; // Si no hay filtro, mostrar todos
        });

        if (this.searchQuery) {
          filteredCards = filteredCards.filter(card =>
            card.title.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
        }

        filteredCards.sort((a, b) => {
          const valueA = a[this.sortField as keyof Card];
          const valueB = b[this.sortField as keyof Card];

          if (this.sortDirection === 'asc') {
            return valueA > valueB ? 1 : -1;
          } else {
            return valueA < valueB ? 1 : -1;
          }
        });

        return filteredCards;
      })
    );
  }

  toggleFilters() {
    this.filtersVisible = !this.filtersVisible;
  }
  confirmDownload(link: string) {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.downloadLink = link; // Guardar el link de descarga
      this.showDonationModal = true; // Mostrar el modal
    } else {
      this.router.navigate(['/essesion.es']);
    }
  }
  
  handleDonationResponse(acceptDonation: boolean) {
    this.showDonationModal = false;
    if (acceptDonation) {
      // Si acepta donar, redirige a PayPal
      window.open('https://paypal.me/Axlgamesteryt?country.x=MX&locale.x=es_XC', '_blank');
    } else if (this.downloadLink) {
      // Si no acepta donar, redirige al enlace de descarga
      window.open(this.downloadLink, '_blank');
      this.downloadLink = null; // Limpia el enlace después de usarlo
    }
  }

  navigateToDownload(link: string) {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      window.open(link, '_blank');
    } else {
      this.router.navigate(['/essesion.es']);
    }
  }

  onSearch() {
    this.ngOnInit();
  }

  onFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.filterType = target.value;
    this.ngOnInit();
  }

  onSortChange(sortField: string, event: Event) {
    const target = event.target as HTMLSelectElement;
    this.sortField = sortField;
    this.sortDirection = target.value;
    this.ngOnInit();
  }
}
