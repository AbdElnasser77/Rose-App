import { Injectable } from '@angular/core';
import { MessagePayloadModel, MessageResponseModel } from '../models/response/message-response.model';

@Injectable({
  providedIn: 'root',
})
export class MessageAdaptor {
  adapt(response: MessageResponseModel): MessagePayloadModel {
  return {
    message: response.message,
  };
}
  
}
