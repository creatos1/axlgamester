import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-modses',
  templateUrl: './modses.component.html',
  styleUrl: './modses.component.css',
})
export class ModsesComponent{
  isVertical: boolean = false;
  toggleVertical() {
  this.isVertical = !this.isVertical;
  }
}
