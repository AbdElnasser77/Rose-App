import { Injectable, signal } from '@angular/core';
import { NotificationItemModel } from '../models/notification-item.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationStore {
    private readonly _unreadCount = signal(0);
    private readonly _notificationIds = signal<string[]>([]);

    readonly notificationIds = this._notificationIds.asReadonly();
    readonly unreadCount = this._unreadCount.asReadonly();

    setUnreadCount(count: number) {
        this._unreadCount.set(count);
    }

    decreaseUnreadCount(): void {
    this._unreadCount.update(count => Math.max(0, count - 1));
    }

    setNotificationIds(notifications: NotificationItemModel[]): void {
        this._notificationIds.set(notifications.map(n => n.id));
    }


    removeNotification(id: string) : void{
        this._notificationIds.update(notificationIds =>
             notificationIds.filter(notificationId => notificationId !== id)
        );
    }

    clear(): void {
    this._notificationIds.set([]);
    this._unreadCount.set(0);
   }
}
