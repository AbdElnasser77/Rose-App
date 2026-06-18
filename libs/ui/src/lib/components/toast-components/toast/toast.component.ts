import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Check, Info, LucideAngularModule, X } from 'lucide-angular';



@Component({
  selector: 'lib-toast',
  imports: [ CommonModule ,LucideAngularModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',

})
 export class ToastComponent {
  readonly X=X;
  readonly  Check= Check;
  readonly Info=Info;

    @Input() variant: 'Default' | 'Success' | 'Error' = 'Default';
    @Input() message = '';
    @Output() closed = new EventEmitter<void>();

    getIcon(){
      switch(this.variant){
        case 'Success':
          return Check;
        case 'Error':
          return X;
        default:
          return Info;

      }
    }
    onClose(): void {
    this.closed.emit();
  }

 }
