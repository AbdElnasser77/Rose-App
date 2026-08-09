import { Component, input, output } from '@angular/core';

// Display-only counterpart to lib-reusable-input, matching its box metrics.
// Used for fields the profile endpoint does not accept (email, gender) - keeping
// them out of the form makes it impossible for them to reach the PATCH body.
// Pass actionLabel to surface an inline action beside the label (e.g. "Edit").
@Component({
  selector: 'app-readonly-field',
  imports: [],
  templateUrl: './readonly-field.component.html',
  styleUrl: './readonly-field.component.scss',
})
export class ReadonlyFieldComponent {
  readonly label = input.required<string>();
  readonly value = input<string>('');
  readonly actionLabel = input<string>('');

  readonly action = output<void>();
}
