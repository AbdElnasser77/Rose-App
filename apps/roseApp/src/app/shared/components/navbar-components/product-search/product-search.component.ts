import { Component, computed, DestroyRef, ElementRef, HostListener, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Product } from '../../../models/product.model';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ProductSearchCardComponent } from '../product-search-card/product-search-card.component';
import { ProductsService } from '../../../../core/services/products.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideAngularModule, Search, X } from 'lucide-angular';

@Component({
  selector: 'app-product-search',
  imports: [ TranslatePipe ,ProductSearchCardComponent ,LucideAngularModule],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.scss',
})
export class ProductSearchComponent implements OnInit{
   @ViewChild('panelSearchInput')
   panelSearchInput!: ElementRef<HTMLInputElement>;

     private readonly router = inject(Router);
     private readonly _productsService = inject(ProductsService);
     private readonly destroyRef = inject(DestroyRef);

    readonly searchTerm = signal('');
    readonly isSearchOpen = signal(false);
    readonly allProducts = signal<Product[]>([]);
    
    readonly X = X;
    readonly Search = Search ;

    // Filter products based on the current search term
    readonly filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.allProducts();
    }
  
    return this.allProducts().filter(product =>
      product.title.toLowerCase().includes(term)
    );
    });

     // Close the search dropdown when clicking outside the search container
    @HostListener('document:click',['$event'])
    onDocumentClick(event :MouseEvent):void{
        const target = event.target as HTMLElement;
  
        if (!target.closest('.search-container')) {
         this.closeSearch();
        }
    }
   
    
   
    onSearch(event :Event) {
       const input = event.target as HTMLInputElement;
       this.searchTerm.set(input.value);
  
    }
  
    openSearch() {
    this.isSearchOpen.set(true);

    setTimeout(() => {
    this.panelSearchInput?.nativeElement.focus();
    });
    }
  
    closeSearch() {
    this.isSearchOpen.set(false);
    this.searchTerm.set('');
    }

     // Navigate to the selected product details
    openProductDetails(id: string) {
    this.router.navigate(['/products', id]);
    this.searchTerm.set('');
    this.closeSearch();
    }

     // Fetch products for search
    private loadProducts(): void {

       this._productsService.getProducts().pipe(takeUntilDestroyed(this.destroyRef))
       .subscribe({

        next: (res) => {
          this.allProducts.set(res.payload.data);
        }
      });
    }


    ngOnInit() {
      this.loadProducts();
    }
}
