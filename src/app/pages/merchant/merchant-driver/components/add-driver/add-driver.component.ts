import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzModalService } from 'ng-zorro-antd/modal';
import { catchError, debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap } from 'rxjs';
import { DriversService } from 'src/app/pages/drivers/services/drivers.service';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { generateQueryFilter } from 'src/app/shared/pipes/queryFIlter';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MerchantDriverService } from '../../services/merchant-driver.service';
import { LabelPipe } from 'src/app/shared/pipes/label.pipe';

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.scss'],
  standalone: true,
  imports: [CommonModules, NzModules, TranslateModule, IconsProviderModule, LabelPipe],
  providers: [NzModalService]
})
export class AddDriverComponent implements OnInit {
  @Input() merchantId: number;
  form!: FormGroup;
  loading: boolean = false;
  drivers$!: Observable<any>;
  searchDriver$ = new Subject<string>();
  selectedDriver: any;
  constructor(
    private translate: TranslateService,
    private driversService: DriversService,
    private merchantService: MerchantDriverService,
    private toastr: NotificationService,
    private drawer: NzDrawerRef) {
    
  }
  ngOnInit(): void {
    this.form = new FormGroup({
      searchAs: new FormControl('driverId'),
      tmsId: new FormControl(this.merchantId, [Validators.required]),
      driverId: new FormControl(null, [Validators.required])
    });
    this.drivers$ = this.searchDriver$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchTerm: string) => this.driversService.getAll({}, searchTerm).pipe(
        catchError((err) => {
          return of({ data: { content: [] } });
        })
      )),
    );
  }

  onSave() {
    this.loading = true;
    let data = {
      tmsId: this.merchantId,
      driverIds: [this.form.value.driverId.toString()]
    }
    this.merchantService.appendDriver(data).subscribe((res:any) => {
      this.loading = false;
      this.toastr.success(this.translate.instant('successfullCreated'));
      this.drawer.close({success:true});
    },err => {
      this.loading = false;
    });
  }

  findDriver(ev: string) {
    let searchAs = this.form.get('searchAs')?.value;
    let filter = generateQueryFilter({ [searchAs]: ev });
    this.searchDriver$.next(filter);
  }
}
