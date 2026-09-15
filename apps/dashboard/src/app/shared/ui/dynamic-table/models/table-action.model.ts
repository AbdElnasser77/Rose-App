import { LucideIconData } from "lucide-angular";

/**
 * Drives the action button's colour. Left optional so callers that pass plain
 * English labels keep the styling they had before this existed.
 */
export type TableActionVariant = 'edit' | 'delete' | 'default';

export interface TableAction<T> {
  label: string;
  icon?: LucideIconData;
  variant?: TableActionVariant;
  action: (row: T) => void; // function that handles an action for the selected row
}
