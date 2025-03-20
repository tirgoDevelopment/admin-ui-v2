import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { TransportBrandService } from './services/transport-brand.service';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { TransportBrandFormComponent } from './components/transport-brand-form/transport-brand-form.component';

@Component({
  selector: 'app-transport-brand',
  templateUrl: './transport-brand.component.html',
  styleUrls: ['./transport-brand.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules, NzModalModule, PipeModule, NzTableModule]
})
export class TransportBrandComponent implements OnInit {
  brandGroups: any[] = [];
  constructor(
    private transportBrandService: TransportBrandService,
    private drawer: NzDrawerService,
    private translate: TranslateService
  ) {

  }
  ngOnInit(): void {
    this.getBrandGroups();
  }
  getBrandGroups(): void {
    this.transportBrandService.getBrandGroups().subscribe((res: any) => {
      if (res && res.data) {
        this.brandGroups = res.data;
        this.brandGroups.forEach(group => {
          group.expand = false;
          group.brands.forEach(brand => {
            brand.expand = false;
          });
        });
      }
    });
  }

  collapse(group: any, event: any): void {
    group.expand = event;
  }
  add(data) {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant( data ? 'edit' : 'add'),
      nzContentParams: {
        data: data
      },
      nzContent: TransportBrandFormComponent,
      nzPlacement: 'right',
    });
    drawerRef.afterClose.subscribe((res: any) => {
      if (res && res.success) {
        this.getBrandGroups();
        drawerRef.componentInstance?.form.reset();
      }
    });
  }

}
