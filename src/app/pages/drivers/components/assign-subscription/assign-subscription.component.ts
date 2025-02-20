import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { SubscriptionTypesService } from 'src/app/shared/services/references/subscription-types.service';
import { DriversService } from '../../services/drivers.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-assign-subscription',
  templateUrl: './assign-subscription.component.html',
  styleUrls: ['./assign-subscription.component.scss'],
  standalone: true,
  imports: [TranslateModule, NzModules, CommonModule,FormsModule,ReactiveFormsModule]
})
export class AssignSubscriptionComponent  implements OnInit{
  @Input() driverId: any;
  form: FormGroup;
  loading = false;
  subscriptions
  driver
  constructor(
    private translate: TranslateService,
    private subscriptionApi: SubscriptionTypesService,
    private driverApi: DriversService,
    private toastr: NotificationService,
    private drawerRef: NzDrawerRef
    ) { }
  ngOnInit(): void {
    this.getDriver();
    this.getSubscriptionTypes();
    this.initForm();
  }
  getDriver() {
    this.driverApi.getById(this.driverId).subscribe((res:any) => {
      if(res) {
        this.driver = res.data
        this.form.patchValue({
          isByDriverBalance: this.driver.tms ? false : true
        })
      }
    })
  }
  getSubscriptionTypes() {
    this.subscriptionApi.getAll().subscribe((res:any) => {
      if(res) {
        this.subscriptions = res.data
      }
    })
  }
  onSave() {
    this.loading = true;
    this.driverApi.assignSubscriptionDriver(this.form.value).subscribe((res:any) => {
      if(res) {
        this.toastr.success(this.translate.instant('successfullCreated'));
        this.loading = false;
        this.drawerRef.close({success: true})
      }
    }, err => {
      this.loading = false;
    })
  }
  initForm() {
    this.form = new FormGroup({
      driverId: new FormControl(this.driverId, [Validators.required]),
      subscriptionId: new FormControl(null, [Validators.required]),
      isByDriverBalance: new FormControl(false, [Validators.required])
    })
  }
}
