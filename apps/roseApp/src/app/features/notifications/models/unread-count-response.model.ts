export interface UnreadCountResponse {
  status: boolean;
  code: number;
  payload: {
    unreadCount: number;
  };
}
