import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoaderService } from '@org/shared-util-loader';

@Component({
  selector: 'lib-loader-container',
  imports: [CommonModule, ProgressSpinnerModule],
  templateUrl: './loader-container.component.html',
  styleUrl: './loader-container.component.scss',
})
export class LoaderContainerComponent {
  readonly loader = inject(LoaderService);

  @Input() logoSrc = '';
}
