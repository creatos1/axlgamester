
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-en',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterEnComponent {
  isVertical: boolean = false;

  ngOnInit(): void {}

  toggleVertical() {
    this.isVertical = !this.isVertical;
  }
}
