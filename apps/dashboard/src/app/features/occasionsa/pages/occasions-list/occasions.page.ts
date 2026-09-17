import { Component, inject, OnInit, signal } from '@angular/core';
import { DynamicTableComponent } from '../../../../shared/ui/dynamic-table/components/dynamic-table.component';
import { TableColumn } from '../../../../shared/ui/dynamic-table/models/table-column.model';
import { TableAction } from '../../../../shared/ui/dynamic-table/models/table-action.model';
import { LucideAngularModule, Pencil ,Trash ,Plus } from 'lucide-angular';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastService } from '@org/shared-util-notification';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '@org/ui';
import { DeleteConfirmationModalComponent } from '../../../../shared/ui/delete-confirmation-modal/delete-confirmation-modal.component';
import { OccasionsService } from '../../services/occasions.service';
import { OccasionsModel } from '../../models/occasions.model';
import { OccasionsQueryParams } from '../../models/occasions-query.model';
@Component({
  selector: 'app-occasions-page',
  standalone: true,
  imports: [DynamicTableComponent ,LucideAngularModule ,TranslatePipe ,ButtonComponent, DeleteConfirmationModalComponent],
  templateUrl: './occasions.page.html',
  styleUrl: './occasions.page.scss',
})
export class OccasionsPage implements OnInit {  
  private readonly _occasionsService = inject(OccasionsService);
  private readonly _toastService = inject(ToastService);
  private readonly _translateService = inject(TranslateService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);

  readonly Plus  = Plus ;
  occasions = signal<OccasionsModel[]>([]);
  page = signal(1);
  totalPages = signal(1);
  readonly occasionToDelete = signal<OccasionsModel | null>(null);

  queryParams: OccasionsQueryParams = {
  page: 1,
  limit: 10,
  };
  columns: TableColumn<OccasionsModel>[] = [
    {key: 'title',header: 'DASHBOARD.OCCASIONS.TABLE.NAME',},
    {key: 'title',header: 'DASHBOARD.OCCASIONS.TABLE.PRODUCTS',getValue: () => 10,},
    ];

  actions :TableAction<OccasionsModel>[] = [
  { label: 'DASHBOARD.OCCASIONS.ACTIONS.EDIT',icon :Pencil, action: (occasion) => this.editOccasions(occasion),},
  { label: 'DASHBOARD.OCCASIONS.ACTIONS.DELETE',icon:Trash, action: (occasion) => this.deleteOccasions(occasion),},
  ];

  ngOnInit(): void {
  this.loadOccasions();
  }

  loadOccasions(): void {
  this._occasionsService.getOccasions(this.queryParams).subscribe({
    next: (response) => {
      this.occasions.set(response.payload.data) ;
      this.totalPages.set(response.payload.metadata.totalPages);
    },
  });
  }

  onPageChange(page: number): void {
  this.page.set(page);
   this.queryParams = {
    ...this.queryParams,
    page,
  };
  this.loadOccasions();
  }

  editOccasions(occasion: OccasionsModel): void {
    this._router.navigate(
    [occasion.id, 'edit'],
    { relativeTo: this._route }
  );
  }

  deleteOccasions(occasion: OccasionsModel): void {
    this.occasionToDelete.set(occasion);
  }

  confirmDelete(): void {
    const occasion = this.occasionToDelete();

    if (!occasion) {
      return;
    }

    this._occasionsService.deleteOccasions(occasion.id || '').subscribe({
    next: () => {
      this._toastService.show(
      this._translateService.instant('DASHBOARD.OCCASIONS.DELETE_SUCCESS'),
      'success'
    );
      this.loadOccasions();
      this.occasionToDelete.set(null);
    },
  });
  }

  closeDeleteModal(): void {
    this.occasionToDelete.set(null);
  }

  onSearch(search: string): void {
  this.queryParams = {
    ...this.queryParams,
    search,
    page: 1,
  };

  this.loadOccasions();
   }

   onAddClicked(){
    this._router.navigate(
    [ 'add'],
    { relativeTo: this._route }
  );
   }
}