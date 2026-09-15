import { Component } from '@angular/core';
import { ErrorStateComponent } from '../../components/error-state/error-state.component';

@Component({
  selector: 'app-unauthorized-page',
  imports: [ErrorStateComponent],
  templateUrl: './unauthorized.page.html',
})
export class UnauthorizedPage {}
