import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, MoveLeft } from 'lucide-angular';

import { NotificationListComponent } from '../../components/notification-list/notification-list.component';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [NotificationListComponent, LucideAngularModule],
  templateUrl: './notifications.page.html',
  styleUrl: './notifications.page.scss'
})
export class NotificationsPage {
  private readonly _router = inject(Router);

  readonly MoveLeft = MoveLeft;

  back(): void {
    this._router.navigate(['/home']);
  }
}
