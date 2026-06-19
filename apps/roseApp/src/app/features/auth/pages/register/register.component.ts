import { Component, signal } from '@angular/core';
import { WelcomeMessageComponent, DividerComponent, ReusableInputComponent, ButtonComponent, CalloutTextComponent, SelectInputComponent } from '@org/ui';


@Component({
  selector: 'app-register',
  imports: [WelcomeMessageComponent, DividerComponent, ReusableInputComponent, ButtonComponent, CalloutTextComponent, SelectInputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
    isLoading:boolean=false;
    gender=[
      {label:'MALE',value :'male'},
      {label :'FEMALE',value:'female'}
    ]

}
