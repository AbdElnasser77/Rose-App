import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter } from 'rxjs';

export interface IBreadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink , TranslatePipe],
  templateUrl: './breadcrumb.html'
})
export class Breadcrumb {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  breadcrumbs = signal<IBreadcrumb[]>([]);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed()
    ).subscribe(() => {
      this.breadcrumbs.set(this.buildBreadcrumb(this.activatedRoute.root));
    });

    this.breadcrumbs.set(this.buildBreadcrumb(this.activatedRoute.root));
  }

  private buildBreadcrumb(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
    if (breadcrumbs.length === 0) {
      breadcrumbs.push({
        label: 'Dashboard',
        url: '/dashboard' 
      });
    }

    const children: ActivatedRoute[] = route.children;

    if (!children || children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const urlSegments = child.snapshot?.url;
      const routeURL: string = urlSegments ? urlSegments.map(segment => segment.path).join('/') : '';

      let nextUrl = url;
      if (routeURL !== '') {
        nextUrl += `/${routeURL}`;
      }

      const label = child.snapshot?.data?.['breadcrumb'];
      if (label && label !== 'Dashboard') {
        const exists = breadcrumbs.some(b => b.url === nextUrl && b.label === label);
        if (!exists) {
          breadcrumbs.push({ label, url: nextUrl });
        }
      }

      return this.buildBreadcrumb(child, nextUrl, breadcrumbs);
    }

    return breadcrumbs;
  }
}