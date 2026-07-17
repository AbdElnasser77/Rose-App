import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../../../../shared/models/product.model';
import {getCurrentPrice } from '../../../../shared/utils/product-price';

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
  readonly priceFromError = signal<string | null>(null);
  readonly priceToError = signal<string | null>(null);


 
 // Computed state.

 readonly filteredProducts = computed(()=>{
  let products=this.allProducts();

  const selectedCategories = this.selectedCategoryIds();
  const selectedOccasions = this.selectedOccasionIds();
  const rating = this.rating();
  const from = this.priceFrom();
  const to = this.priceTo();

  if(selectedCategories.length > 0){ 
    products = products.filter(product =>
      selectedCategories.includes(product.categoryId)
    );
  }
   
  if(selectedOccasions.length >0){  
    products = products.filter(product=>
      product.occasions.some(occasion=>
        selectedOccasions.includes(occasion.id)
      )
    );
  }

  
  if( rating>0){   
    products = products.filter(product =>
      product.rating >= rating
    );
  }
 
  

   if (from !== null || to !== null) {
  products = products.filter(product => {
    const price = getCurrentPrice(product);

    if (from !== null && price < from) {
      return false;
    }

    if (to !== null && price > to) {
      return false;
    }

    return true;
  });
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
    this.priceFromError.set(null);
    return;
  }
  if (price < 0) {
    this.priceFromError.set('Price cannot be negative.');
    return;
  }
  this.priceFromError.set(null);
  this.priceFrom.set(price);
 }

  setPriceTo(price: number | null): void {
  if (price === null) {
    this.priceTo.set(null);
    this.priceToError.set(null);
    return;
  }
  if (price < 0) {
    this.priceToError.set('Price cannot be negative.');
    return;
  }

  this.priceToError.set(null);
  this.priceTo.set(price);
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
