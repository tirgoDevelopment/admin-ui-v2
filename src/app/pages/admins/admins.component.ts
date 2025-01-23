import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AdminsService } from './services/admins.service';
import { AdminModel } from './models/admin.model';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AdminFormComponent } from './components/admin-form/admin-form.component';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { ResponseContent } from 'src/app/shared/models/res-content.model';
import { Permission } from 'src/app/shared/enum/per.enum';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { PlusOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, NzButtonModule, NzIconModule, NzTableModule, NzResultModule, NzPaginationModule, NzSpinModule, NzToolTipModule, NzSelectModule, NzAlertModule],
  providers: [NzModalService],
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit {
  Permission = Permission;

  confirmModal?: NzModalRef;
  data: AdminModel[] = [];
  loader: boolean = false;
  isFilterVisible: boolean = false
  filter = { id: '', loadingLocation: '', deliveryLocation: '', statusId: '' };
  showForm: boolean = false;
  pageParams = {
    pageIndex: 1,
    pageSize: 10,
    totalPagesCount: 1,
    sortBy: 'id',
    sortType: 'desc'
  };
  totalItemsCount = 0;
  constructor(
    private adminsService: AdminsService,
    private drawer: NzDrawerService,
    private translate: TranslateService,
    public permissionService: PermissionService,
    private iconService: NzIconService
  ) {
    this.iconService.addIcon(PlusOutline)
  }

  ngOnInit(): void {
    this.getAll();
  }
  getAll() {
    this.loader = true;
    this.adminsService.getAll(this.pageParams).subscribe((res: ResponseContent<AdminModel[]>) => {
      if (res && res.success) {
        this.data = res.data.content;
        this.pageParams.totalPagesCount = res.data.totalPagesCount;
        this.totalItemsCount = this.pageParams.pageSize * this.pageParams.totalPagesCount;
        this.loader = false;
      }
    }, err => {
      this.loader = false;
    })
  }
  add(): void {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant('add_admins'),
      nzContent: AdminFormComponent,
      nzPlacement: 'right',
    });
    drawerRef.afterClose.subscribe((res: any) => {
      if (res && res.success) {
        this.getAll();
      }
    });
  }
  update(item: AdminModel) {
    if (this.permissionService.hasPermission(Permission.AdminUpdate)) {
      const drawerRef: any = this.drawer.create({
        nzTitle: this.translate.instant('edit_admins'),
        nzContent: AdminFormComponent,
        nzPlacement: 'right',
        nzContentParams: { admin: item }
      });
      drawerRef.afterClose.subscribe((res: any) => {
        if (res && res.success) {
          this.getAll();
        }
      });
    }
  }
  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }

  public onQueryParamsChange(params: NzTableQueryParams): void {
    this.pageParams.pageIndex = params.pageIndex;
    this.pageParams.pageSize = params.pageSize;
    let { sort } = params;
    let currentSort = sort.find((item) => item.value !== null);
    let sortField = (currentSort && currentSort.key) || null;
    let sortOrder = (currentSort && currentSort.value) || null;
    sortOrder === 'ascend'
      ? (sortOrder = 'asc')
      : sortOrder === 'descend'
        ? (sortOrder = 'desc')
        : (sortOrder = '');
    this.pageParams.sortBy = sortField;
    this.pageParams.sortType = sortOrder;
    this.getAll();
  }
}
