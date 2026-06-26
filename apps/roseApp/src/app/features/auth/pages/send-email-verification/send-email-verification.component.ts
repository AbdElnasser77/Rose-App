import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFacade, AuthStore, RegisterStore } from '@org/auth';
import {ToastService}  from '@org/shared-util-notification';
import {WelcomeMessageComponent,DividerComponent,ReusableInputComponent,ButtonComponent,CalloutTextComponent} from '@org/ui';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-send-email-verification',
  imports: [ReactiveFormsModule, TranslatePipe, WelcomeMessageComponent,DividerComponent,ReusableInputComponent,ButtonComponent,CalloutTextComponent],
  templateUrl: './send-email-verification.component.html',
  styleUrl: './send-email-verification.component.scss',
})
export class SendEmailVerificationComponent implements OnInit {
     private _fb=inject(FormBuilder);
    private readonly  _router = inject(Router);
    private readonly _authFacade=inject(AuthFacade);
    private readonly _toastService=inject(ToastService);
    private readonly _authStore=inject(AuthStore);
    readonly loading = this._authStore.loading;
    private readonly _registerStore = inject(RegisterStore);
    private readonly _translate = inject(TranslateService);



  
  sendEmailVerificationForm :FormGroup=this._fb.group({
    email:['',[Validators.required,Validators.email,Validators.pattern(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      )]]
  });
  onSendEmailVerificationSubmit(){
   
    if(this.sendEmailVerificationForm.invalid){
      this.sendEmailVerificationForm.markAllAsTouched();
      return;
    }
    
    const emailValue=this.sendEmailVerificationForm.value.email;
    this._registerStore.setStep(1);
    this._registerStore.setEmail(emailValue);

    this._authFacade.sendEmailVerification({
       email:emailValue}).subscribe({
      next :(res)=>{
        this._toastService.show(this._translate.instant('AUTH.EMAIL_SENT'), 'success');
        this._registerStore.setStep(2);
        this._router.navigate(['auth/confirm-email-verification']);
      }
    })
  }

  ngOnInit() {
  const savedEmail = this._registerStore.email();

  if (savedEmail) {
    this.sendEmailVerificationForm.patchValue({
      email: savedEmail,
    });
  }
 }
 product=  {
      "id": "30cda572-ec57-49c1-b9f7-036e0793654c",
      "title": "Red Rose Bouquet",
      "description": "A dozen fresh red roses",
      "rating": 4.5,
      "ratings": 2,
      "stock": 0,
      "price": "1200",
      "discountType": "PERCENT",
      "discountValue": "10",
      "cover": "https://rose-app.elevate-bootcamp.cloud/storage/entities/product/product-d8cabc4c6e31-1776608971083.png",
      "gallery": "[]",
      "categoryId": "2e225dea-502e-449c-8502-fbf4ae6532e4",
      "subCategoryId": null,
      "immutable": false,
      "createdAt": "2026-04-19T14:29:31.281Z",
      "updatedAt": "2026-06-16T00:42:41.819Z",
      "category": {
        "id": "2e225dea-502e-449c-8502-fbf4ae6532e4",
        "title": "Flowers",
        "description": "Fresh flowers and bouquets",
        "image": "https://rose-app.elevate-bootcamp.cloud/api/upload/temp/d33eff4b-6b31-49ed-ab5b-ee16751e6df7",
        "immutable": false,
        "createdAt": "2026-04-01T13:38:54.502Z",
        "updatedAt": "2026-04-01T13:38:54.502Z"
      },
      "subCategory": null,
      "occasions": [],
      "reviews": [
        {
          "id": "4b911ba9-818c-4e97-a866-38e81e1197df",
          "userId": "78d12ef7-8340-4558-a8a6-0455625f82ed",
          "productId": "30cda572-ec57-49c1-b9f7-036e0793654c",
          "headline": "good",
          "content": "Nice Nice Nice Nice Nice Nice\n\n",
          "rating": 5,
          "createdAt": "2026-06-16T00:42:41.789Z",
          "updatedAt": "2026-06-16T00:42:41.789Z",
          "user": {
            "id": "78d12ef7-8340-4558-a8a6-0455625f82ed",
            "username": "Maged",
            "firstName": "Maged",
            "lastName": "Mohamed"
          }
        },
        {
          "id": "b00adba4-bf5f-4d74-9629-205a6df3e4c5",
          "userId": "a198d254-9f63-4e82-93de-56f084fe778e",
          "productId": "30cda572-ec57-49c1-b9f7-036e0793654c",
          "headline": "good",
          "content": "Nice",
          "rating": 4,
          "createdAt": "2026-04-20T13:03:45.462Z",
          "updatedAt": "2026-04-20T13:03:45.462Z",
          "user": {
            "id": "a198d254-9f63-4e82-93de-56f084fe778e",
            "username": "hady",
            "firstName": "hady",
            "lastName": "wahba"
          }
        }
      ],
      "_count": {
        "reviews": 2,
        "cartItems": 0,
        "wishlistItems": 1
      }
    }
  
}
