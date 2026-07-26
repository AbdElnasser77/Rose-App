import { Component, EventEmitter, input, Output, output } from '@angular/core';
import { AssetUrlPipe } from '../../../../core/pipes/asset-url.pipe';
import { LucideAngularModule, Star ,Trash2 ,ShoppingCart  } from 'lucide-angular';
import { WishlistItemModel } from '../../models/wishlist-item.model';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { getCurrentPrice, hasDiscount } from '../../../../shared/utils/product-price';

@Component({
  selector: 'app-wishlist-card',
  imports: [LucideAngularModule, DecimalPipe ,TranslatePipe],
  templateUrl: './wishlist-card.component.html',
  styleUrl: './wishlist-card.component.scss',
})
export class WishlistCardComponent {
  @Output() cardDetailsClicked = new EventEmitter<string>();
  @Output() exploreSimilarClicked = new EventEmitter<string>();

  readonly getCurrentPrice = getCurrentPrice;
  readonly hasDiscount = hasDiscount;
  readonly item = input.required<WishlistItemModel>();
 
  readonly remove = output<string>();
  readonly addToCart = output<string>();
  
  readonly Star = Star;
  readonly Trash2 = Trash2 ;
  readonly ShoppingCart = ShoppingCart ;
  
  
  
  removeItem(): void{
    this.remove.emit(this.item().id);
  }

  addItemToCart():void{
    this.addToCart.emit(this.item().productId);
  }
}