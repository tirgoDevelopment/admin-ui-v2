import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { ClientModel } from './models/client.model';
import { ClientsService } from './services/clients.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { NgxMaskDirective } from 'ngx-mask';
import { ClientsFormComponent } from './components/clients-form/clients-form.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  standalone: true,
  imports: [CommonModules, NzModules, TranslateModule, IconsProviderModule,NgxMaskDirective],
  providers: [NzModalService],
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

export class ClientsComponent implements OnInit {

  confirmModal?: NzModalRef;
  data: any[];
  loader: boolean = false;
  isFilterVisible: boolean = false
  filter = {name:"", id:"", phoneNumber: "",createdAtTo:"",createdAtFrom:"",lastLoginFrom:"",lastLoginTo:""};
  pageParams = {
    pageIndex: 1,
    pageSize: 10,
    totalPagesCount: 1,
    sortBy: 'id',
    sortType: 'desc'
  };

  constructor(
    private toastr: NotificationService,
    private modal: NzModalService,
    private clientsService: ClientsService,
    private drawer: NzDrawerService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.getAll();
  }
  getAll() {
    this.loader = true;
    this.clientsService.getAll(this.pageParams).pipe(
      tap((res: any) => {
        if (res && res.success) {
          this.data = res.data;
        }
      }),
      catchError(err => {
        return of(null);
      }),
      tap(() => {
        this.loader = false;
      })
    ).subscribe();
  }

  add(): void {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant('add'),
      nzContent: ClientsFormComponent,
      nzPlacement: 'right',
    });
    drawerRef.afterClose.subscribe((res:any) => {
      if(res && res.success){
        this.getAll();
        drawerRef.componentInstance?.form.reset();
      }
    });
  }
  update(item: ClientModel) {
    // const drawerRef: any = this.drawer.create({
    //   nzTitle: this.translate.instant('edit_admins'),
    //   nzContent: ClientsFormComponent,
    //   nzPlacement: 'right',
    //   nzContentParams: { data: item }
    // });
    // drawerRef.afterClose.subscribe((res:any) => {
    //   if(res && res.success){
    //     this.getAll();
    //     drawerRef.componentInstance?.form.reset();
    //   }
    // });
  }
  remove(id: number | string) {
    this.confirmModal = this.modal.confirm({
      nzTitle: this.translate.instant('are_you_sure'),
      nzContent: this.translate.instant('delete_sure'),
      nzOkText: this.translate.instant('remove'),
      nzCancelText: this.translate.instant('cancel'),
      nzOkDanger: true,
      nzOnOk: () =>
        this.clientsService.delete(id).subscribe((res: any) => {
          if (res && res.success) {
            this.toastr.success(this.translate.instant('successfullDeleted'), '');
            this.getAll();
          }
        }),
    });
  }
  onPageIndexChange(pageIndex: number): void {
    this.pageParams.pageIndex = pageIndex;
    this.getAll();
  }
  onPageSizeChange(pageSize: number): void {
    this.pageParams.pageSize = pageSize;
    this.pageParams.pageIndex = 1;
    this.getAll();
  }
  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }
  resetFilter() {
    this.filter = {name:"", id:"", phoneNumber: "",createdAtTo:"",createdAtFrom:"",lastLoginFrom:"",lastLoginTo:""};
  }
}
