import { Component } from '@angular/core';
import { ErrorStateComponent } from '../../components/error-state/error-state.component';

@Component({
  selector: 'app-server-error-page',
  imports: [ErrorStateComponent],
  templateUrl: './server-error.page.html',
})
export class ServerErrorPage {}
