import { AfterViewInit, Directive, effect, ElementRef, inject, Input, PLATFORM_ID, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { SwiperOptions } from 'swiper/types';
@Directive({
  selector: '[libSwiperDirective]',
})
export class SwiperDirective implements AfterViewInit {
  @Input() config?: SwiperOptions;
  private _translateService = inject(TranslateService);
  private _el = inject(ElementRef);
  private _platformId = inject(PLATFORM_ID);

  private _isInitialized = signal(false);

  constructor() {
    effect(() => {
      const currentLang = this._translateService.currentLang();
      const rtl = currentLang === 'ar';
      
      if (this._isInitialized() && isPlatformBrowser(this._platformId) && this._el.nativeElement) {
        this._reinitSwiper(rtl);
      }
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this._platformId) && this._el.nativeElement) {
      const rtl = this._translateService.currentLang() === 'ar';
      this._buildSwiper(rtl);
      this._isInitialized.set(true); 
    }
  }

  private _buildSwiper(rtl: boolean): void {
    const swiperEl = this._el.nativeElement;

    swiperEl.setAttribute('dir', rtl ? 'rtl' : 'ltr');

    const finalConfig: SwiperOptions = {
      ...this.config
    };

    Object.assign(swiperEl, finalConfig, {
      dir: rtl ? 'rtl' : 'ltr'
    });

    swiperEl.initialize();
  }

  private _reinitSwiper(rtl: boolean): void {
    const swiperEl = this._el.nativeElement;

    if (swiperEl.swiper) {
      swiperEl.swiper.destroy(true, true);
      
      requestAnimationFrame(() => {
      this._buildSwiper(rtl);
    });
    }
  }
}
