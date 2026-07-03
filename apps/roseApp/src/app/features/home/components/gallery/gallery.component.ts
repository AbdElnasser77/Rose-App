import {
  Component,
  HostListener,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { AssetUrlPipe } from 'apps/roseApp/src/app/core/pipes/asset-url.pipe';
import {
  LucideAngularModule,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from 'lucide-angular';
import { SectionTitleComponent } from 'apps/roseApp/src/app/shared/components/section-title/section-title.component';

@Component({
  selector: 'app-gallery',
  imports: [AssetUrlPipe, LucideAngularModule, SectionTitleComponent, TranslatePipe],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent {
  readonly XIcon = X;
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;
  readonly ZoomInIcon = ZoomIn;

  readonly columns = signal([
    [
      { src: 'assets/images/gallery/gallery1.png', aspect: 'aspect-[3/4]' },
      { src: 'assets/images/gallery/gallery2.png', aspect: 'aspect-[4/3]' },
    ],
    [
      { src: 'assets/images/gallery/gallery3.png', aspect: 'aspect-[4/3]' },
      { src: 'assets/images/gallery/gallery4.png', aspect: 'aspect-[3/4]' },
    ],
    [
      { src: 'assets/images/gallery/gallery5.png', aspect: 'aspect-[4/3]' },
      { src: 'assets/images/gallery/gallery6.png', aspect: 'aspect-[3/4]' },
    ],
  ]);

  readonly images = computed(() => this.columns().flat());

  readonly lightboxIndex = signal<number | null>(null);
  readonly isZoomed = signal(false);

  private readonly document = inject(DOCUMENT);

  constructor() {
    // Lock background scroll while the lightbox is open.
    effect(() => {
      this.document.body.style.overflow =
        this.lightboxIndex() === null ? '' : 'hidden';
    });
  }

  openLightbox(index: number): void {
    this.isZoomed.set(false);
    this.lightboxIndex.set(index);
  }

  closeLightbox(): void {
    this.lightboxIndex.set(null);
    this.isZoomed.set(false);
  }

  next(): void {
    const current = this.lightboxIndex();
    if (current === null) return;
    this.isZoomed.set(false);
    this.lightboxIndex.set((current + 1) % this.images().length);
  }

  prev(): void {
    const current = this.lightboxIndex();
    if (current === null) return;
    this.isZoomed.set(false);
    const total = this.images().length;
    this.lightboxIndex.set((current - 1 + total) % total);
  }

  toggleZoom(): void {
    this.isZoomed.update((zoomed) => !zoomed);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.lightboxIndex() === null) return;
    switch (event.key) {
      case 'Escape':
        this.closeLightbox();
        break;
      case 'ArrowRight':
        this.next();
        break;
      case 'ArrowLeft':
        this.prev();
        break;
    }
  }
}
