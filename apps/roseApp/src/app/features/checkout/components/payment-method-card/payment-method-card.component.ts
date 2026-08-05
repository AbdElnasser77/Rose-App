import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { PaymentMethodModel } from '../../models/payment-method.model';
import { AssetUrlPipe } from '../../../../core/pipes/asset-url.pipe';

@Component({
  selector: 'app-payment-method-card',
  imports: [CommonModule ,AssetUrlPipe],
  templateUrl: './payment-method-card.component.html',
  styleUrl: './payment-method-card.component.scss',
})
export class PaymentMethodCardComponent {
  paymentMethod = input.required< PaymentMethodModel>();
 paymentSelected= input<boolean>(false);
 disabled = input<boolean>(false);

  selectedChange = output<string>();

   onSelect(){

   this.selectedChange.emit(
     this.paymentMethod().id
   );

   }


}
