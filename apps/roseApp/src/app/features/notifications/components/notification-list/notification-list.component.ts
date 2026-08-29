import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BrushCleaning, CheckCheck, LucideAngularModule ,BellOff } from 'lucide-angular';

import { NotificationItemModel } from '../../models/notification-item.model';
import { NotificationsService } from '../../services/notifications.service';
import { NotificationStore } from '../../store/notification.store';
import { NotificationItemComponent } from '../notification-item/notification-item.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [NotificationItemComponent, LucideAngularModule,TranslatePipe],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.scss',
})
export class NotificationListComponent implements OnInit{
  private readonly destroyRef = inject(DestroyRef);
  private readonly _notificationsService = inject(NotificationsService);
  private readonly _notificationStore = inject(NotificationStore);

  readonly notifications = signal<NotificationItemModel[]>([]);
  readonly totalNotifications = computed(() => this.notifications().length);
  readonly unreadCount = this._notificationStore.unreadCount;

  readonly BrushCleaning = BrushCleaning;
  readonly CheckCheck = CheckCheck;
  readonly BellOff = BellOff;
  
  ngOnInit(): void {
    this.loadNotifications();
  }
  

  loadNotifications(): void {
    this._notificationsService
      .getNotifications()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        this.notifications.set(response.payload.data);
      });
  }

  markAllAsRead(): void {
    this._notificationsService
      .markAllAsRead()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  clearAll(): void {
    this._notificationsService
      .clearAllNotifications()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  handleMarkAsRead(id: string): void {
    this._notificationsService
      .markNotificationAsRead(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  handleDelete(id: string): void {
    this._notificationsService
      .deleteNotification(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
