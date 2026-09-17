export interface CreateCategoryRequest {
  title: string;
  description?: string;
  /**
   * Path returned by `UploadApiService.uploadImage`, e.g.
   * `/api/upload/temp/550e8400-e29b-41d4-a716-446655440000`. The API resolves
   * the temp path when the category is saved.
   */
  image: string;
}

export type UpdateCategoryRequest = Partial<CreateCategoryRequest>;
