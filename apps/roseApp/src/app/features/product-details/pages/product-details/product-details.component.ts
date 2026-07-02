import { Component } from '@angular/core';
import { ProductDataComponent } from '../../components/product-data/product-data.component';

@Component({
  selector: 'app-product-details',
  imports: [ProductDataComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent {}