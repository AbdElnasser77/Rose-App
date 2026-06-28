import { Component } from '@angular/core';
import { FeaturesBarComponent } from '../../components/features-bar/features-bar.component';

@Component({
  selector: 'app-home',
  imports: [FeaturesBarComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {}
