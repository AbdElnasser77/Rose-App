import { Component } from '@angular/core';
import { ButtonComponent } from '@org/ui';
import { Headset, LucideAngularModule, RefreshCw, ShieldCheck, Truck } from 'lucide-angular';

@Component({
  selector: 'app-features-bar',
  imports: [ButtonComponent,LucideAngularModule],
  templateUrl: './features-bar.component.html',
  styleUrl: './features-bar.component.scss',
})
export class FeaturesBarComponent {
  
  features = [
    { icon: Truck, title: 'Free Delivery', desc: 'For orders above 120 EGP' },
    { icon: RefreshCw, title: 'Get Refund', desc: 'Refunds within 30 days' },
    { icon: ShieldCheck, title: 'Safe Payment', desc: '100% Secure Payment' },
    { icon: Headset, title: '24/7 Support', desc: 'Contact us at any time' }
  ];
}
