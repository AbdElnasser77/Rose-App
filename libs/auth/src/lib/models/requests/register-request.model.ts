import { Gender } from "../../types/gender.type";

export interface RegisterRequestModel {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  gender: Gender
}
