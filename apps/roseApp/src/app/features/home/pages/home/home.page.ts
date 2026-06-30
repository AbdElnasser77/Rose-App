import { Component } from '@angular/core';
import { AboutUsComponent } from '../../../components/about-us/about-us.component';
@Component({
  selector: 'app-home',
  imports: [AboutUsComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {}
