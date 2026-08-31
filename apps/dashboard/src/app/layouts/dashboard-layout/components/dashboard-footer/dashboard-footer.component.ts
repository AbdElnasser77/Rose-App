import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/** SKELETON — placeholder for the Layout ticket. */
@Component({
  selector: 'app-dashboard-footer',
  imports: [TranslatePipe],
  templateUrl: './dashboard-footer.component.html',
  styleUrl: './dashboard-footer.component.scss',
})
export class DashboardFooterComponent {
  readonly year = new Date().getFullYear();
}
