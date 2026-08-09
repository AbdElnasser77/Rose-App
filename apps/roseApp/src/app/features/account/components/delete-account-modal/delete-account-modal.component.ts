import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonComponent } from '@org/ui';
import { DialogModule } from 'primeng/dialog';
import { LucideAngularModule, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-delete-account-modal',
  imports: [ButtonComponent, TranslatePipe, DialogModule, LucideAngularModule],
  templateUrl: './delete-account-modal.component.html',
  styleUrl: './delete-account-modal.component.scss',
})
export class DeleteAccountModalComponent {
  readonly visible = input<boolean>(false);

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  readonly Trash2 = Trash2;

  onVisibleChange(open: boolean): void {
    if (!open) {
      this.cancelled.emit();
    }
  }
}
