import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotificationListComponent } from './notification-list.component';
import { NotificationsService } from '../../services/notifications.service';
import { NotificationStore } from '../../store/notification.store';
import { signal } from '@angular/core';
import { NotificationsResponse } from '../../models/notifications-response.model';
import { of } from 'rxjs';
import { ActionResponse } from '../../models/action-response.model';

describe('NotificationListComponent', () => {
  let component: NotificationListComponent;
  let fixture: ComponentFixture<NotificationListComponent>;

  const mockNotificationsService = {
      getNotifications: vi.fn(),
      markAllAsRead: vi.fn(),
      clearAllNotifications: vi.fn(),
      markNotificationAsRead: vi.fn(),
      deleteNotification: vi.fn(),
  };

  const mockNotificationStore = {
      unreadCount: signal(0),
  };
  const mockResponse: NotificationsResponse = {
          status: true,
          code: 200,
          message: 'Notifications retrieved successfully',
          payload: {
            data: [
              {
                id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                userId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                type: 'ORDER',
                title: 'string',
                message: 'string',
                isRead: true,
                link: 'string',
                createdAt: '2026-08-29T07:33:08.889Z',
                updatedAt: '2026-08-29T07:33:08.889Z',
              },
            ],
            metadata: {
              page: 1,
              limit: 20,
              total: 1,
              totalPages: 1,
            },
          },
        };
  const mockActionResponse: ActionResponse = {
  status: true,
  code: 200,
  message: 'Action completed successfully',
};
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationListComponent],
      providers: [
        { provide: NotificationsService, useValue: mockNotificationsService },
        { provide: NotificationStore, useValue: mockNotificationStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationListComponent);
    component = fixture.componentInstance;

    
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load notifications', () => {
    
  mockNotificationsService.getNotifications.mockReturnValue(
    of(mockResponse)
  );

  component.loadNotifications();

  expect( mockNotificationsService.getNotifications).toHaveBeenCalled();
  expect(component.notifications()).toEqual(mockResponse.payload.data);
  });
it('should load notifications on init', () => {
  mockNotificationsService.getNotifications.mockReturnValue(
    of(mockResponse)
  );

  component.ngOnInit();

  expect(
    mockNotificationsService.getNotifications
  ).toHaveBeenCalled();
});
  it('should mark all notifications as read', () => {
  mockNotificationsService.markAllAsRead.mockReturnValue(of(mockActionResponse));

  component.markAllAsRead();

  expect(mockNotificationsService.markAllAsRead).toHaveBeenCalled();
   });

   it('should clear all notifications', () => {
  mockNotificationsService.clearAllNotifications.mockReturnValue(of(mockActionResponse));

  component.clearAll();

  expect(
    mockNotificationsService.clearAllNotifications
  ).toHaveBeenCalled();
});

it('should mark a notification as read', () => {
  const notificationId = 'notification-123';

  mockNotificationsService.markNotificationAsRead.mockReturnValue(of(mockActionResponse));

  component.handleMarkAsRead(notificationId);

  expect(
    mockNotificationsService.markNotificationAsRead
  ).toHaveBeenCalledWith(notificationId);
});

it('should delete a notification', () => {
  const notificationId = 'notification-123';

  mockNotificationsService.deleteNotification.mockReturnValue(of(mockActionResponse));

  component.handleDelete(notificationId);

  expect(
    mockNotificationsService.deleteNotification
  ).toHaveBeenCalledWith(notificationId);
});
  
 
  


   
  
});
