import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { DriversService } from 'src/app/pages/drivers/services/drivers.service';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { GSMService } from '../../services/gsm.service';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { LabelPipe } from 'src/app/shared/pipes/label.pipe';

@Component({
  selector: 'app-assign-driver-card',
  templateUrl: './assign-driver-card.component.html',
  styleUrls: ['./assign-driver-card.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules, PipeModule, LabelPipe],
})

export class AssignDriverCardComponent implements OnInit {
  form: FormGroup;
  drivers$
  loading: boolean = false;
  type = 'assign'
  constructor(
    private driverService: DriversService,
    private gsmService: GSMService,
    private drawerRef: NzDrawerRef,
    private toastr: NotificationService,
    private translate: TranslateService
  ) {}
  ngOnInit(): void {
    this.initForm();
  }

  findDriver(searchTerm: string) {
    this.driverService.findDrivers(searchTerm, this.form.value.searchAs).subscribe((response:any) => {
      this.drivers$ = of(response.data.content);
    });
  }
  initForm() {
    this.form = new FormGroup({
      id: new FormControl(null, [Validators.required]),
      searchAs: new FormControl('driverId'),
      gsmCardNumber: new FormControl(null, this.type == 'assign' ? Validators.required : null)
    })
    this.updateGsmCardValidation();

  }
  onSubmit() {
    this.loading = true;
  
    if (this.type === 'assign') {
      this.gsmService.postGSMCardNumber(this.form.value).subscribe(
        (res: any) => {
          if (res && res.success) {
            this.loading = false;
            this.drawerRef.close({ success: true });
            this.toastr.success(this.translate.instant('successfullUpdated'));
          }
        },
        (err) => {
          this.loading = false;
        }
      );
    } else if (this.type === 'unAssign') {
      this.gsmService.deleteGSMCardNumber(this.form.value).subscribe(
        (res: any) => {
          if (res && res.success) {
            this.loading = false;
            this.drawerRef.close({ success: true });
            this.toastr.success(this.translate.instant('successfullDeleted'));
          }
        },
        (err) => {
          this.loading = false;
        }
      );
    }
  }
  
  onTabChange(index) {
    index == 0 ? this.type = 'assign' : this.type = 'unAssign';
    this.updateGsmCardValidation();
  } 
  private updateGsmCardValidation() {
    const gsmCardControl = this.form.get('gsmCardNumber');
    if (this.type === 'assign') {
      gsmCardControl.setValidators([Validators.required]);
    } else {
      gsmCardControl.clearValidators();
    }
    gsmCardControl.updateValueAndValidity();
  }
}
