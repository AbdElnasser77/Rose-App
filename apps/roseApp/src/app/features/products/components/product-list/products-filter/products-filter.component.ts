import {
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { RatingModule } from 'primeng/rating';
import { SkeletonModule } from 'primeng/skeleton';
import { LucideAngularModule, RotateCcw, X } from 'lucide-angular';
import { ButtonComponent } from '@org/ui';
import { ProductFilterService } from '../../../services/product-list/product-filter.service';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { CategoryFilterComponent } from '../filter/category-filter/category-filter.component';
import { OccasionFilterComponent } from '../filter/occasion-filter/occasion-filter.component';
import { RatingFilterComponent } from '../filter/rating-filter/rating-filter.component';
import { PriceFilterComponent } from '../filter/price-filter/price-filter.component';


@Component({
  selector: 'app-products-filter',
  imports: [
    FormsModule,
    RatingModule,
    SkeletonModule,
    LucideAngularModule,
    ButtonComponent,
    TranslatePipe,
    CommonModule,
    AccordionModule,CategoryFilterComponent,OccasionFilterComponent,
    RatingFilterComponent ,PriceFilterComponent
  ],
  templateUrl: './products-filter.component.html',
  styleUrl: './products-filter.component.scss',
})
export class ProductsFilterComponent  {
  protected readonly _productFilterService = inject(ProductFilterService);
  
  readonly isDrawer = input(false);
  readonly close = output<void>();

  // Icons
  readonly X = X;
  readonly RotateCcw = RotateCcw;
  
 
}
