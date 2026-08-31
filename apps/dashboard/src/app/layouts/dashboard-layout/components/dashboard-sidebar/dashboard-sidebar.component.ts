import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {
  Bell,
  LayoutDashboard,
  LucideAngularModule,
  LucideIconData,
  Package,
  Settings,
  ShoppingCart,
} from 'lucide-angular';

interface SidebarLink {
  path: string;
  labelKey: string;
  icon: LucideIconData;
}

/**
 * SKELETON — placeholder for the Layout ticket. The nav items below are
 * scaffolding: only `/dashboard` (Overview) resolves today, the rest are the
 * routes this sprint is expected to add.
 */
@Component({
  selector: 'app-dashboard-sidebar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe, LucideAngularModule],
  templateUrl: './dashboard-sidebar.component.html',
  styleUrl: './dashboard-sidebar.component.scss',
})
export class DashboardSidebarComponent {
  readonly open = input(false);
  readonly dismiss = output<void>();

  readonly activeItemClass =
    'bg-zinc-900 text-white dark:bg-soft-pink-300 dark:text-zinc-900';
  readonly idleItemClass =
    'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800';

  readonly links: SidebarLink[] = [
    {
      path: '/dashboard',
      labelKey: 'DASHBOARD.LAYOUT.NAV.OVERVIEW',
      icon: LayoutDashboard,
    },
    {
      path: '/dashboard/products',
      labelKey: 'DASHBOARD.LAYOUT.NAV.PRODUCTS',
      icon: Package,
    },
    {
      path: '/dashboard/orders',
      labelKey: 'DASHBOARD.LAYOUT.NAV.ORDERS',
      icon: ShoppingCart,
    },
    {
      path: '/dashboard/notifications',
      labelKey: 'DASHBOARD.LAYOUT.NAV.NOTIFICATIONS',
      icon: Bell,
    },
    {
      path: '/dashboard/settings',
      labelKey: 'DASHBOARD.LAYOUT.NAV.SETTINGS',
      icon: Settings,
    },
  ];
}
