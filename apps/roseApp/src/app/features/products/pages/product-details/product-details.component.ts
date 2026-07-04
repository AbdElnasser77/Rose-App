import { Component } from '@angular/core';
import { ProductDataComponent } from '../../components/product-details/product-data/product-data.component';
import { ReviewersComponent } from '../../components/product-details/reviews/reviews.component';
import { RelatedProductsSectionComponent } from '../../components/product-details/related-products-section/related-products-section.component';

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