export interface WishlistItemModel {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product: WishlistProductModel;
}

export interface WishlistProductModel {
  id: string;
  title: string;
  description: string;
  rating: number;
  ratings: number;
  stock: number;
  price: string;
  discountType: string;
  discountValue: string;
  cover: string;
  gallery: string;
  categoryId: string;
  subCategoryId: string | null;
  immutable: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category: WishlistCategoryModel;
  subCategory: WishlistCategoryModel | null;
}

export interface WishlistCategoryModel {
  id: string;
  title: string;
}
