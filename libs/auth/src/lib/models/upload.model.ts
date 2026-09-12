export interface UploadResponse {
  status: boolean;
  code: number;
  payload: {
    url: string;
  };
}
