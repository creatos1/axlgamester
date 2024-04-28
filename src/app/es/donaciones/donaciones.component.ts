import { Component } from '@angular/core';

@Component({
  selector: 'app-donaciones',
  templateUrl: './donaciones.component.html',
  styleUrl: './donaciones.component.scss'
})
export class DonacionesComponent {
  isVertical: boolean = false;

  toggleVertical() {
    this.isVertical = !this.isVertical;
  }
}
