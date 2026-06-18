import { Role } from "../types";

export interface JwtPayloadModel {
 userId: string;
  role: Role ;
  iat: number;
  exp: number;
}
