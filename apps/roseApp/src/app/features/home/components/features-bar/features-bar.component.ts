import { Component } from '@angular/core';
import { ButtonComponent } from '@org/ui';
import { LucideAngularModule, Truck } from 'lucide-angular';

@Component({
  selector: 'app-features-bar',
  imports: [ButtonComponent,LucideAngularModule],
  templateUrl: './features-bar.component.html',
  styleUrl: './features-bar.component.scss',
})
export class FeaturesBarComponent {
  readonly Truck=Truck;
}
