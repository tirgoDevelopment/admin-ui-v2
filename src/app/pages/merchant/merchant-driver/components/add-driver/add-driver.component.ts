import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalService } from 'ng-zorro-antd/modal';
import { catchError, debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap } from 'rxjs';
import { DriversService } from 'src/app/pages/drivers/services/drivers.service';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { generateQueryFilter } from 'src/app/shared/pipes/queryFIlter';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MerchantDriverService } from '../../services/merchant-driver.service';

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.scss'],
  standalone: true,
  imports: [CommonModules, NzModules, TranslateModule, IconsProviderModule],
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
    private modal: NzModalService,
    private drawer: NzDrawerRef,
    private route: ActivatedRoute) {
    
  }
  ngOnInit(): void {
    this.form = new FormGroup({
      tmsId: new FormControl(this.merchantId, [Validators.required]),
      driverId: new FormControl(null, [Validators.required])
    });
    this.drivers$ = this.searchDriver$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchTerm: string) => this.driversService.getAll({driverId:searchTerm},{},).pipe(
        catchError((err) => {
          return of({ data: { content: [] } });
        })
      )),
    );
  }

  onSave() {
    this.loading = true;
    this.merchantService.appendDriver(this.form.value).subscribe((res:any) => {
      this.loading = false;
      this.toastr.success(this.translate.instant('successfullCreated'));
      this.drawer.close({success:true});
    },err => {
      this.loading = false;
    });
  }

  findDriver(ev: string) {
    this.searchDriver$.next(ev);
  }
}
