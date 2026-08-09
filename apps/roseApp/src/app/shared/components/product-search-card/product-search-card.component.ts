import { Component, computed, inject, input, output } from '@angular/core';
import { LucideAngularModule, Star } from 'lucide-angular';
import { Product } from '../../models/product.model';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { HighlightPipe } from '../../../core/pipes/highlight-pipe';

@Component({
  selector: 'app-product-search-card',
  imports: [LucideAngularModule,TranslatePipe, HighlightPipe],
  templateUrl: './product-search-card.component.html',
  styleUrl: './product-search-card.component.scss',
})
export class ProductSearchCardComponent {
  private readonly _translateService = inject(TranslateService);

  readonly Star = Star;

  readonly product = input.required<Product>();
  readonly searchTerm = input<string>('');
  productClicked = output<string>();

  onProductClick() {
  this.productClicked.emit(this.product().id);
  }

  readonly isRtl = computed(() => (this._translateService.currentLang()) === 'ar');

}
