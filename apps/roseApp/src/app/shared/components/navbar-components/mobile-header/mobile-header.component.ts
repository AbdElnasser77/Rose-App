import { Component, output } from '@angular/core';
import {  LucideAngularModule, Menu } from 'lucide-angular';

@Component({
  selector: 'app-mobile-header',
  imports: [ LucideAngularModule],
  templateUrl: './mobile-header.component.html',
  styleUrl: './mobile-header.component.scss',
})
export class MobileHeaderComponent {
  readonly Menu = Menu;
  
  
  readonly menuToggle = output<void>();

  toggleMenu(): void {
    this.menuToggle.emit();
  }
}
