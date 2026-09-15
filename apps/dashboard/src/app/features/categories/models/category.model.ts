export interface CategorySubCategory {
  id: string;
  title: string;
}

export interface CategoryModel {
  id: string;
  title: string;
  description: string;
  image: string;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
  subCategories: CategorySubCategory[];
  _count: CategoryCount;
}

export interface CategoryCount {
  products: number;
}
