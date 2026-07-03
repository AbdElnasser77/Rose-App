import { Component } from '@angular/core';
import { ProductDataComponent } from '../../components/product-data/product-data.component';
import { ReviewersComponent } from '../../components/reviews/reviews.component';
import { RelatedProductsSectionComponent } from '../../components/related-products-section/related-products-section.component';

@Component({
  selector: 'app-product-details',
  imports: [
    ProductDataComponent,
    ReviewersComponent,
    RelatedProductsSectionComponent,
  ],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent {}