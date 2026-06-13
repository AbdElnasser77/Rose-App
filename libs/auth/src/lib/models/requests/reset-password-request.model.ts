export interface ResetPasswordRequestModel {
  token: string;
  newPassword: string;
  confirmPassword: string;
}
