import { Component } from '@angular/core';
import { Breadcrumb } from './breadcrumb/breadcrumb';
import { RouterModule } from "@angular/router";
import { Sidebar } from './sidebar/sidebar';
import { LoaderContainerComponent } from '@org/ui';
import { AssetUrlPipe } from '../pipes/asset-url.pipe';

@Component({
  selector: 'app-root',
  imports: [Breadcrumb, RouterModule, Sidebar ,LoaderContainerComponent ,AssetUrlPipe],
  templateUrl: './root.html'
})
export class Root {}
