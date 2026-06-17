import { inject, Injectable, signal } from '@angular/core';
import { SessionStorageService } from '@org/util-storage';

@Injectable({
  providedIn: 'root',
})
export class RegisterStore {
    private readonly _sessionStorageService= inject(SessionStorageService);

    readonly email = signal<string>('');
    readonly step = signal<number>(1);

    private readonly EMAIL_KEY = 'register_email';
    private readonly STEP_KEY = 'register_step';


    constructor() {
      this.initFromStorage();
    
  }

    

   
  private initFromStorage(): void {

    const email = this._sessionStorageService.getItem<string>(this.EMAIL_KEY);
    const step = this._sessionStorageService.getItem<number>(this.STEP_KEY);

    if (email) this.email.set(email);

    if (typeof step === 'number') this.step.set(step);
  } 

  setEmail(email:string):void{
      this.email.set(email);
       this._sessionStorageService.setItem(this.EMAIL_KEY, email);
  }

  

  setStep(step: number):void{
    this.step.set(step);
    this._sessionStorageService.setItem(this.STEP_KEY, step);
  }

  clear():void{
      this.email.set('');
      this.step.set(1);

      this._sessionStorageService.removeItem(this.EMAIL_KEY);
      this._sessionStorageService.removeItem(this.STEP_KEY);
  }



  
}
