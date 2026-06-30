import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
export type BadgeVariant = 'primary' | 'secondary' | 'subtle';
@Component({
  selector: 'app-badge',
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
})
export class BadgeComponent {
  @Input() text: string = '';
  @Input() variant: BadgeVariant = 'primary';

  variantClasses: Record<BadgeVariant, string> = {
    primary: 'bg-[#DC2626] text-[#FFF1F5] hover:bg-[#741C21] hover:text-[#FFFFFF]',
    secondary: 'bg-[#FBEAEA] text-[#A6252A] hover:bg-[#F3C5C7] hover:text-[#FFFFFF]',
    subtle: 'bg-[#F4F4F5] text-[#3F3F46] hover:bg-[#E4E4E7] hover:text-[#A6252A]'
  };
}
