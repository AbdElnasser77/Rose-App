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
  @Input() size: 'full' | 'half' | 'auto' | 'icon' = 'full';
  @Input() variant: 'Primary' | 'Secondary' | 'Outline' | 'Subtle' | 'Ghost' | 'Destructive'| 'IconWhite' | 'IconRed' = 'Primary';
  @Input() iconOnly = false;
  @Output() clicked = new EventEmitter<MouseEvent>();

  onButtonClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }

}
