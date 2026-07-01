import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule, LoaderCircle } from 'lucide-angular';

@Component({
  selector: 'lib-button',
  imports: [CommonModule,LucideAngularModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  readonly LoaderCircle=LoaderCircle;

  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() size: 'full' | 'half' | 'auto' | 'icon' | 'icon-sm'  | 'icon-lg' = 'full';
  @Input() variant: 'Primary' | 'Secondary' | 'Outline' | 'Subtle' | 'Ghost' | 'Destructive'| 'IconWhite' | 'IconRed' = 'Primary';
  @Input() shape: 'square' | 'circle' = 'square';
  @Input() customClass = 'px-4 py-2.5 gap-2.5 text-[16px]';
  @Output() clicked = new EventEmitter<MouseEvent>();

  onButtonClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }

  get isIconButton():boolean{
      return ['icon', 'icon-sm', 'icon-lg'].includes(this.size)
  }

}
