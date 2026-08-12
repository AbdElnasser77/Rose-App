import { Gender } from "../../types/gender.type"
import { Role } from "../../types/role.type"

export interface AuthResponseModel {
    status: boolean
    code: number
    payload: AuthPayloadModel
}

export interface AuthPayloadModel {
  user: UserModel
  token: string
}
export interface UserModel {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  gender: Gender;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: Role;
  createdAt: string;
  // Optional: the login/register payloads are not documented to return these,
  // only GET/PATCH /users/profile is.
  photo?: string | null;
  updatedAt?: string;
}

