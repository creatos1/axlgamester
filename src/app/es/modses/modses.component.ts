import { Component, OnInit } from '@angular/core';
import { UserService } from '../../auth/user.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { ModMaestroService } from '../../services/mod-maestro.service';
import { MigrationService } from '../../services/migration.service';
import { CardService } from '../../services/card.service';
import { ModCompleto } from '../../models/mod.model';

@Component({
  selector: 'app-modses',
  templateUrl: './modses.component.html',
  styleUrls: ['./modses.component.scss'],
})
export class ModsesComponent implements OnInit {
  public email: string | null = '';
  public mods: ModCompleto[] = [];
  public cards: any[] = [];
  public allItems: any[] = [];
  public loading: boolean = true;
  public selectedMod: any | null = null;
  public showDonateModal = false;
  public itemToDownload: any = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private modMaestroService: ModMaestroService,
    private migrationService: MigrationService,
    private cardService: CardService
  ) {}

  async ngOnInit(): Promise<void> {
    this.email = this.userService.getUserEmail();
    await this.loadMods();
  }

  async loadMods(): Promise<void> {
    try {
      this.loading = true;

      const [modsCompletos, cardsObservable] = await Promise.all([
        this.modMaestroService.obtenerModsCompletos(),
        this.cardService.getCards().toPromise()
      ]);

      this.mods = modsCompletos;
      this.cards = cardsObservable || [];

      this.combineAllItems();
      this.loading = false;
    } catch (error) {
      console.error('Error cargando mods:', error);
      this.loading = false;
    }
  }

  private combineAllItems(): void {
    const modsDisplay = this.mods.map(mod => ({
      id: mod.id,
      nombre: mod.nombre,
      imagen: mod.imagen,
      descripcion: mod.descripcion,
      link: mod.link,
      fechaCreacion: mod.fechaCreacion,
      activo: mod.activo,
      detalles: mod.detalles,
      title: mod.nombre,
      img: mod.imagen,
      description: mod.descripcion,
      type: 'mod',
      originalData: mod
    }));

    const cardsDisplay = this.cards.map(card => ({
      id: card.id,
      title: card.title,
      img: card.img,
      description: card.description,
      link: card.link,
      type: 'card',
      creationDate: card.creationDate,
      originalData: card
    }));

    this.allItems = [...modsDisplay, ...cardsDisplay];
  }

  showItemDetails(item: any): void {
    this.selectedMod = item;
  }

  closeModal(): void {
    this.selectedMod = null;
  }

  logout() {
    this.authService.logout()
      .then(() => {
        this.userService.clearUser();
        this.router.navigate(['/home']);
      })
      .catch(error => {
        console.error('Error al cerrar sesión:', error);
      });
  }

  // 🔹 Abrir modal de donación
  openDonateModal(item: any) {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      // Redirigir sin mostrar alertas
      this.router.navigate(['/essesion.es']);
      return;
    }

    this.itemToDownload = item;
    this.showDonateModal = true;
  }

  // Abrir link en nueva pestaña
  openLink(link: string) {
    if (link) {
      window.open(link, '_blank');
    }
  }

  // Cerrar modal de donación
  closeDonateModal() {
    this.showDonateModal = false;
    this.itemToDownload = null;
  }

  // 🔹 Botón “Sí, donar”
  donate() {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.showDonateModal = false;
      this.itemToDownload = null;
      this.router.navigate(['/essesion.es']);
      return;
    }

    window.open(
      'https://www.paypal.com/paypalme/Axlgamesteryt?country.x=MX&locale.x=es_XC',
      '_blank'
    );
    this.showDonateModal = false;
    this.itemToDownload = null;
  }

  // 🔹 Botón “No, descargar”
  download() {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.showDonateModal = false;
      this.itemToDownload = null;
      this.router.navigate(['/essesion.es']);
      return;
    }

    if (this.itemToDownload?.link) {
      window.open(this.itemToDownload.link, '_blank');
    }

    this.showDonateModal = false;
    this.itemToDownload = null;
  }

  convertTimestampToDate(timestamp: any): Date {
    if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000);
    }
    if (timestamp instanceof Date) {
      return timestamp;
    }
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate();
    }
    return new Date();
  }

  async migrarDatos(): Promise<void> {
    if (confirm('¿Fusionar datos de la colección "cards" con "modsMaestro"? Se evitarán duplicados.')) {
      try {
        this.loading = true;
        await this.migrationService.verificarDatosCards();
        await this.migrationService.migrarCardsAModsMaestro();
        alert('Fusión completada. Recargando...');
        await this.loadMods();
      } catch (error) {
        console.error('Error en migración:', error);
        alert('Error durante la fusión');
      } finally {
        this.loading = false;
      }
    }
  }

  async limpiarDatosPrueba(): Promise<void> {
    if (confirm('¿Revisar y limpiar datos de prueba?')) {
      try {
        await this.migrationService.limpiarDatosPrueba();
        alert('Revisión completada. Ver consola.');
      } catch (error) {
        console.error('Error limpiando:', error);
        alert('Error durante la limpieza');
      }
    }
  }

  trackByItemId(index: number, item: any): any {
    return item.id || index;
  }
}
