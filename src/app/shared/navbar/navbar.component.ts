import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isVertical: boolean = false;
  toggleVertical() {
  this.isVertical = !this.isVertical;
  }
}
