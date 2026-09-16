import { CUSTOM_ELEMENTS_SCHEMA, Component, computed, inject, input, output, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SwiperDirective } from '@org/util-directives';
import { LucideAngularModule, ChevronLeft, ChevronRight, X } from 'lucide-angular';
import { SwiperOptions } from 'swiper/types';

@Component({
  selector: 'app-image-preview-modal',
  standalone: true,
  imports: [LucideAngularModule, SwiperDirective, TranslatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './image-preview-modal.component.html',
  styleUrl: './image-preview-modal.component.scss',
})
export class ImagePreviewModalComponent {
public _translateService = inject(TranslateService);

  readonly images = input<string[]>([]);
  readonly title = input('Image preview');
  readonly isOpen = input(false);
  readonly closed = output<void>();

  readonly activeIndex = signal(0);

  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly X = X;
  readonly isRtl = computed(() => this._translateService.currentLang() === 'ar');

 close(): void {
  this.closed.emit();
  }
  get swiperConfig(): SwiperOptions {
  const rtl = this.isRtl();

  return {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: false,
    watchSlidesProgress: true,
    navigation: {
      nextEl: rtl ? '.image-preview-prev' : '.image-preview-next',
      prevEl: rtl ? '.image-preview-next' : '.image-preview-prev',
    },
  };
}
  

  onSlideChange(event: Event): void {
    const detail = (event as CustomEvent<{ activeIndex?: number }[]>).detail;
    const swiper = detail?.[0];
    this.activeIndex.set(swiper?.activeIndex ?? 0);
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
