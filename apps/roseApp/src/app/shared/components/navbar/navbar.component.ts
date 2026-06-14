import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, Menu, X } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  readonly Menu = Menu;
  readonly X = X;

  isMobileMenuOpen = false;

  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/auth']);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}