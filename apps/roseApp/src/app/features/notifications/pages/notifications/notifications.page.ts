import { Component, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, MoveLeft } from 'lucide-angular';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NotificationListComponent } from '../../components/notification-list/notification-list.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [NotificationListComponent, LucideAngularModule],
  templateUrl: './notifications.page.html',
  styleUrl: './notifications.page.scss'
})
export class NotificationsPage {
  private readonly _router = inject(Router);
  private readonly _breakpointObserver = inject(BreakpointObserver);
  private readonly _destroyRef = inject(DestroyRef);

  readonly MoveLeft = MoveLeft;

   constructor() {
    this._breakpointObserver
      .observe('(min-width: 768px)')
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(({ matches }) => {
        if (matches) {
          this._router.navigateByUrl('/home');
        }
      });
  }

  back(): void {
    this._router.navigate(['/home']);
  }
}
