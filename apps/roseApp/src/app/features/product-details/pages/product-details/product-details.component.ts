import { Component } from '@angular/core';
import { ProductDataComponent } from '../../components/product-data/product-data.component';
import { ReviewersComponent } from '../../components/reviews/reviews.component';

@Component({
  selector: 'app-product-details',
  imports: [ProductDataComponent, ReviewersComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent {}