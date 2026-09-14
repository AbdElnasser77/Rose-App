export type DiscountType = 'PERCENT' | 'FIXED';

export interface ProductModel {
  id: string;
  title: string;
  description: string;
  rating: number;
  ratings: number;
  stock: number;
  price: string;
  discountType: DiscountType | null;
  discountValue: string | null;
  cover: string | null;
  gallery: string;
  categoryId: string;
  subCategoryId: string | null;
  immutable: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category: Category;
  subCategory: SubCategory | null;
  occasions: ProductOccasion[];
  _count: ProductCount;
}


export interface Category {
  id: string;
  title: string;
}

export interface SubCategory {
  id: string;
  title: string;
}

export interface ProductOccasion {
  id: string;
  productId: string;
  occasionId: string;
  createdAt: string;
  occasion: Occasion;
}

export interface Occasion {
  id: string;
  title: string;
  description: string;
  image: string;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCount {
  reviews: number;
  cartItems: number;
  wishlistItems: number;
  orderItems: number;
}
