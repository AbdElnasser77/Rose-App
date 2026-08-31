import { Component, computed, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
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

  readonly notifications = signal<NotificationItemModel[]| null>(null);
  readonly totalNotifications = computed(() => this.notifications()?.length ?? 0);
  readonly unreadCount = this._notificationStore.unreadCount;
  readonly isLoading = signal(false);
  readonly closeRequested = output<void>();

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
      .subscribe({
      next: (response) => {
        this.notifications.set(response.payload.data);
        
        
      },
      error: () => {
        this.notifications.set([]);
      }
    });
  }

  markAllAsRead(): void {
    this._notificationsService
      .markAllAsRead()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: () => this.loadNotifications()
    });
  }

  clearAll(): void {
    this._notificationsService
      .clearAllNotifications()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: () => this.loadNotifications()
    });
  }

  handleMarkAsRead(id: string): void {
    this._notificationsService
      .markNotificationAsRead(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: () => this.loadNotifications()
      
    });
  }

  handleDelete(id: string): void {
    this._notificationsService
      .deleteNotification(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: () => this.loadNotifications()
    });
  }
}
