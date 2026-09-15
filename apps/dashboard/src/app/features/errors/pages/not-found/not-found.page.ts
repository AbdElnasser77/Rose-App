import { Component } from '@angular/core';
import { ErrorStateComponent } from '../../components/error-state/error-state.component';

@Component({
  selector: 'app-not-found-page',
  imports: [ErrorStateComponent],
  templateUrl: './not-found.page.html',
})
export class NotFoundPage {}
