import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { NotificationItemModel } from '../../models/notification-item.model';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { EllipsisVertical, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [MenuModule, LucideAngularModule, TranslatePipe],
  templateUrl: './notification-item.component.html',
  styleUrl: './notification-item.component.scss',
})
export class NotificationItemComponent {
    item = input.required<NotificationItemModel>();
    markAsReadClicked = output<string>();
    deleteClicked = output<string>();

    readonly EllipsisVertical = EllipsisVertical;
    items: MenuItem[] = [
      {
      label: 'NOTIFICATIONS.MARK_AS_READ',
      icon: 'pi pi-check',
      command: () => this.markAsRead(),
    },
    {
      label: 'NOTIFICATIONS.DELETE',
      icon: 'pi pi-trash',
      command: () => this.deleteNotification(),
    },
  ];

  markAsRead() {
    if (this.item().isRead) {
    return;
    }
    this.markAsReadClicked.emit(this.item().id);
  }

  deleteNotification() {
    
    this.deleteClicked.emit(this.item().id);
    
  }
}
