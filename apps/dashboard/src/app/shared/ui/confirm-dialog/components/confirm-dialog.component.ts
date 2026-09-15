import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonComponent } from '@org/ui';
import { DialogModule } from 'primeng/dialog';
import { LucideAngularModule, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [ButtonComponent, TranslatePipe, DialogModule, LucideAngularModule],
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  readonly visible = input<boolean>(false);
  readonly titleKey = input.required<string>();
  readonly messageKey = input.required<string>();
  readonly messageParams = input<Record<string, unknown>>({});
  readonly confirmKey = input('DASHBOARD.COMMON.DELETE');
  readonly cancelKey = input('DASHBOARD.COMMON.CANCEL');
  readonly loading = input(false);

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  readonly Trash2 = Trash2;

  onVisibleChange(open: boolean): void {
    if (!open) {
      this.cancelled.emit();
    }
  }
}
