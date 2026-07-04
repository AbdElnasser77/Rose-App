import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { Product } from '../../../../../core/models/product.model';
import { ProductCardComponent } from '../../../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-products-grid',
  imports: [ProductCardComponent, SkeletonModule, TranslatePipe],
  templateUrl: './products-grid.component.html',
  styleUrl: './products-grid.component.scss',
})
export class ProductsGridComponent {
  products = input<Product[]>([]);
  loading = input<boolean>(false);

  cardDetails = output<string>();
  wishList = output<string>();
  quickView = output<string>();
  addToCart = output<string>();

  // Placeholder cells rendered while the products request is in flight.
  readonly skeletons = Array.from({ length: 8 });
}
