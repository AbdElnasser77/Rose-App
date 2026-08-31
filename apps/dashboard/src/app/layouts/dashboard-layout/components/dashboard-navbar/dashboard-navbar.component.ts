import { Component, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule, Menu } from 'lucide-angular';

/**
 * SKELETON — placeholder for the Layout ticket. Structure and the `menuToggle`
 * output are the contract; everything visual here is a stand-in.
 */
@Component({
  selector: 'app-dashboard-navbar',
  imports: [TranslatePipe, LucideAngularModule],
  templateUrl: './dashboard-navbar.component.html',
  styleUrl: './dashboard-navbar.component.scss',
})
export class DashboardNavbarComponent {
  readonly menuToggle = output<void>();

  readonly Menu = Menu;
}
