import { Injectable, signal } from '@angular/core';
import { ToastModel } from '../models/toast.model';
import { ToastType } from '../types/toast.type';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSignal = signal<ToastModel[]>([]);
  public toasts = this.toastsSignal.asReadonly();

  show(message: string, type: ToastType = 'info', duration = 3000): void {
    const id = Date.now() + Math.random(); 
    const newToast: ToastModel = { id, message, type, duration };

    this.toastsSignal.update((currentToasts) => [...currentToasts, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
  }

  dismiss(id: number): void {
    this.toastsSignal.update((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }
}
