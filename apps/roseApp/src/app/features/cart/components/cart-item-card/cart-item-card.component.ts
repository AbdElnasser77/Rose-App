import { Component, input, output } from '@angular/core';
import { CartItem } from '../../models/cart.model';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule, Star } from 'lucide-angular';

@Component({
  selector: 'app-cart-item-card',
  imports: [CommonModule,ButtonModule,InputTextModule,RatingModule,FormsModule,TranslatePipe
    ,DecimalPipe ,LucideAngularModule],
  templateUrl: './cart-item-card.component.html',
  styleUrl: './cart-item-card.component.scss',
})
export class CartItemCardComponent {
  readonly item = input.required<CartItem>();

  readonly increaseClicked = output<CartItem>();
  readonly decreaseClicked = output<CartItem>();
  readonly removeClicked = output<string>();
  readonly productClicked = output<string>();
  
  readonly Star =Star;
  onIncrease() {
    this.increaseClicked.emit(this.item());
  }

  onDecrease() {
    this.decreaseClicked.emit(this.item());
  }

  onRemove() {
    this.removeClicked.emit(this.item().id);
  }

  onProductClicked() {
    this.productClicked.emit(this.item().productId);
  }
}
