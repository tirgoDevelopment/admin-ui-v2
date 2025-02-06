import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { TransportsService } from '../../services/transports.service';
import { of } from 'rxjs';
import { DriversService } from 'src/app/pages/drivers/services/drivers.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-transport-manage',
  templateUrl: './transport-manage.component.html',
  styleUrls: ['./transport-manage.component.scss'],
  standalone: true,
  imports: [CommonModules, NzModules, TranslateModule]
})
export class TransportManageComponent implements OnInit {
  form
  type: string = 'assign' || 'unAssign';
  loading = false;
  transports$
  drivers$
  constructor(
    private transportService: TransportsService,
    private driverService: DriversService,
    private toastr: NotificationService,
    private translate: TranslateService,
    private drawerRef: NzDrawerRef
  ) { }
  ngOnInit(): void {
    this.form = new FormGroup({
      driverId: new FormControl(null, Validators.required),
      transportId: new FormControl(null, Validators.required),
    })
  }
  onTabChange(index) {
    index == 0 ? this.type = 'assign' : this.type = 'unAssign';
    // this.updateGsmCardValidation();
  }
  onSubmit() {
    this.loading = true;
    if (this.type == 'assign') {
      this.transportService.assignToDriver(this.form.value).subscribe(() => {
        this.drawerRef.close({ success: true });
        this.toastr.success(this.translate.instant('successfullUpdated'));
        this.loading = false;
      },err => {
        this.loading = false;
      });
    } else {
      this.transportService.unassignToDriver(this.form.value).subscribe(() => {
        this.drawerRef.close({ success: true });
        this.toastr.success(this.translate.instant('successfullUpdated'));
        this.loading = false;
      },err => {
        this.loading = false;
      });
    }
  }
  findTransport(searchTerm: string) {
    if (searchTerm) {
      this.transportService.findTransport(searchTerm).subscribe((response: any) => {
        this.transports$ = of(response.data.content);
      });
    }
  }
  findDriver(searchTerm: string) {
    if (searchTerm) {
      this.driverService.findDrivers(searchTerm, 'driverId').subscribe((response: any) => {
        this.drivers$ = of(response.data.content);
      });
    }
  }
}
