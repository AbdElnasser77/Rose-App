import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateService } from '@ngx-translate/core';
import { NotificationItemComponent } from './notification-item.component';
import { NotificationItemModel } from '../../models/notification-item.model';

describe('NotificationItemComponent', () => {
  let component: NotificationItemComponent;
  let fixture: ComponentFixture<NotificationItemComponent>;

  const mockItem: NotificationItemModel = {
    id: 'notification-123',
    userId: 'user-456',
    type: 'ORDER',
    title: 'Order shipped',
    message: 'Your order is on the way.',
    isRead: false,
    link: '/orders/123',
    createdAt: '2026-08-29T07:33:08.889Z',
    updatedAt: '2026-08-29T07:33:08.889Z',
  };

  const translateServiceMock = {
    currentLang: 'en',
    instant: (key: string) => key,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationItemComponent],
      providers: [{ provide: TranslateService, useValue: translateServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', mockItem);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit markAsReadClicked when the notification is unread', () => {
    const emitSpy = vi.spyOn(component.markAsReadClicked, 'emit');

    component.markAsRead();

    expect(emitSpy).toHaveBeenCalledWith(mockItem.id);
  });

  it('should not emit markAsReadClicked when the notification is already read', () => {
    const emitSpy = vi.spyOn(component.markAsReadClicked, 'emit');
    fixture.componentRef.setInput('item', { ...mockItem, isRead: true });
    fixture.detectChanges();

    component.markAsRead();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit deleteClicked when deleteNotification is called', () => {
    const emitSpy = vi.spyOn(component.deleteClicked, 'emit');

    component.deleteNotification();

    expect(emitSpy).toHaveBeenCalledWith(mockItem.id);
  });

  
});
