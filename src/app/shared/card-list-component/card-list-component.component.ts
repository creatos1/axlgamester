import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, BehaviorSubject, combineLatest, from } from 'rxjs';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

interface Card {
  img: string;
  title: string;
  description: string;
  link: string;
  creationDate?: Date;
  juego?: string;
  detalles?: any[];
}

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./card-list-component.component.css'],
  template: `
    <div class="container">
      <aside class="filter-section" [ngClass]="{ 'active': filtersVisible }">
        <section>
          <input type="text" placeholder="Buscar por nombre" [(ngModel)]="searchQuery" (input)="onSearch()">
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
  filtersVisible = false;
  private cardsSubject = new BehaviorSubject<Card[]>([]);
  filteredCards$: Observable<Card[]>;
  searchQuery = '';
  currentFilter = 'all';
  sortField = 'title';
  sortDirection = 'asc';
  showDonationModal = false;
  downloadLink: string | null = null;

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private router: Router
  ) {
    this.filteredCards$ = combineLatest([this.cardsSubject]).pipe(
      map(([cards]) => this.applyFiltersAndSorting(cards))
    );
  }

  ngOnInit(): void {
    this.loadCardsFromFirestore();
  }

  async loadCardsFromFirestore(): Promise<void> {
    try {
      const cardsCollection = collection(this.firestore, 'cards');
      const snapshot = await getDocs(cardsCollection);

      const cardsData: Card[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          img: data['img'] || '',
          title: data['title'] || '',
          description: data['description'] || '',
          link: data['link'] || '#',
          // Optional fields
          creationDate: data['creationDate'] ? data['creationDate'].toDate() : undefined,
          juego: data['juego'],
          detalles: data['detalles'],
        };
      });

      this.cardsSubject.next(cardsData);
    } catch (error) {
      console.error('Error cargando cards desde Firestore:', error);
    }
  }

  applyFiltersAndSorting(cards: Card[]): Card[] {
    let filtered = cards.filter(card => {
      const matchesSearch = card.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      let matchesFilter = true;

      if (this.currentFilter !== 'all') {
        matchesFilter = card.juego === this.currentFilter;
      }

      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      const valA = a[this.sortField as keyof Card] as string;
      const valB = b[this.sortField as keyof Card] as string;

      if (!valA || !valB) return 0;

      if (this.sortDirection === 'asc') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });

    return filtered;
  }

  onSearch() {
    this.applyFilters();
  }

  onFilterChange(event: any) {
    this.currentFilter = event.target.value;
    this.applyFilters();
  }

  onSortChange(sortField: string, event: Event) {
    const target = event.target as HTMLSelectElement;
    this.sortField = sortField;
    this.sortDirection = target.value;
    this.applyFilters();
  }

  confirmDownload(link: string) {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.downloadLink = link;
      this.showDonationModal = true;
    } else {
      this.router.navigate(['/essesion.es']);
    }
  }

  handleDonationResponse(acceptDonation: boolean) {
    this.showDonationModal = false;
    if (acceptDonation) {
      window.open('https://paypal.me/Axlgamesteryt?country.x=MX&locale.x=es_XC', '_blank');
    } else if (this.downloadLink) {
      window.open(this.downloadLink, '_blank');
      this.downloadLink = null;
    }
  }

  private applyFilters() {
    const currentCards = this.cardsSubject.getValue();
    this.cardsSubject.next([...currentCards]);
  }

  toggleFilters() {
    this.filtersVisible = !this.filtersVisible;
  }
}
