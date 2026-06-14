import { Observable } from "rxjs";
import { ConfirmEmailVerificationRequestModel } from "../models/requests/confirm-email-verification-request.model";
import { RegisterRequestModel } from "../models/requests/register-request.model";
import { LoginRequestModel } from "../models/requests/login-request.model";
import { ResetPasswordRequestModel } from "../models/requests/reset-password-request.model";
import { EmailRequestModel } from "../models/requests/email-request.model";
import { MessagePayloadModel, MessageResponseModel } from "../models/responses/message-response.model";
import { AuthPayloadModel } from "../models/responses/auth-response.model";


export abstract class AuthAbstract {
abstract sendEmailVerification(data: EmailRequestModel): Observable<MessagePayloadModel>;

abstract confirmEmailVerification(data: ConfirmEmailVerificationRequestModel): Observable<MessagePayloadModel>;

abstract register(data: RegisterRequestModel): Observable<AuthPayloadModel>;

abstract login(data: LoginRequestModel): Observable<AuthPayloadModel>;

abstract forgotPassword(data: EmailRequestModel): Observable<MessagePayloadModel>;

abstract resetPassword(data: ResetPasswordRequestModel): Observable<MessagePayloadModel>;
}