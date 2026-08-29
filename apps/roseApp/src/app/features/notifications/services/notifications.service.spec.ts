import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BASE_URL_CONFIG } from '@org/auth';

import { NotificationsResponse } from '../models/notifications-response.model';
import { NotificationStore } from '../store/notification.store';
import { NotificationsService } from './notifications.service';
import { NotificationQueryParams } from '../models/notification-query-params.model';
import { UnreadCountResponse } from '../models/unread-count-response.model';
import { ActionResponse } from '../models/action-response.model';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let httpTestingController: HttpTestingController;

  const baseUrlConfigMock = {
    apiUrl: 'https://api.example.com',
  };

  const notificationStoreMock = {
    setNotificationIds: vi.fn(),
    setUnreadCount: vi.fn(),
    decreaseUnreadCount: vi.fn(),
    removeNotification: vi.fn(),
    clear: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationsService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: BASE_URL_CONFIG,
          useValue: baseUrlConfigMock,
        },
        {
          provide: NotificationStore,
          useValue: notificationStoreMock,
        },
      ],
    });

    service = TestBed.inject(NotificationsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    vi.clearAllMocks();
  });

  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //  notifications are fetched with query params and stored
  it('should get notifications with query params and update  notification ids', () => {
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
    const queryParams : NotificationQueryParams = {
        page: 1,
        limit: 20,
        type: 'ORDER',
        isRead: true,
        search: 'string',
    };

    service.getNotifications(queryParams).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(notificationStoreMock.setNotificationIds).toHaveBeenCalledWith(mockResponse.payload.data);

    });
    
    const expectedUrl = `${baseUrlConfigMock.apiUrl}/notifications`;

    const req = httpTestingController.expectOne((request) => {
      const urlMatches = request.url === expectedUrl;
      const pageMatches = request.params.get('page') === '1';
      const limitMatches = request.params.get('limit') === '20';
      const typeMatches = request.params.get('type') === 'ORDER';
      const isReadMatches = request.params.get('isRead') === 'true'; 
      const searchMatches = request.params.get('search') === 'string';

      return urlMatches && pageMatches && limitMatches && typeMatches && isReadMatches && searchMatches;
    });
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);

    
  });

  //  unread count is fetched and cached in the store
  it('should get unread count and update unread count in store', () => {
    const mockResponse : UnreadCountResponse = {
      status: true,
      code: 200,
      payload: {
        unreadCount: 5,
      },
    };

    service.getUnreadCount().subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(notificationStoreMock.setUnreadCount).toHaveBeenCalledWith(mockResponse.payload.unreadCount);
    });

    const req = httpTestingController.expectOne(`${baseUrlConfigMock.apiUrl}/notifications/unread-count`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  });
  
  //  all notifications are marked as read
  it('should mark all notifications as read and update unread count in store', () => {
    const mockResponse : ActionResponse = {
        status: true,
        code: 200,
        message: 'All notifications marked as read',
    };

    service.markAllAsRead().subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(notificationStoreMock.setUnreadCount).toHaveBeenCalledWith(0);
    });

    const req = httpTestingController.expectOne(`${baseUrlConfigMock.apiUrl}/notifications/mark-all-read`);
    expect(req.request.method).toEqual('PATCH');
    expect(req.request.body).toEqual({});
    req.flush(mockResponse);
  });

    //  a single notification is marked as read
    it('should mark a notification as read and decrease unread count in store', () => {
    const notificationId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    const mockResponse : ActionResponse = {
        status: true,
        code: 200,
        message: 'Notification marked as read',
    };

    service.markNotificationAsRead(notificationId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(notificationStoreMock.decreaseUnreadCount).toHaveBeenCalled();
    });

    const expectedUrl = `${baseUrlConfigMock.apiUrl}/notifications/${notificationId}`
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('PATCH');
    expect(req.request.body).toEqual({
       isRead: true,
    });
    req.flush(mockResponse);
    });

    //  a notification is deleted and removed from the store
    it('should delete a notification and remove it from the store', () => {
    const notificationId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    const mockResponse : ActionResponse = {
        status: true,
        code: 200,
        message: 'Notification deleted successfully',
    };

    service.deleteNotification(notificationId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(notificationStoreMock.removeNotification).toHaveBeenCalledWith(notificationId);
    });

    const expectedUrl = `${baseUrlConfigMock.apiUrl}/notifications/${notificationId}`;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('DELETE');
    req.flush(mockResponse);
    });


    //  all notifications are cleared 
    it('should clear the notifications ', () => {
    const mockResponse : ActionResponse = {
        status: true,
        code: 200,
        message: 'All notifications cleared successfully',
    };

    service.clearAllNotifications().subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(notificationStoreMock.clear).toHaveBeenCalled();
    });

    const expectedUrl = `${baseUrlConfigMock.apiUrl}/notifications/clear-all`;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('DELETE');
    req.flush(mockResponse);
    });

});
