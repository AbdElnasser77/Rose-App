import { Component, computed, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { NotificationItemModel } from '../../models/notification-item.model';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { EllipsisVertical, LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [MenuModule, LucideAngularModule, TranslatePipe ,CommonModule ],
  templateUrl: './notification-item.component.html',
  styleUrl: './notification-item.component.scss',
})
export class NotificationItemComponent {
    item = input.required<NotificationItemModel>();
    markAsReadClicked = output<string>();
    deleteClicked = output<string>();
    notificationClicked = output<NotificationItemModel>();

    readonly EllipsisVertical = EllipsisVertical;
    items=computed<MenuItem[]>(()=>
      [
      {
      id: 'mark-as-read',
      label: 'NOTIFICATIONS.MARK_AS_READ',
      disabled: this.item().isRead,
      icon: 'pi pi-check',
      iconClass:this.item().isRead ?'text-zinc-400 dark:text-zinc-500' : 'text-zinc-500 dark:text-zinc-400',
      labelClass:this.item().isRead ?'text-zinc-400 dark:text-zinc-500':'text-zinc-800 dark:text-zinc-50',
      command: () => this.markAsRead(),
    },
    {
      id: 'delete',
      label: 'NOTIFICATIONS.DELETE',
      icon: 'pi pi-trash',
      iconColor: 'text-red-600 dark:text-red-500',
      labelColor:'text-zinc-800 dark:text-zinc-50',
      command: () => this.deleteNotification(),
    },
  ]
    ) ;

  markAsRead() {
    if (this.item().isRead) {
    return;
    }
    this.markAsReadClicked.emit(this.item().id);
  }

  deleteNotification() {
    
    this.deleteClicked.emit(this.item().id);
    
  }
  
  handleNotificationClicked(event: Event): void {
    event.preventDefault();

  this.notificationClicked.emit(this.item());
  }

  onMenuItemClick(item: MenuItem): void {
  if (item.disabled) return;

  switch (item.id) {
    case 'mark-as-read':
      this.markAsRead();
      break;

    case 'delete':
      this.deleteNotification();
      break;
  }
}
}
