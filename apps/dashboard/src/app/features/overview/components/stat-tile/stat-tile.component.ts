import { Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

export type StatTileTone = 'rose' | 'blue' | 'purple' | 'green';

interface ToneClasses {
  surface: string;
  icon: string;
  value: string;
}

const TONE_CLASSES: Record<StatTileTone, ToneClasses> = {
  rose: {
    surface: 'bg-soft-pink-50 dark:bg-maroon-950/40',
    icon: 'text-maroon-600 dark:text-soft-pink-300',
    value: 'text-maroon-700 dark:text-soft-pink-200',
  },
  blue: {
    surface: 'bg-blue-50 dark:bg-blue-950/40',
    icon: 'text-blue-600 dark:text-blue-300',
    value: 'text-blue-700 dark:text-blue-200',
  },
  purple: {
    surface: 'bg-purple-50 dark:bg-purple-950/40',
    icon: 'text-purple-600 dark:text-purple-300',
    value: 'text-purple-700 dark:text-purple-200',
  },
  green: {
    surface: 'bg-emerald-50 dark:bg-emerald-950/40',
    icon: 'text-emerald-600 dark:text-emerald-300',
    value: 'text-emerald-700 dark:text-emerald-200',
  },
};

@Component({
  selector: 'app-stat-tile',
  imports: [DecimalPipe, TranslatePipe, LucideAngularModule],
  templateUrl: './stat-tile.component.html',
  styleUrl: './stat-tile.component.scss',
})
export class StatTileComponent {
  readonly labelKey = input.required<string>();
  readonly value = input.required<number>();
  readonly icon = input.required<LucideIconData>();
  readonly tone = input.required<StatTileTone>();
  /** Rendered after the value, e.g. a currency code. */
  readonly suffix = input<string | null>(null);
  readonly loading = input(false);

  private readonly classes = computed(() => TONE_CLASSES[this.tone()]);

  readonly surfaceClass = computed(() => this.classes().surface);
  readonly iconClass = computed(() => this.classes().icon);
  readonly valueClass = computed(() => this.classes().value);
}
