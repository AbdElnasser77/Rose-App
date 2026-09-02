import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_URL_CONFIG } from '@org/auth';
import { HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { NotificationQueryParams } from '../models/notification-query-params.model';
import { NotificationsResponse } from '../models/notifications-response.model';
import { UnreadCountResponse } from '../models/unread-count-response.model';
import { NotificationStore } from '../store/notification.store';
import { ActionResponse } from '../models/action-response.model';
import { SKIP_LOADER } from '@org/shared-util-loader';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
   private _httpClient = inject(HttpClient);
  private readonly _baseUrlConfig =inject(BASE_URL_CONFIG);
  private _notificationStore= inject(NotificationStore);


  private readonly _skipLoaderContext = new HttpContext().set(
  SKIP_LOADER,
  true
  );
 // 1 - getNotifications
  getNotifications(query: NotificationQueryParams = {}): Observable<NotificationsResponse> {
    let params = new HttpParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this._httpClient.get<NotificationsResponse>(
      `${this._baseUrlConfig.apiUrl}/notifications`,
      {
        params,
        context: this._skipLoaderContext,
      }
    ).pipe(
      tap(response => {
        this._notificationStore.setNotificationIds(response.payload.data);
      })
    );
  }

//   2- get Unread Count
getUnreadCount(): Observable<UnreadCountResponse> {
    return this._httpClient.get<UnreadCountResponse>(
        `${this._baseUrlConfig.apiUrl}/notifications/unread-count`,
        { context: this._skipLoaderContext }
    ).pipe(
        tap(response => {
            this._notificationStore.setUnreadCount(response.payload.unreadCount);
        })
    );
}

//   3- markAllAsRead
markAllAsRead(): Observable<ActionResponse> {
  return this._httpClient.patch<ActionResponse>(
        `${this._baseUrlConfig.apiUrl}/notifications/mark-all-read`,
        {},
        { context: this._skipLoaderContext }
    ).pipe(
        tap(() => {
            this._notificationStore.setUnreadCount(0);
        })
    );
}

//   4- mark Notification AsRead
markNotificationAsRead(id: string): Observable<ActionResponse> {
  return this._httpClient.patch<ActionResponse>(
        `${this._baseUrlConfig.apiUrl}/notifications/${id}`,
        {
          isRead: true,
        },
        { context: this._skipLoaderContext }
    ).pipe(
        tap(() => {
            this._notificationStore.decreaseUnreadCount();
        })
    );
}

//   5- delete Notification
deleteNotification(id: string): Observable<ActionResponse> {
  return this._httpClient.delete<ActionResponse>(
        `${this._baseUrlConfig.apiUrl}/notifications/${id}`,
        { context: this._skipLoaderContext }
    ).pipe(
        tap(() => {
            this._notificationStore.removeNotification(id);
        })
    );
}

//   6- clear all Notifications
clearAllNotifications(): Observable<ActionResponse> {
  return this._httpClient.delete<ActionResponse>(
        `${this._baseUrlConfig.apiUrl}/notifications/clear-all`,
        { context: this._skipLoaderContext }
    ).pipe(
        tap(() => {
           this._notificationStore.clear();
        })
    );
}
}