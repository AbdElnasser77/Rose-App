import { Component, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonComponent } from '@org/ui';
import { Headset, LucideAngularModule, RefreshCw, ShieldCheck, Truck } from 'lucide-angular';

@Component({
  selector: 'app-features-bar',
  imports: [ButtonComponent,LucideAngularModule,TranslatePipe],
  templateUrl: './features-bar.component.html',
  styleUrl: './features-bar.component.scss',
})
export class FeaturesBarComponent {

  
  features = [
    { icon: Truck, title: 'FEATURES.FREE_DELIVERY_TITLE', desc: 'FEATURES.FREE_DELIVERY_DESC' },
    { icon: RefreshCw, title: 'FEATURES.GET_REFUND_TITLE', desc: 'FEATURES.GET_REFUND_DESC' },
    { icon: ShieldCheck, title: 'FEATURES.SAFE_PAYMENT_TITLE', desc:'FEATURES.SAFE_PAYMENT_DESC' },
    { icon: Headset, title: 'FEATURES.SUPPORT_TITLE', desc: 'FEATURES.SUPPORT_DESC' }
  ];
}
