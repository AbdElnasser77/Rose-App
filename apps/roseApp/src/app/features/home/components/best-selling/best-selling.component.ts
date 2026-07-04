import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductDataService } from '../../../products/services/product-details/product-data-api.service';
import { Product } from '../../../products/models/product.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-best-selling',
  imports: [
    CommonModule,
    CarouselModule,
    RatingModule,
    ButtonModule,
    RouterModule,
    TranslatePipe,
    FormsModule],
  templateUrl: './best-selling.component.html',
  styleUrl: './best-selling.component.scss',
})
export class BestSellingComponent implements OnInit {
   
  private productService = inject(ProductDataService);
  products: Product[] = [];

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 2
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '576px',
      numVisible: 1,
      numScroll: 1
    }
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

  getOldPrice(product: Product): number {

    const price = Number(product.price);
    const discount = Number(product.discountValue);
    if (!discount) {
      return price;
    }
    if (product.discountType === 'PERCENT') {
      return price / (1 - discount / 100);
    }
    return price + discount;
  }

  isNew(createdAt: string): boolean {
    const createdDate = new Date(createdAt);
    const today = new Date();
    const diffInMs = today.getTime() - createdDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return diffInDays <= 7;
  }
}
