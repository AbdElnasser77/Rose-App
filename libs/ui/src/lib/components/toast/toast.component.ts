import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
// import { ToastService } from '@org/shared-util-notification';


@Component({
  selector: 'lib-toast',
  imports: [ CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',

})
 export class ToastComponent {

    @Input() variant: 'Default' | 'Success' | 'Error' = 'Default';
    @Input() message = '';
//       private toastService = inject(ToastService);

//   showSuccess() {
//     this.toastService.show('Operation completed successfully', 'success');
//   }

//   showError() {
//     this.toastService.show('Something went wrong', 'error');
//   }

//   showInfo() {
//     this.toastService.show('Message Content', 'info');
//   }
 }
