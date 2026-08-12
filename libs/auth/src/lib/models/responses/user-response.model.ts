import { UserModel } from './auth-response.model';

// Distinct from AuthResponseModel: that payload also carries a token.
export interface UserResponseModel {
  status: boolean;
  code: number;
  payload: UserPayloadModel;
}

export interface UserPayloadModel {
  user: UserModel;
}
