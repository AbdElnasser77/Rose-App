export interface TableSort<T> {
  key: keyof T;
  direction: 'asc' | 'desc';
}