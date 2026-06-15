import { inject, Injectable, signal } from '@angular/core';
import { CookieStorageService } from '@org/util-storage';

@Injectable({
  providedIn: 'root',
})
export class RegisterStore {
    private readonly _cookieStorageService = inject(CookieStorageService);

    readonly email = signal<string>('');
    readonly isEmailVerified = signal<boolean>(false);
    readonly step = signal<number>(1);

    private readonly EMAIL_KEY = 'register_email';
    private readonly VERIFIED_KEY = 'register_verified';
    private readonly STEP_KEY = 'register_step';


    constructor() {
      this.initFromStorage();
    
  }

    

   
  private initFromStorage(): void {

    const email = this._cookieStorageService.getItem<string>(this.EMAIL_KEY);
    const verified = this._cookieStorageService.getItem<boolean>(this.VERIFIED_KEY);
    const step = this._cookieStorageService.getItem<number>(this.STEP_KEY);

    if (email) this.email.set(email);
    if (verified !== null && verified !== undefined) this.isEmailVerified.set(verified);

    if (step !== null && step !== undefined) this.step.set(step);
  } 

  setEmail(email:string):void{
      this.email.set(email);
       this._cookieStorageService.setItem(this.EMAIL_KEY, email);
  }

  setVerified(value:boolean):void{
      this.isEmailVerified.set(value);
      this._cookieStorageService.setItem(this.VERIFIED_KEY, value);
  }

  setStep(step: number):void{
    this.step.set(step);
    this._cookieStorageService.setItem(this.STEP_KEY, step);
  }

  clear():void{
      this.email.set('');
      this.isEmailVerified.set(false);
      this.step.set(1);

      this._cookieStorageService.removeItem(this.EMAIL_KEY);
      this._cookieStorageService.removeItem(this.VERIFIED_KEY);
      this._cookieStorageService.removeItem(this.STEP_KEY);
  }



  
}
