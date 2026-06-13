import { Component } from '@angular/core';

@Component({
  selector: 'app-secondary-navbar',
  imports: [],
  templateUrl: './secondary-navbar.component.html',
  styleUrl: './secondary-navbar.component.scss',
})
export class SecondaryNavbarComponent {
  isDropdownOpen = false;
  

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    console.log('Logout');
    this.isDropdownOpen = false;
  }
}