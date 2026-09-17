import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * The shell every dashboard create/edit page sits in: heading, white card and
 * the fixed-height body the form fills. Overlays such as preview modals are
 * projected with the `pageOverlays` attribute so they land outside the card.
 */
@Component({
  selector: 'app-form-page-layout',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './form-page-layout.component.html',
})
export class FormPageLayoutComponent {
  readonly titleKey = input.required<string>();
  readonly titleParams = input<Record<string, unknown>>({});

  /** Appended after the translated title, for names the key cannot carry. */
  readonly titleSuffix = input('');
}
