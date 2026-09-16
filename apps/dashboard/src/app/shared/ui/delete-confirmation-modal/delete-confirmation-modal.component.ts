import {
  Component,
  input,
  output,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {  BrushCleaning, LucideAngularModule } from 'lucide-angular';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  imports: [LucideAngularModule, TranslatePipe, DialogModule],
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrl: './delete-confirmation-modal.component.scss',
})
export class DeleteConfirmationModalComponent {
  readonly isOpen = input(false);
  readonly title = input('DASHBOARD.DELETE_MODAL.TITLE');
  readonly message = input('DASHBOARD.DELETE_MODAL.MESSAGE');
  readonly closed = output<void>();
  readonly confirmed = output<void>();

    readonly BrushCleaning = BrushCleaning;


  close(): void {
    this.closed.emit();
  }

  confirm(): void {
    this.confirmed.emit();
  }

  onVisibleChange(visible: boolean): void {
    if (!visible) {
      this.close();
    }
  }
}
