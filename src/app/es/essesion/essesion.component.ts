import { Component } from '@angular/core';

@Component({
  selector: 'app-essesion',
  templateUrl: './essesion.component.html',
  styleUrls: ['./essesion.component.scss']  // Corregido de styleUrl a styleUrls
})
export class EssesionComponent {
  usuario: string = '';
  password: string = '';
  isVertical: boolean = false;

  
  toggleVertical() {
    this.isVertical = !this.isVertical;
  }

  
}
