import { Component, inject, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { DynamicTableComponent } from '../../../../shared/ui/dynamic-table/components/dynamic-table.component';
import { TableColumn } from '../../../../shared/ui/dynamic-table/models/table-column.model';
import { TableAction } from '../../../../shared/ui/dynamic-table/models/table-action.model';
import { LucideAngularModule, Pencil ,Trash ,Plus } from 'lucide-angular';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastService } from '@org/shared-util-notification';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '@org/ui';
import { OccasionsService } from '../../services/occasions.service';
import { OccasionsModel } from '../../models/occasions.model';
import { OccasionsQueryParams } from '../../models/occasions-query.model';
@Component({
  selector: 'app-occasions-page',
  standalone: true,
  imports: [DynamicTableComponent ,LucideAngularModule ,TranslatePipe ,ButtonComponent],
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

  queryParams: OccasionsQueryParams = {
  page: 1,
  limit: 10,
  };
  columns: TableColumn<OccasionsModel>[] = [
    {key: 'title',header: 'Name',}
    ];

  actions :TableAction<OccasionsModel>[] = [
  { label: 'Edit',icon :Pencil, action: (occasion) => this.editOccasions(occasion),},
  { label: 'Delete',icon:Trash, action: (occasion) => this.deleteOccasions(occasion),},
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

  deleteOccasions(occasions: OccasionsModel): void {
    this._occasionsService.deleteOccasions(occasions.id||"").subscribe({
    next: () => {
      this._toastService.show(
      this._translateService.instant('DASHBOARD.OCCASIONS.DELETE_SUCCESS'),
      'success'
    );
      this.loadOccasions();
    },
  });
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