import { ToastType } from "../types/toast.type";

export interface ToastModel {
   
  id: number;
  message: string;
  type: ToastType;
  duration?: number; 
}

