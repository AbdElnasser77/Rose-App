import { Observable } from "rxjs";
import { SendEmailVerificationRequestModel } from "../models/requests/send-email-verification-request.model";
import { ApiResponseModel } from "../models/responses/api-response.model";
import { ConfirmEmailVerificationRequestModel } from "../models/requests/confirm-email-verification-request.model";
import { RegisterRequestModel } from "../models/requests/register-request.model";
import { LoginRequestModel } from "../models/requests/login-request.model";
import { ForgotPasswordRequestModel } from "../models/requests/forgot-password-request.model";
import { ResetPasswordRequestModel } from "../models/requests/reset-password-request.model";


export abstract class AuthAbstract {
abstract sendEmailVerification(data: SendEmailVerificationRequestModel): Observable<ApiResponseModel>;

abstract confirmEmailVerification(data: ConfirmEmailVerificationRequestModel): Observable<ApiResponseModel>;

abstract register(data: RegisterRequestModel): Observable<ApiResponseModel>;

abstract login(data: LoginRequestModel): Observable<ApiResponseModel>;

abstract forgotPassword(data: ForgotPasswordRequestModel): Observable<ApiResponseModel>;

abstract resetPassword(data: ResetPasswordRequestModel): Observable<ApiResponseModel>;
}