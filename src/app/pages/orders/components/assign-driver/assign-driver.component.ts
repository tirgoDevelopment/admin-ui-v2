import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskDirective } from 'ngx-mask';
import { BehaviorSubject, Observable, catchError, debounceTime, distinctUntilChanged, filter, of, switchMap } from 'rxjs';
import { DriversService } from 'src/app/pages/drivers/services/drivers.service';
import { CurrencyModel } from 'src/app/pages/references/currencies/models/currency.model';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { generateQueryFilter } from 'src/app/shared/pipes/queryFIlter';
import { CurrenciesService } from 'src/app/shared/services/references/currencies.service';
import { OrdersService } from '../../services/orders.service';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-assign-driver',
  templateUrl: './assign-driver.component.html',
  styleUrls: ['./assign-driver.component.scss'],
  standalone: true,
  imports: [NzModules, CommonModules, TranslateModule, NgxMaskDirective],
})
export class AssignDriverComponent implements OnInit {
  @Input() orderId: any;
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
    private drawerRef: NzDrawerRef
  ) {
    this.form = new FormGroup({
      orderId: new FormControl(''),
      driverId: new FormControl(''),
      amount: new FormControl(''),
      currencyId: new FormControl('')
    })
  }
  ngOnInit(): void {
    this.getCurrencies();
    console.log(this.orderId);
    this.drivers$ = this.searchDriver$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchTerm: string) => this.driverApi.getAll({}, searchTerm).pipe(
        catchError((err) => {
          return of({ data: { content: [] } });
        })
      )),
    );
  }
  getCurrencies() {
    this.currencyApi.getAll().subscribe((res: any) => {
      if (res && res.success) {
        this.currencies = res.data;
        this.form.patchValue({
          currencyId: res.data[0].id
        })
      }
    })
  }
  findDriver(ev: string) {
    let filter = generateQueryFilter({ firstName: ev });
    this.searchDriver$.next(filter);
  }
  assignDriver() {
    this.loading = true;
    this.form.patchValue({
      orderId: this.orderId
    })
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
