import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxMaskDirective } from 'ngx-mask';
import { BehaviorSubject, Observable, catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { DriversService } from 'src/app/pages/drivers/services/drivers.service';
import { CurrencyModel } from 'src/app/pages/references/currencies/models/currency.model';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { generateQueryFilter } from 'src/app/shared/pipes/queryFIlter';
import { CurrenciesService } from 'src/app/shared/services/references/currencies.service';
import { OrdersService } from '../../services/orders.service';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-assign-driver',
  templateUrl: './assign-driver.component.html',
  styleUrls: ['./assign-driver.component.scss'],
  standalone: true,
  imports: [NzModules, CommonModules, TranslateModule, NgxMaskDirective],
  providers: [NzModalService]
})
export class AssignDriverComponent implements OnInit {

  @Input() orderId: string|number;
  @Input() type: string;
  findList: any[] = [];
  form: FormGroup;
  searchDriver$ = new BehaviorSubject<string>('');
  drivers$: Observable<any>;
  currencies: CurrencyModel[] = [];
  loading: boolean = false;

  constructor(
    private orderApi: OrdersService,
    private driverApi: DriversService,
    private currencyApi: CurrenciesService,
    private drawerRef: NzDrawerRef,
    private modal: NzModalService,
    private toastr: NotificationService,
    private translate: TranslateService
  ) {
    this.form = new FormGroup({
      orderId: new FormControl(''),
      driverId: new FormControl('', [Validators.required]),
      amount: new FormControl('',[Validators.required]),
      curencyId: new FormControl('', [Validators.required])
    })
  }
  ngOnInit(): void {
    this.getCurrencies();
    this.drivers$ = this.searchDriver$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchTerm: string) => this.driverApi.getAll({}, searchTerm).pipe(
        catchError((err) => {
          return of({ data: { content: [] } });
        })
      )),
    );
    this.form.patchValue({
      orderId: this.orderId
    })
  }
  getCurrencies() {
    this.currencyApi.getAll().subscribe((res: any) => {
      if (res && res.success) {
        this.currencies = res.data;
        this.form.patchValue({
          curencyId: res.data[0].id
        })
      }
    })
  }
  findDriver(ev: string) {
    let filter = generateQueryFilter({ firstName: ev });
    this.searchDriver$.next(filter);
  }
  assignDriver() {
    if (!this.form.value.driverId || this.form.value.driverId === '') {
      this.toastr.error(this.translate.instant('is_requireds'));
      return;
    }
    if (!this.form.value.amount || this.form.value.amount === '') {
      this.toastr.error(this.translate.instant('is_requireds'));
      return;
    }
    if (!this.form.value.curencyId || this.form.value.curencyId === '') {
      this.toastr.error(this.translate.instant('is_requireds'));
      return;
    }
    
    this.loading = true;
    if(this.type == 'offer') {
      console.log(this.form.value);
      this.orderApi.sendOffer(this.form.value).subscribe((res: any) => {
        if(res && res.success) { 
          this.loading = false;
          this.form.reset();
          this.drawerRef.close({ success: true });
        }
      }, err => {
        this.loading = false;
      })
    }else {
      this.orderApi.appendOrder(this.form.value).subscribe((res: any) => {
        if(res && res.success) { 
          this.loading = false;
          this.form.reset();
          this.drawerRef.close({ success: true });
        }
      }, err => {
        this.loading = false;
      })
    }
  }
  onCancel() {
    this.modal.closeAll();
  }

}
