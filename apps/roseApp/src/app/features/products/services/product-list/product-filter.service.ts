import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../../../../shared/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductFilterService {
    // Stores the original list of products received from the API.
  readonly allProducts = signal<Product[]>([]);

  readonly selectedCategoryIds = signal<string[]>([]);
  readonly selectedOccasionIds = signal<string[]>([]);
  readonly rating = signal<number>(0);
  readonly priceFrom = signal<number | null>(null);
  readonly priceTo = signal<number | null>(null);


 
 // Computed state.

 readonly filteredProducts = computed(()=>{
  let products=this.allProducts();

  
  if(this.selectedCategoryIds().length > 0){ 
    products = products.filter(product =>
      this.selectedCategoryIds().includes(product.categoryId)
    );
  }
   
  if(this.selectedOccasionIds().length >0){  
    products = products.filter(product=>
      product.occasions.some(occasion=>
        this.selectedOccasionIds().includes(occasion.id)
      )
    );
  }

  
  if(this.rating()>0){   
    products = products.filter(product =>
      product.rating >=this.rating()
    );
  }

  
 if(this.priceFrom() !== null){  
  products = products.filter(product =>
    Number(product.price) >=this.priceFrom()!
  );

 }

 
if (this.priceTo() !== null) {  
  products = products.filter(product =>
    Number(product.price) <= this.priceTo()!
  );
}


  return products;
 });



 readonly hasActiveFilters = computed(() =>
  this.selectedCategoryIds().length > 0 ||
  this.selectedOccasionIds().length > 0 ||
  this.rating() > 0 ||
  this.priceFrom() !==null || 
  this.priceTo() !== null
 );

  readonly isPriceRangeValid = computed(() => {
    const from = this.priceFrom();
    const to = this.priceTo();

    return from === null || to === null || from <= to ;

  });



 // Update methods.

  setProducts(products: Product[]): void {
  this.allProducts.set(products);
 }

setRating(rating: number): void {
  this.rating.set(rating);
}

setPriceFrom(price:number | null):void{
  if(price === null){
    this.priceFrom.set(null);
    return;
  }
  this.priceFrom.set(Math.max(0,price));
 }

  setPriceTo(price: number | null): void {
  if (price === null) {
    this.priceTo.set(null);
    return;
  }

  this.priceTo.set(Math.max(0, price));
  }
  // Selection methods.

   toggleCategory(id:string):void{
  this.selectedCategoryIds.update(current=>{
    if(current.includes(id)){
      return current.filter(categoryId => categoryId !== id);
    }
    return [...current, id];
  })
 }
 toggleOccasion(id: string): void {
  this.selectedOccasionIds.update(current => {
    if (current.includes(id)) {
      return current.filter(occasionId => occasionId !== id);
    }

    return [...current, id];
  });
 }
 
   // Reset methods.

  resetCategory(): void {
   this.selectedCategoryIds.set([]);
  }

  resetOccasion(): void {
   this.selectedOccasionIds.set([]);
  }

  resetRating(): void {
   this.rating.set(0);
  }

  resetPrice(): void {
   this.priceFrom.set(null);
   this.priceTo.set(null);
  }

  resetAll(): void {
   this.resetCategory();
   this.resetOccasion();
   this.resetRating();
   this.resetPrice();
  }
 

}
