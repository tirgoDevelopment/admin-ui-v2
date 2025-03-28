import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { DriverMerchantModel } from '../../models/driver-merchant.model';
import { TmsService } from '../../services/tms.service';
import { DetailComponent } from '../detail/detail.component';
import { generateQueryFilter } from 'src/app/shared/pipes/queryFIlter';

@Component({
  selector: 'app-requests-driver',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules, NzModalModule, PipeModule],
  providers: [NzModalService]
})

export class RequestsComponent implements OnInit {
  loading: boolean = false;
  data: DriverMerchantModel[] = [];

  constructor(
    private modal: NzModalService,
    private tmsService: TmsService,
    private drawer: NzDrawerService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.getUnverified();
  }
  getUnverified() {
    this.loading = true;
    this.tmsService.getVerified(generateQueryFilter({ state: 'unverified' })).subscribe((res: any) => {
      if (res && res.success) {
        this.data = res.data.content;
        this.loading = false;
      }
    }
    )
  }
  open(id: string | number) {
    const drawerRef = this.drawer.create({
      nzTitle: this.translate.instant('detail'),
      nzContent: DetailComponent,
      nzPlacement: 'right',
      nzWidth: '430px',
      nzContentParams: {
        id: id,
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
