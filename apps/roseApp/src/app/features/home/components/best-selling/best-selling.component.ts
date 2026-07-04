import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { RatingModule } from 'primeng/rating';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ArrowRight,ArrowLeft, ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';
import { ButtonComponent } from '@org/ui';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { Product } from '../../../../shared/models/product.model';
import {IntersectionObserverDirective } from '@org/util-directives';
import { ProductDataService } from '../../../products/services/product-details/product-data-api.service';
import { ToastService } from '@org/shared-util-notification';

@Component({
  selector: 'app-best-selling',
  imports: [
    CommonModule,
    CarouselModule,
    RatingModule,
    RouterModule,
    TranslatePipe,
    FormsModule,LucideAngularModule,ButtonComponent,ProductCardComponent ,IntersectionObserverDirective,CommonModule],
  templateUrl: './best-selling.component.html',
  styleUrl: './best-selling.component.scss',
})
export class BestSellingComponent implements OnInit {
  public _translateService = inject(TranslateService);
  private productService = inject(ProductDataService);
 private _router = inject(Router);
  private toastService = inject(ToastService);

  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly ArrowRight = ArrowRight;
  readonly ArrowLeft = ArrowLeft ;

  isBestSellingVisible = signal(false);
  products :Product[]=[];
  wishlistedIds = signal<Set<string>>(new Set());
   isRtl = computed(() => (this._translateService.currentLang()) === 'ar');

  responsiveOptions: any[] = [
    { breakpoint: '1535px', numVisible: 2, numScroll: 1 },
    { breakpoint: '767px', numVisible: 1, numScroll: 1 },
  ];
  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProduct().subscribe({
      next: (res) => {
        this.products = res.payload.data;
      }
    });
  }

  handleCardClicked(productId: string){
    this._router.navigate(['/products', productId]);
  }

  onWishlist(id: string): void {
    const current = new Set(this.wishlistedIds());
    if (current.has(id)) {
      current.delete(id);
      this.toastService.show('Product removed from wishlist', 'default');
    } else {
      current.add(id);
      this.toastService.show('Product added to wishlist', 'success');
    }
    this.wishlistedIds.set(current);
  }


onBestSellingVisible(entry: IntersectionObserverEntry) {
  if (entry.isIntersecting) {
    this.isBestSellingVisible.set(true);
  }
}
}
