import { Component } from '@angular/core';
import { Breadcrumb } from './breadcrumb/breadcrumb';
import { RouterModule } from "@angular/router";
import { Sidebar } from './sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [Breadcrumb, RouterModule, Sidebar],
  templateUrl: './root.html'
})
export class Root {}
