import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardNavbarComponent } from './components/dashboard-navbar/dashboard-navbar.component';
import { DashboardSidebarComponent } from './components/dashboard-sidebar/dashboard-sidebar.component';
import { DashboardFooterComponent } from './components/dashboard-footer/dashboard-footer.component';

/**
 * SKELETON — owned by the Layout (Navbar/Sidebar/Footer) ticket, not by the
 * Overview ticket. It exists so the overview page has something to render
 * into, and defines the contract the real layout should keep:
 *
 *   - the sidebar collapses via `sidebarOpen`
 *   - page content renders through `<router-outlet>` inside <main>
 *   - <main> owns the page padding; pages render edge to edge
 *
 * Replace the three child components with the designed ones; this shell can
 * stay as is.
 */
@Component({
  selector: 'app-dashboard-layout',
  imports: [
    RouterOutlet,
    DashboardNavbarComponent,
    DashboardSidebarComponent,
    DashboardFooterComponent,
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
})
export class DashboardLayoutComponent {
  readonly sidebarOpen = signal(false);

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}
