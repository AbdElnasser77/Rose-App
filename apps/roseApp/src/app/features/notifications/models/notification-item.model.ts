export type NotificationType =
  | 'ORDER'
  | 'PROMOTION'
  | 'SYSTEM'
  | 'REVIEW'
  | 'OTHER';


export interface NotificationItemModel {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link: string;
  createdAt: string;
  updatedAt: string;
}
