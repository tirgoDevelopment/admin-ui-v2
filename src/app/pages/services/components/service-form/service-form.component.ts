import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DriversService } from 'src/app/pages/drivers/services/drivers.service';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { ServicesService } from '../../services/services.service';
import { ServiceModel } from '../../models/service.model';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { Permission } from 'src/app/shared/enum/per.enum';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { LabelPipe } from 'src/app/shared/pipes/label.pipe';
import { PriceFormatPipe } from 'src/app/shared/pipes/priceFormat.pipe';
import { PhoneFormatPipe } from 'src/app/shared/pipes/phone-format.pipe';
import { DetailComponent } from 'src/app/pages/merchant/merchant-driver/components/detail/detail.component';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules, PipeModule, LabelPipe,PriceFormatPipe,PhoneFormatPipe],
})
export class ServiceFormComponent implements OnInit {
  Per = Permission;
  form: FormGroup;
  services: ServiceModel[] = [];
  selectedDriver
  drivers = []
  loading: boolean = false;
  constructor(
    private driverService: DriversService,
    private serviceApi: ServicesService,
    private drawerRef: NzDrawerRef,
    public perService: PermissionService,
    private translate: TranslateService,
    private  drawer: NzDrawerService
  ) { }
  ngOnInit(): void {
    this.initForm();
    this.getServices();
    this.onDriverChange();
  }

  findDriver(ev: string) {
    if (ev) {
      this.driverService.findDrivers(ev, this.form.value.searchAs).subscribe((res: any) => {
        if (res) {
          this.drivers = res.data.content;
        }
      })
    }
  }

  getServices() {
    this.serviceApi.getServiceList().subscribe((res: any) => {
      if (res.data && Array.isArray(res.data)) {
        const uniqueServices = Array.from(new Set(res.data.map((service: any) => service.name)))
          .map((name: any) => res.data.find((service: any) => service.name === name));

        this.services = uniqueServices;
      } else {
        this.services = [];
      }
    });
  }
  initForm() {
    this.form = new FormGroup({
      driverId: new FormControl(null, [Validators.required]),
      servicesIds: new FormControl([], [Validators.required]),
      searchAs: new FormControl('driverId'),
    });

  }
  onCancel() {
    this.drawerRef.close({ success: false });
  }
  onSubmit() {
    this.loading = true;
    this.form.patchValue({
      servicesIds: Array.isArray(this.form.value.servicesIds)
        ? this.form.value.servicesIds
        : [this.form.value.servicesIds]
    });
    this.serviceApi.postDriverServices(this.form.value).subscribe((res: any) => {
      if (res) {
        this.loading = false;
        this.drawerRef.close({ success: true });
      }
    }, err => {
      this.loading = false;
    });
  }
  onDriverChange() {
    this.form.get('driverId')?.valueChanges.subscribe(selectedValue => {
      this.selectedDriver = this.drivers.find(driver => driver.id == selectedValue);
    });
  }
  showTms(id) {
    if (id && this.perService.hasPermission(this.Per.TmsDetail)) {
      const drawerRef: any = this.drawer.create({
        nzTitle: this.translate.instant('information'),
        nzContent: DetailComponent,
        nzMaskClosable: false,
        nzPlacement: 'right',
        nzWidth: '400px',
        nzContentParams: {
          id: id,
        }
      });
    }

  }
}
