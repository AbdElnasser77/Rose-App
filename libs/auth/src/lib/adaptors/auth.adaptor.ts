import { Injectable } from '@angular/core';
import { AuthPayloadModel, AuthResponseModel } from '../models/responses/auth-response.model';
import { AdaptorModel } from '../models/adaptor.model';

@Injectable({
  providedIn: 'root',
})
export class AuthAdaptor 
implements AdaptorModel<AuthResponseModel,AuthPayloadModel>{
  adapt(data:AuthResponseModel):AuthPayloadModel{
    return{
      user: data.payload.user,
      token: data.payload.token
    }
  }
  
}
