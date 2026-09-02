import { NotificationItemModel } from './notification-item.model';

export interface NotificationsResponse {
  status: boolean
  code: number
  message: string
  payload: Payload
}

export interface Payload {
  data: NotificationItemModel[]
  metadata: Metadata
}


export interface Metadata {
  page: number
  limit: number
  total: number
  totalPages: number
}
