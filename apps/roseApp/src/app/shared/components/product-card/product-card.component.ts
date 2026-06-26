import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Eye, Heart, LucideAngularModule, ShoppingCart } from 'lucide-angular';
import { RatingModule } from 'primeng/rating';
import { Product } from '../../../core/models/product.model';
import { ButtonComponent } from '@org/ui';

@Component({
  selector: 'app-product-card',
  imports: [RatingModule, FormsModule,LucideAngularModule,CommonModule,ButtonComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
   readonly ShoppingCart=ShoppingCart;
   readonly  Heart= Heart;
   readonly Eye=Eye;

  @Output() cardDetailsClicked = new EventEmitter<string>();
  @Output() wishListClicked = new EventEmitter<string>();
  @Output() quickViewClicked = new EventEmitter<string>();
  @Output()  addToCartClicked= new EventEmitter<string>();
  
  get currentPrice(): number {
  const price = Number(this.product.price);

  if (this.product.discountType !== 'PERCENT') {
    return price;
  }

  return price - (price * Number(this.product.discountValue)) / 100;
}

  get oldPrice():number{
    return Number(this.product.price);
  }

 get badges(): ('NEW' | 'HOT' | 'OUT OF STOCK')[]{
  const badges: ('NEW' | 'HOT' | 'OUT OF STOCK')[] = [];

     
    const createdAt = new Date(this.product.createdAt);
     const sixMonthsAgo = new Date();
     sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
     
     if (createdAt >= sixMonthsAgo) {
       badges.push('NEW');
     }

    if (this.product.rating > 4.5) {
        badges.push('HOT');
     }

    if (this.product.stock === 0) {
        badges.push('OUT OF STOCK');
    }
    return badges;
  }

  get hasDiscount(): boolean {
  return Number(this.product.discountValue) > 0;
}
   
  
}
