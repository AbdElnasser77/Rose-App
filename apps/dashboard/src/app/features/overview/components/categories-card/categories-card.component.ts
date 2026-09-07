import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CategorySummary } from '../../models/category-summary.model';
import { OverviewCardComponent } from '../overview-card/overview-card.component';

@Component({
  selector: 'app-categories-card',
  imports: [TranslatePipe, OverviewCardComponent],
  templateUrl: './categories-card.component.html',
  styleUrl: './categories-card.component.scss',
})
export class CategoriesCardComponent {
  readonly categories = input.required<CategorySummary[]>();
  readonly loading = input(false);

  readonly skeletonRows = Array.from({ length: 6 });
}
