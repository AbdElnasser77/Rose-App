import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Image, LucideAngularModule } from 'lucide-angular';

/** Opens an image preview. Used by the product and category edit pages. */
@Component({
  selector: 'app-view-image-button',
  standalone: true,
  imports: [TranslatePipe, LucideAngularModule],
  templateUrl: './view-image-button.component.html',
})
export class ViewImageButtonComponent {
  readonly labelKey = input.required<string>();
  readonly clicked = output<void>();

  readonly Image = Image;
}
