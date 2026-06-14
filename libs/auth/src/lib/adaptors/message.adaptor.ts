import { Injectable } from '@angular/core';
import { AdaptorModel } from '../models/adaptor.model';
import { MessageResponseModel, MessagePayloadModel } from '../models/responses/message-response.model';

@Injectable({
  providedIn: 'root',
})
export class MessageAdaptor 
implements AdaptorModel<MessageResponseModel,MessagePayloadModel>{
  adapt(data:MessageResponseModel):MessagePayloadModel{
    return{
      message:data.message
    }
  }
  
}
