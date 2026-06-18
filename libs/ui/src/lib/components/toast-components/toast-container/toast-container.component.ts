import { Component, inject } from '@angular/core';
import { ToastService } from '@org/shared-util-notification';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'lib-toast-container',
  imports: [ToastComponent],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss',
})
export class ToastContainerComponent {
   readonly _toastService = inject(ToastService);
    toasts = this._toastService.toasts;
    dismissToast(id: number) {
  this._toastService.dismiss(id);
   }
}
