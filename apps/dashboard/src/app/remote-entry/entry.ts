import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Root component used only when the dashboard is served standalone on :4201.
 * Through the shell, `remoteRoutes` is mounted directly and this is bypassed.
 */
@Component({
  imports: [RouterOutlet],
  selector: 'app-dashboard-entry',
  template: `<router-outlet />`,
})
export class RemoteEntry {}
