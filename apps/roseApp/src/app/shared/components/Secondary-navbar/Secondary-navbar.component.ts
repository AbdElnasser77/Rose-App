import { Component } from '@angular/core';

@Component({
  selector: 'app-secondary-navbar',
  standalone: true,
  imports: [],
  templateUrl: './secondary-navbar.component.html',
  styleUrl: './secondary-navbar.component.scss',
})
export class SecondaryNavbarComponent {
  isDropdownOpen = false;
  isMobileMenuOpen = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout(): void {
    this.isDropdownOpen = false;
    console.log('Logout');
  }
}