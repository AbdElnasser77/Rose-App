import { Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonComponent } from '@org/ui';
import { AssetUrlPipe } from 'apps/roseApp/src/app/core/pipes/asset-url.pipe';
import { BadgeComponent } from "apps/roseApp/src/app/shared/components/badge/badge.component";
import { LucideAngularModule, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-angular';
import { Carousel, CarouselModule } from 'primeng/carousel';


@Component({
  selector: 'app-hero',
  imports: [AssetUrlPipe, BadgeComponent,ButtonComponent,LucideAngularModule,CarouselModule,TranslatePipe],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  readonly  ArrowRight= ArrowRight;
   readonly ChevronLeft = ChevronLeft;
   readonly ChevronRight = ChevronRight; 

   currentPage = signal(0);
  slides = signal([
    {
      image: 'assets/images/banner/slide(1).png',
      title: 'HERO.SLIDES.FIRST.TITLE',
      subTitle: 'HERO.SLIDES.FIRST.SUBTITLE'
    },
    {
      image: 'assets/images/banner/slide(2).png', 
      title: 'HERO.SLIDES.SECOND.TITLE',
      subTitle: 'HERO.SLIDES.SECOND.SUBTITLE'
    }
  ]);

  
 
 
}
