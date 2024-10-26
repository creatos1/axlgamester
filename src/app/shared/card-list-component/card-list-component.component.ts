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
        <button class="ebnn" (click)="navigateToDownload(card.link)">Descargar</button>
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
