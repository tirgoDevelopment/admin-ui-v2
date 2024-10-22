import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { MerchantClientService } from '../../services/merchant-client.service';
import { MerchantModel } from '../../models/merchant.model';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { DetailComponent } from '../detail/detail.component';
@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules, NzModalModule, PipeModule],
  providers: [NzModalService]
})

export class RequestsComponent implements OnInit {
  loading: boolean = false;
  data: MerchantModel[] = [];

  constructor(
    private modal: NzModalService,
    private merchantApi: MerchantClientService,
    private drawer: NzDrawerService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.getUnverified();
  }
  getUnverified() {
    this.loading = true;
    this.merchantApi.getUnverified().subscribe((res: any) => {
      if (res && res.success) {
        this.data = res.data.content;
        this.loading = false;
      }
    }
    )
  }
  open(item: MerchantModel) {
    const drawerRef = this.drawer.create({
      nzTitle: this.translate.instant('detail'),
      nzContent: DetailComponent,
      nzPlacement: 'right',
      nzWidth: '430px',
      nzContentParams: {
        data: item,
        mode: 'view'
      }
    });
    drawerRef.afterClose.subscribe((res: any) => {
      if (res?.success) {
        this.modal.closeAll();
      }
    });
    drawerRef.afterOpen.subscribe(() => {
      this.modal.closeAll();
    });
  }

}
