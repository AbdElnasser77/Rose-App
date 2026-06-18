import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LanguageSwitcherComponent } from '@rose/i18n';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-secondary-navbar',
  standalone: true,
  imports: [CommonModule, LanguageSwitcherComponent, TranslatePipe],
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