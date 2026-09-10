import { LucideIconData } from "lucide-angular";

export interface TableAction<T> {
  label: string;
  icon?: LucideIconData;
  action: (row: T) => void; // function that handles an action for the selected row
}