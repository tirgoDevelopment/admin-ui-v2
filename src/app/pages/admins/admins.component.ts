import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AdminsService } from './services/admins.service';
import { Response } from 'src/app/shared/models/reponse';
import { AdminModel } from './models/admin.model';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AdminFormComponent } from './components/admin-form/admin-form.component';
import { NzDrawerService } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [CommonModule, NzModules, TranslateModule, FormsModule],
  providers: [NzModalService],
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  animations: [
    trigger('showHideFilter', [
      state('show', style({
        height: '*',
        opacity: 1,
        visibility: 'visible'
      })),
      state('hide', style({
        height: '0',
        opacity: 0,
        visibility: 'hidden'
      })),
      transition('show <=> hide', animate('300ms ease-in-out'))
    ])
  ]
})
export class AdminsComponent implements OnInit {
  data: AdminModel[];
  loader: boolean = false;
  showForm: boolean = false;
  isFilterVisible:boolean = false
  filter = {
    id: '',
    loadingLocation: '',
    deliveryLocation: '',
    statusId: ''
  };

  pageParams = {
    pageIndex: 1,
    pageSize: 10,
    totalPagesCount: 1,
    sortBy: 'id',
    sortType: 'desc'
  };

  constructor(
    private adminsService: AdminsService,
    private drawer: NzDrawerService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.loader = true;
    this.adminsService.getAll(this.pageParams).subscribe((res: Response<AdminModel[]>) => {
      if (res && res.success) {
        this.data = res.data.content;
        this.loader = false;
      }
    }, err => {
      this.loader = false;
    })
  }

  add(): void {
    const translatedTitle = this.translate.instant('add_admins');
    this.drawer.create({
      nzTitle: translatedTitle,
      nzContent: AdminFormComponent,
      nzPlacement: 'right',
    });
  }
  closeForm(): void {
    this.showForm = false;
  }

  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
    // Implement filter toggle functionality here if needed
  }

  resetInput(field: string): void {
    // Implement input reset logic based on field here
  }
}
