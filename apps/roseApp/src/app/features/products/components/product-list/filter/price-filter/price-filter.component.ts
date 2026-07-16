import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule, X } from 'lucide-angular';
import { ProductFilterService } from '../../../../services/product-list/product-filter.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-price-filter',
  imports: [LucideAngularModule,TranslatePipe,FormsModule],
  templateUrl: './price-filter.component.html',
  styleUrl: './price-filter.component.scss',
})
export class PriceFilterComponent {
    protected readonly _productFilterService = inject(ProductFilterService);
    readonly X = X;

  
}
