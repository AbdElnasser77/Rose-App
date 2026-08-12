import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ClipboardList, Gift, Headset, House, Info, LucideAngularModule, PartyPopper } from 'lucide-angular';

@Component({
  selector: 'app-main-nav-links',
  imports: [TranslatePipe , RouterLink ,LucideAngularModule],
  templateUrl: './main-nav-links.component.html',
  styleUrl: './main-nav-links.component.scss',
})
export class MainNavLinksComponent {

readonly mobile = input(false);

  readonly navItems = [
  {
    label: 'NAV.HOME',
    route: '/home',
    icon: House,
  },
  {
    label: 'NAV.PRODUCTS',
    route: '/products',
    icon: Gift,
  },
  {
    label: 'NAV.CATEGORIES',
    route: '/categories',
    icon: ClipboardList,
  },
  {
    label: 'NAV.OCCASIONS',
    route: '/occasions',
    icon: PartyPopper,
  },
  {
    label: 'NAV.CONTACT',
    route: '/contact',
    icon: Headset,
  },
  {
    label: 'NAV.ABOUT',
    route: '/about',
    icon: Info,
  },
];
}
