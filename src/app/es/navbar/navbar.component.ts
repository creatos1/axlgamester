import { Component } from '@angular/core';
import { UserService } from '../../auth/user.service';

@Component({
  selector: 'app-nav',  // Ensure this selector is correct
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  public isVertical: boolean = false;
  public isDropdownOpen: boolean = false;

  constructor(public userService: UserService) {}

  toggleVertical() {
    this.isVertical = !this.isVertical;
  }
}
