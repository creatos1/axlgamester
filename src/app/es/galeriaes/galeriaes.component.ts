import { Component } from '@angular/core';

@Component({
  selector: 'app-galeriaes',
  templateUrl: './galeriaes.component.html',
  styleUrl: './galeriaes.component.scss'
})
export class GaleriaesComponent {
  isVertical: boolean = false;
  toggleVertical() {
  this.isVertical = !this.isVertical;
  }
}
