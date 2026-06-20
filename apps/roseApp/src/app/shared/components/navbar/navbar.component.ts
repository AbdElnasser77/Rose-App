import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageSwitcherComponent } from '@rose/i18n';
import { ThemeToggleComponent } from '@rose/theme';
import { Gift, Home, House, LucideAngularModule, Menu, X } from 'lucide-angular';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, LanguageSwitcherComponent, ThemeToggleComponent, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  readonly Menu = Menu;
  readonly X = X;
  readonly House = House;
  readonly Gift = Gift;


  isLoggedIn = false;
  isDropdownOpen = false;
  isMobileMenuOpen = false;

  constructor(private router: Router) {}

  goToLogin(): void {
    this.router.navigate(['/auth']);
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout(): void {
    this.isLoggedIn = false;
    this.isDropdownOpen = false;
  }
}