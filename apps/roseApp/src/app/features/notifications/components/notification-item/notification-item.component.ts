import { Component, input } from '@angular/core';
import { NotificationItemModel } from '../../models/notification-item.model';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [MenuModule],
  templateUrl: './notification-item.component.html',
  styleUrl: './notification-item.component.scss',
})
export class NotificationItemComponent {
    item = input.required<NotificationItemModel>();

    items: MenuItem[] | undefined;
}
