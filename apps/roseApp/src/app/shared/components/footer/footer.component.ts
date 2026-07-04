import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { IntersectionObserverDirective } from '@org/util-directives';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, TranslatePipe, IntersectionObserverDirective],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  isFooterVisible = signal(false);

  onFooterVisible(entry: IntersectionObserverEntry): void {
    if (entry.isIntersecting) {
      this.isFooterVisible.set(true);
    }
  }
}
