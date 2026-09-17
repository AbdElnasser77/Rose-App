import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AssetUrlPipe } from '../../../../core/pipes/asset-url.pipe';

@Component({
  selector: 'app-error-state',
  imports: [TranslatePipe, AssetUrlPipe, RouterLink],
  templateUrl: './error-state.component.html',
})
export class ErrorStateComponent {
  readonly image = input.required<string>();
  readonly titleKey = input.required<string>();
  readonly messageKey = input.required<string>();

  readonly actionKey = input<string | null>(null);
  readonly actionLink = input<string | null>(null);
}
