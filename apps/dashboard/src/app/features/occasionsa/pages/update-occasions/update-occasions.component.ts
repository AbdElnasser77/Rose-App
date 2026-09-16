import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DynamicFormComponent } from '../../../../shared/ui/dynamic-form/components/dynamic-form.component';
import { DynamicFormField } from '../../../../shared/ui/dynamic-form/models/dynamic-form-field.model';
import { ToastService } from '@org/shared-util-notification';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule, Image } from 'lucide-angular';
import { OccasionsService } from '../../services/occasions.service';

@Component({
  selector: 'app-update-occasions',
  imports: [DynamicFormComponent, TranslatePipe ,LucideAngularModule],
  templateUrl: './update-occasions.component.html'
})
export class UpdateOccasionsComponent implements OnInit  {
  private readonly _occasionsService = inject(OccasionsService);
  private readonly _toastService = inject(ToastService);
  private readonly _translateService = inject(TranslateService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  readonly Image = Image;
  readonly occasionId = this._route.snapshot.paramMap.get('id');
  readonly initialValues = signal<Record<string, unknown>>({});

  readonly occasionImage = signal<string | null>(null);

  ngOnInit(): void {
    const occasionId = this.occasionId;
    if (!occasionId) {
      return;
    }
    this.loadOccasions(occasionId);
  }

  readonly fields = computed<DynamicFormField[]>(() => [
    {
      name: 'title',
      label: 'DASHBOARD.OCCASIONS.ENTER_TITLE',
      type: 'text',
      placeholder: 'DASHBOARD.OCCASIONS.ENTER_TITLE',
      required: true,
    }
  ]);

  onOccasionUpdate(data: Record<string, unknown>): void {
    if (!this.occasionId) {
    return;
  }

  const occasionData: any = {
    title: data['title'] as string,
  };

  this._occasionsService
    .updateOccasions(this.occasionId, occasionData)
    .subscribe({
      next: () => {
        this._toastService.show(
        this._translateService.instant('DASHBOARD.OCCASIONS.UPDATE_SUCCESS'),
        'success'
        );
        this._router.navigate(['/dashboard/occasions']);
      }
      
    });
  }

  private loadOccasions(id: string): void {
    this._occasionsService.getOccasionsById(id).subscribe({
      next: (response) => {
        const occasion = response.payload.occasion;
        this.occasionImage.set(occasion.image);

        this.initialValues.set({
          title: occasion.title
        });
    },
    });
  }

}
