import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxMaskDirective } from 'ngx-mask';
import { CurrencyModel } from 'src/app/pages/references/currencies/models/currency.model';
import { LoadingMethodModel } from 'src/app/pages/references/loading-method/models/loading-method.model';
import { TransportKindModel } from 'src/app/pages/references/transport-kinds/models/transport-kinds.model';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { RefService } from 'src/app/shared/services/ref.service';
import { CargoPackagesService } from 'src/app/shared/services/references/cargo-packages.service';
import { CargoTypesService } from 'src/app/shared/services/references/cargo-type.service';
import { CurrenciesService } from 'src/app/shared/services/references/currencies.service';
import { LoadingMethodService } from 'src/app/shared/services/references/loading-method.service';
import { TransportKindsService } from 'src/app/shared/services/references/transport-kinds.service';
import { TransportTypesService } from 'src/app/shared/services/references/transport-type.service';
import { AgreementComponent } from '../agreement/agreement.component';
import { OrdersService } from '../../services/orders.service';
import { BehaviorSubject, Observable, Subject, catchError, debounceTime, distinctUntilChanged, forkJoin, of, switchMap } from 'rxjs';
import { ClientModel } from 'src/app/pages/clients/models/client.model';
import { ClientsService } from 'src/app/pages/clients/services/clients.service';
import { generateQueryFilter } from 'src/app/shared/pipes/queryFIlter';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { CargoPackagesModel } from 'src/app/pages/references/cargo-packages/models/cargo-packages.model';
import { OrderModel } from '../../models/order.model';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { AngularYandexMapsModule } from 'angular8-yandex-maps';
import { AssignDriverComponent } from '../assign-driver/assign-driver.component';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
  standalone: true,
  imports: [NzModules, CommonModules, TranslateModule, NgxMaskDirective, PipeModule, AngularYandexMapsModule],
  providers: [NzModalService]
})
export class OrderFormComponent implements OnInit {
  @Input() data: OrderModel;
  @Input() mode: string = 'add' || 'edit' || 'view';
  step: number = 1;
  form: FormGroup;
  currencies: CurrencyModel[];
  transportTypes: any[] = [];
  transportKinds: TransportKindModel[] = [];
  cargoTypes: any;
  packages: CargoPackagesModel[] = [];
  loadingMethods: LoadingMethodModel[] = [];
  currentDate: Date = new Date();
  findList: any[] = [];
  searchClient$ = new BehaviorSubject<string>('');
  clients$: Observable<any>;
  searchSubject = new Subject<string>();
  isAutotransport: any;
  isRefrigerator: any;
  isRefrigeratorMode: boolean = false;
  isCistern: any;
  isContainer: any;
  loading: boolean = false;
  clients: ClientModel[];
  constructor(
    private orderApi: OrdersService,
    private clientApi: ClientsService,
    private refApi: RefService,
    private toastr: NotificationService,
    private translate: TranslateService,
    private currencyApi: CurrenciesService,
    private trTypeApi: TransportTypesService,
    private transportKindApi: TransportKindsService,
    private cargoTypeApi: CargoTypesService,
    private packageApi: CargoPackagesService,
    private loadingMethodApi: LoadingMethodService,
    private modal: NzModalService,
    private drawerRef: NzDrawerRef,
  ) {
    this.form = new FormGroup({
      id: new FormControl(null),
      clientId: new FormControl(null, [Validators.required]),
      sendDate: new FormControl(null, [Validators.required]),

      loadingLocation: new FormControl({}, [Validators.required]),
      deliveryLocation: new FormControl({}, [Validators.required]),
      isAdr: new FormControl(false),
      isCarnetTir: new FormControl(false),
      isGlonas: new FormControl(false),
      isParanom: new FormControl(false),

      offeredPrice: new FormControl(null),
      offeredPriceCurrencyId: new FormControl(null),
      inAdvancePrice: new FormControl(null),
      inAdvancePriceCurrencyId: new FormControl(null),
      paymentMethod: new FormControl('cash'),
      isSafeTransaction: new FormControl(false),

      transportTypeIds: new FormControl([], [Validators.required]),
      transportKindIds: new FormControl([], [Validators.required]),
      refrigeratorCount: new FormControl(null),
      isHook: new FormControl(false),
      refrigeratorFrom: new FormControl(null),
      refrigeratorTo: new FormControl(null),
      cisternVolume: new FormControl(null),
      containerVolume: new FormControl(null),
      isHighCube: new FormControl(false),
      cargoTypeId: new FormControl(null),
      capacity: new FormControl(null),
      cargoWeight: new FormControl(null),
      cargoLength: new FormControl(null),
      cargoWidth: new FormControl(null),
      cargoHeight: new FormControl(null),
      loadingMethodId: new FormControl(null),
      cargoPackageId: new FormControl(null),
      selectedLocations: new FormControl([]),
      customsPlaceLocation: new FormControl(null),
      customsClearancePlaceLocation: new FormControl(null),
      additionalLoadingLocation: new FormControl(null),
      additionalDeliveryLocation: new FormControl(null)
    });
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((findText: string) => {
          return this.findCities(findText.trim().toLowerCase()).pipe(
            catchError(() => of([])),
          );
        })
      )
      .subscribe((res: any) => {
        this.findList = res.data;
      });
  }
  ngOnInit(): void {
    this.clients$ = this.searchClient$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchTerm: string) => this.clientApi.getAll({}, searchTerm).pipe(
        catchError((err) => {
          return of({ data: { content: [] } });
        })
      )),
    );
    this.getTypes();
    this.changeValue();
    if (this.mode == 'edit') {
      this.patchValue();
    }
  }
  patchValue() {
    type LocationFields = 'customsPlaceLocation' | 'customsClearancePlaceLocation' | 'additionalLoadingLocation' | 'additionalDeliveryLocation';
    let fieldsToCheck: LocationFields[] = [
      'customsPlaceLocation',
      'customsClearancePlaceLocation',
      'additionalLoadingLocation',
      'additionalDeliveryLocation'
    ];
    if (!this.data.selectedLocations) {
        this.data.selectedLocations = [];
    }
    fieldsToCheck.forEach((field) => {
      if (this.data[field]) {
        this.data.selectedLocations.push(field);  
      }
    });
    this.form.patchValue(this.data);
    this.form.patchValue({
      clientId: this.data.client ? this.data.client.id : null,
      clientMerchant: this.data.clientMerchant ? this.data.clientMerchant : null,
      transportKindIds: this.setIds(this.data.transportKinds),
      transportTypeIds: this.setIds(this.data.transportTypes),
      cargoTypeId: this.data.cargoType ? this.data.cargoType.id : null,
      loadingMethodId: this.data.loadingMethod ? this.data.loadingMethod.id : null,
      cargoPackageId: this.data.cargoPackage ? this.data.cargoPackage.id : null,
    })
  }
  disableFutureDates = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current && current < today;
  };
  getTypes() {
    forkJoin([
      this.currencyApi.getAll(),
      this.trTypeApi.getAll(),
      this.transportKindApi.getAll(),
      this.cargoTypeApi.getAll(),
      this.packageApi.getAll(),
      this.loadingMethodApi.getAll()
    ]).subscribe(([currencies, transportTypes, transportKinds, cargoTypes, packages, loadingMethods]) => {
      this.currencies = currencies.data;
      this.transportTypes = transportTypes.data;
      this.transportKinds = transportKinds.data;
      this.cargoTypes = cargoTypes.data;
      this.packages = packages.data;
      this.loadingMethods = loadingMethods.data;
      this.form.patchValue({
        offeredPriceCurrencyId: currencies.data[0].id,
        inAdvancePriceCurrencyId: currencies.data[0].id
      })
    });
  }
  accept() {
    if (this.step === 1) {
      if (this.form.controls['sendDate'].valid && this.form.controls['loadingLocation'].valid) {
        this.step++;
      } else {
        this.showErrorMessages();
      }
    } else if (this.step === 2) {
      this.step++;
    } else if (this.step === 3) {
      this.submitOrder();
    }
  }
  submitOrder() {
    const optionalFields = ['customsPlaceLocation', 'customsClearancePlaceLocation', 'additionalLoadingLocation', 'additionalDeliveryLocation'];
    for (const field of optionalFields) {
      if (this.form.value[field]) {
        this.form.patchValue({
          [field]: {
            name: this.form.value[field].displayName ? this.form.value[field].displayName : this.form.value[field].name,
            latitude: this.form.value[field].latitude,
            longitude: this.form.value[field].longitude,
          },
        });
      }
    }

    // if (this.form.get('id').value) {
    //   this.form.patchValue({
    //     transportKindIds: this.setIds(this.form.get('transportKindIds').value),
    //     transportTypeIds: this.setIds(this.form.get('transportTypeIds').value),
    //     cargoTypeId: this.setId(this.form.get('cargoTypeId').value),
    //     cargoPackageId: this.setId(this.form.get('cargoPackageId').value),
    //     loadingMethodId: this.setId(this.form.get('loadingMethodId').value),
    //   })
    // }
    if (this.form.valid) {
      this.form.patchValue({
        loadingLocation: {
          name: this.form.value.loadingLocation.displayName ? this.form.value.loadingLocation.displayName  : this.form.value.loadingLocation.name,
          latitude: this.form.value.loadingLocation.latitude,
          longitude: this.form.value.loadingLocation.longitude,
        },
        deliveryLocation: {
          name: this.form.value.deliveryLocation.displayName ? this.form.value.deliveryLocation.displayName : this.form.value.deliveryLocation.name,
          latitude: this.form.value.deliveryLocation.latitude,
          longitude: this.form.value.deliveryLocation.longitude,
        }
      });
      this.loading = true;
      if (this.form.value.id) {
        this.orderApi.update(this.form.value).subscribe((res: any) => {
          if (res.success) {
            this.drawerRef.close({ success: true });
            this.toastr.success('Заказ успешно изменен', '');
            this.step = 1;
            this.loading = false;
            this.drawerRef.close({ success: true });
          }
        }, err => {
          this.loading = false;
        })
      } else {
        this.orderApi.create(this.form.value).subscribe((res: any) => {
          if (res && res.success) {
            this.drawerRef.close({ success: true });
            this.toastr.success('Заказ успешно создан', '');
            this.step = 1;
            this.loading = false;
            this.drawerRef.close({ success: true });
          }
        }, err => {
          this.loading = false;
        })
      }

    }
    else {
      this.loading = false;
      this.showErrorMessages();
    }
  }
  setId(item: any) {
    return item.id;
  }
  setIds(ids: any[]) {
    return ids.map(item => item.id);
  }
  showErrorMessages() {
    if (this.form.invalid) {
      this.toastr.error(this.translate.instant('is_requireds'), '');
    }
  }
  changeValue() {
    this.form.get('transportKindIds').valueChanges.subscribe((values) => {
      if (values?.length == 1) {
        let tranportKind = this.transportKinds.find(x => x.id == values);
        this.isAutotransport = tranportKind?.name?.includes('Автовоз');
        this.isRefrigerator = tranportKind?.name?.includes('Рефрижератор');
        this.isCistern = tranportKind?.name?.includes('Цистерна');
        this.isContainer = tranportKind?.name?.includes('Контейнеровоз');
      } else if (values?.length > 1) {
        values.forEach((x: any) => {
          let tranportKind = this.transportKinds.find(y => y.id == x);
          this.isAutotransport = this.isAutotransport || tranportKind?.name?.includes('Автовоз');
          this.isRefrigerator = this.isRefrigerator || tranportKind?.name?.includes('Рефрижератор');
          this.isCistern = this.isCistern || tranportKind?.name?.includes('Цистерна');
          this.isContainer = this.isContainer || tranportKind?.name?.includes('Контейнеровоз');
        });
      } else {
        this.isAutotransport = false;
        this.isRefrigerator = false;
        this.isCistern = false;
        this.isContainer = false;
      }
    });
  }
  agreementModal(isChecked: boolean): void {
    if (isChecked) {
      this.modal.create({
        nzTitle: this.translate.instant('agreement'),
        nzContent: AgreementComponent,
        nzMaskClosable: false,
        nzOnOk: () => {
          this.form.get('paymentMethod').setValue('cashless');
        },
        nzOnCancel: () => {
          this.form.get('isSafeTransaction').setValue(false);
        }
      });
    }
  }
  findClient(ev: string) {
    let filter = generateQueryFilter({ firstName: ev });
    this.searchClient$.next(filter);
  }
  findCities(findText: string): Observable<any> {
    if (!findText) {
      return of({ data: [] });
    } else {
      return this.refApi.getCities(findText, 'en');
    }
  }
  findCity(ev: any): void {
    const findText = ev.toString().trim().toLowerCase();
    this.searchSubject.next(findText);
  }
  getDynamicLabel(location: string): string {
    switch (location) {
      case 'customsPlaceLocation':
        return 'Место затаможки';
      case 'customsClearancePlaceLocation':
        return 'Место растаможки';
      case 'additionalLoadingLocation':
        return 'Дополнительное место погрузки';
      case 'additionalDeliveryLocation':
        return 'Дополнительное место погрузки';
      default:
        return null;
    }
  }
  backStep() {
    if (this.step !== 1) {
      this.step--;
    }
  }
  onCancel() {
    this.modal.confirm({
      nzTitle: this.translate.instant('are_you_sure'),
      nzContent: this.translate.instant('cancel_sure'),
      nzOkText: this.translate.instant('confirm'),
      nzCancelText: this.translate.instant('cancel'),
      nzOkDanger: true,
      nzOnOk: () => {
        this.orderApi.cancelOrder(this.data).subscribe((res: any) => {
          if (res && res.success) {
            this.toastr.success(this.translate.instant('successfullyCanceled'), '');
            this.drawerRef.close({ success: true });
          }
        })
      }
    })
  }
  onAssignDriver() {
    this.modal.create({
      nzTitle: this.translate.instant('assign_driver'),
      nzContent: AssignDriverComponent,
      nzMaskClosable: false,
      nzOkText: null,
      nzCancelText: null,
      nzFooter: null,
      nzComponentParams: {
        orderId: this.data.id
      }
    })
  }

}

