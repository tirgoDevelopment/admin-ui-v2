import { Component, Input, OnInit, OnDestroy } from '@angular/core';
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
import { CargoTypesService } from 'src/app/shared/services/references/cargo-type.service';
import { CurrenciesService } from 'src/app/shared/services/references/currencies.service';
import { LoadingMethodService } from 'src/app/shared/services/references/loading-method.service';
import { TransportKindsService } from 'src/app/shared/services/references/transport-kinds.service';
import { TransportTypesService } from 'src/app/shared/services/references/transport-type.service';
import { AgreementComponent } from '../agreement/agreement.component';
import { OrdersService } from '../../services/orders.service';
import { BehaviorSubject, Observable, Subject, Subscription, catchError, debounceTime, distinctUntilChanged, forkJoin, of, switchMap, takeUntil } from 'rxjs';
import { ClientModel } from 'src/app/pages/clients/models/client.model';
import { ClientsService } from 'src/app/pages/clients/services/clients.service';
import { generateQueryFilter } from 'src/app/shared/pipes/queryFIlter';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { CargoPackagesModel } from 'src/app/pages/references/cargo-packages/models/cargo-packages.model';
import { OrderModel } from '../../models/order.model';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { AngularYandexMapsModule } from 'angular8-yandex-maps';
import { AssignDriverComponent } from '../assign-driver/assign-driver.component';
import { GeoDbService, GeoResponse, PlaceSummary } from 'wft-geodb-angular-client';
import { CargoStatusCodes } from 'src/app/shared/enum/statusCode.enum';
import { DriverFormComponent } from 'src/app/pages/drivers/components/driver-form/driver-form.component';
import { SendOfferComponent } from '../send-offer/send-offer.component';
import { RejectOfferComponent } from '../reject-offer/reject-offer.component';
import { CargoStatusService } from 'src/app/shared/services/references/cargo-status.service';
import { CargoStatusModel } from 'src/app/pages/references/cargo-status/models/cargo-status.model';
import { ClientsFormComponent } from 'src/app/pages/clients/components/clients-form/clients-form.component';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { Permission } from 'src/app/shared/enum/per.enum';
import { PriceFormatPipe } from 'src/app/shared/pipes/priceFormat.pipe';
import { DateFormatPipe } from 'src/app/shared/pipes/dateFormat.pipe';
import { ReferencePointsPipe } from 'src/app/shared/pipes/reference-points.pipe';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
  standalone: true,
  imports: [NzModules, CommonModules, TranslateModule, NgxMaskDirective, DateFormatPipe, PriceFormatPipe, ReferencePointsPipe, AngularYandexMapsModule],
  providers: [NzModalService],
})
export class OrderFormComponent implements OnInit, OnDestroy {
  Per = Permission;
  public CargoStatusCodes = CargoStatusCodes;
  @Input() orderId: string | number;
  @Input() mode: string;
  step: number = 1;
  form: FormGroup;
  currencies: CurrencyModel[];
  transportTypes: any[] = [];
  transportKinds: TransportKindModel[] = [];
  statuses: CargoStatusModel[];
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
  data: OrderModel;
  private cityInputSubscription: Subscription | null = null;
  loadingPage: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private orderApi: OrdersService,
    private clientApi: ClientsService,
    private toastr: NotificationService,
    private translate: TranslateService,
    private currencyApi: CurrenciesService,
    private trTypeApi: TransportTypesService,
    private transportKindApi: TransportKindsService,
    private cargoTypeApi: CargoTypesService,
    private loadingMethodApi: LoadingMethodService,
    private statusesApi: CargoStatusService,
    private modal: NzModalService,
    private drawerRef: NzDrawerRef,
    private geoDbService: GeoDbService,
    private drawer: NzDrawerService,
    public perService: PermissionService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.clients$ = this.searchClient$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchTerm: string) => this.clientApi.getAll({}, searchTerm).pipe(
        catchError(() => of({ data: { content: [] } }))
      )),
      takeUntil(this.destroy$)
    );

    this.getTypes();
    if (this.orderId) {
      this.getById();
    }
  }

  getById() {
    this.loadingPage = true;
    this.orderApi.getById(this.orderId).subscribe((res: any) => {
      if (res) {
        this.loadingPage = false;
        this.data = res.data;


        this.patchValue();
      }
    }, err => {
      this.loadingPage = false;
    })
  }
  get activeOffers() {
    return this.data?.driverOrderOffers?.filter(o => !o.isRejected && !o.isCancelled && !o.clientReplyOrderOffer?.isRejected && !o.clientReplyOrderOffer?.isCancelled) || [];
  }
  get inactiveOffers() {
    return this.data?.driverOrderOffers?.filter(o => o.isRejected || o.isCancelled || o.clientReplyOrderOffer?.isRejected || o.clientReplyOrderOffer?.isCancelled) || [];
  }
  cityFormatter(): void {
    const locationFields = [
      'loadingLocation',
      'deliveryLocation',
      'customsOutClearanceLocation',
      'customsInClearanceLocation',
      'additionalLoadingLocation',
      'additionalDeliveryLocation'
    ];

    locationFields.forEach(field => {
      const location = this.form.get(field)?.value;
      if (location?.name && location?.country) {
        this.form.patchValue({
          [field]: {
            name: `${location.name}${location.country ? ', ' + location.country : ''}`,
            latitude: location.latitude?.toString() || '',
            longitude: location.longitude?.toString() || '',
          }
        });
      }
    });
  }
  patchValue() {
    this.findList.push(this.data.loadingLocation);
    this.findList.push(this.data.deliveryLocation);

    type LocationFields = 'customsOutClearanceLocation' | 'customsInClearanceLocation' | 'additionalLoadingLocation' | 'additionalDeliveryLocation';
    let fieldsToCheck: LocationFields[] = ['customsOutClearanceLocation', 'customsInClearanceLocation', 'additionalLoadingLocation', 'additionalDeliveryLocation'];
    if (!this.data.selectedLocations) {
      this.data.selectedLocations = [];
    }
    fieldsToCheck.forEach((field) => {
      if (this.data[field]) {
        this.data.selectedLocations.push(field);
        this.findList.push(this.data[field]);
      }
    });
    this.form.patchValue(this.data);
    this.form.patchValue({
      clientId: this.data.client ? this.data.client.id : null,
      clientMerchant: this.data.clientMerchant ? this.data.clientMerchant : null,
      transportKindIds: this.setIds(this.data.transportKinds),
      cargoTypeId: this.data.cargoType ? this.data.cargoType.id : null,
      cargoLoadMethodIds: this.setIds(this.data.cargoLoadMethods),
      cargoPackageId: this.data.cargoPackage ? this.data.cargoPackage.id : null,
      transportTypeId: this.data.transportType ? this.data.transportType.id : null,
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
      this.statusesApi.getAll(),
      this.loadingMethodApi.getAll(),
    ]).subscribe(([currencies, transportTypes, transportKinds, cargoTypes, statuses, loadingMethods]) => {
      this.currencies = currencies.data;
      this.transportTypes = transportTypes.data;
      this.transportKinds = transportKinds.data;
      this.cargoTypes = cargoTypes.data;
      this.statuses = statuses.data;
      this.loadingMethods = loadingMethods.data;
      this.form.patchValue({
        offeredPriceCurrencyId: currencies.data[0].id,
      })
    });
  }
  accept() {
    if (this.step === 1) {
      const requiredControls = ['sendDate', 'loadingLocation', 'deliveryLocation'];
      const isValid = requiredControls.every(controlName => this.form.get(controlName)?.valid);

      if (isValid) {
        this.step++;
      } else {
        this.showErrorMessages();
      }
    } else if (this.step === 2) {
      const priceValid = !this.form.get('offeredPrice')?.value ||
        this.form.get('offeredPrice')?.valid;

      if (priceValid) {
        this.step++;
      } else {
        this.showErrorMessages();
      }
    } else if (this.step === 3) {
      this.submitOrder();
    }
  }
  submitOrder(): void {
    if (!this.form.valid) {
      this.showErrorMessages();
      return;
    }
    this.loading = true;
    this.cityFormatter();

    const request$ = this.form.value.id ?
      this.orderApi.update(this.form.value) :
      this.orderApi.create(this.form.value);

    request$.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        if (res.success) {
          const message = this.form.value.id ?
            'Заказ успешно изменен' :
            'Заказ успешно создан';

          this.toastr.success(message, '');
          this.step = 1;
          this.drawerRef.close({ success: true });
        }
      },
      error: () => this.loading = false,
      complete: () => this.loading = false
    });
  }
  setIds(ids: any[]) {
    return ids.map(item => item.id);
  }
  showErrorMessages(): void {
    if (this.form.invalid) {
      const errors: string[] = [];
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control?.errors) {
          if (control.errors['required']) {
            errors.push(`${this.translate.instant(key)} ${this.translate.instant('is_requireds')}`);
          }
          if (control.errors['min']) {
            errors.push(`${this.translate.instant(key)} ${this.translate.instant('must_be_greater_than_zero')}`);
          }
        }
      });

      if (errors.length > 0) {
        this.toastr.error(errors.join('\n'), '');
      } else {
        this.toastr.error(this.translate.instant('form_has_errors'), '');
      }
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
  detectLanguage(input: string): string {
    return /[А-Яа-яЁё]/.test(input) ? 'ru' : 'en';
  }
  findCity(event: any): void {
    const input = event?.trim();
    if (!input) {
      this.findList = [];
      return;
    }

    const lang = this.detectLanguage(input);

    if (this.cityInputSubscription) {
      this.cityInputSubscription.unsubscribe();
    }

    this.cityInputSubscription = this.searchCity(input, lang).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: GeoResponse<PlaceSummary[]>) => {
        this.findList = response.data.map(city => ({
          name: city.name,
          country: city.country,
          latitude: city.latitude,
          longitude: city.longitude
        }));
      },
      error: () => {
        this.findList = [];
        this.toastr.error(this.translate.instant('error_loading_cities'), '');
      }
    });
  }

  private searchCity(input: string, lang: string): Observable<GeoResponse<PlaceSummary[]>> {
    return this.geoDbService.findPlaces({
      namePrefix: input,
      types: ['CITY'],
      limit: 10,
      offset: 0,
      languageCode: lang
    });
  }

  getDynamicLabel(location: string): string {
    switch (location) {
      case 'customsOutClearanceLocation':
        return 'Место затаможки';
      case 'customsInClearanceLocation':
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
    this.form.patchValue(this.form.value)
    this.findList.push(this.form.value.loadingLocation);
    this.findList.push(this.form.value.deliveryLocation);
    type LocationFields = 'customsOutClearanceLocation' | 'customsInClearanceLocation' | 'additionalLoadingLocation' | 'additionalDeliveryLocation';
    let fieldsToCheck: LocationFields[] = ['customsOutClearanceLocation', 'customsInClearanceLocation', 'additionalLoadingLocation', 'additionalDeliveryLocation'];
    fieldsToCheck.forEach((field) => {
      if (this.form.value[field]) {
        this.form.value.selectedLocations.push(field);
        this.findList.push(this.form.value[field]);
      }
    });
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
  onAssignDriver(type: string) {
    this.modal.create({
      nzTitle: this.translate.instant(type === 'assign' ? 'assign_driver' : 'sendOffer'),
      nzContent: AssignDriverComponent,
      nzMaskClosable: false,
      nzOkText: null,
      nzCancelText: null,
      nzFooter: null,
      nzComponentParams: {
        type: type,
        orderId: this.data.id
      }
    })
  }
  showDriverProfile(id: number | string) {
    if (this.perService.hasPermission(this.Per.DriverDetail)) {
      const drawerRef: any = this.drawer.create({
        nzTitle: this.translate.instant('information'),
        nzContent: DriverFormComponent,
        nzMaskClosable: false,
        nzPlacement: 'right',
        nzWidth: '400px',
        nzContentParams: {
          id: id,
          mode: 'view'
        }
      });
      drawerRef.afterClose.subscribe((result: any) => {
        if (result?.success) {
          this.drawerRef.close();
        }
      })
    }
  }
  showClientProfile(id: number | string) {
    if (this.perService.hasPermission(this.Per.ClientDetail)) {
      const drawerRef: any = this.drawer.create({
        nzTitle: this.translate.instant('information'),
        nzContent: ClientsFormComponent,
        nzMaskClosable: false,
        nzPlacement: 'right',
        nzWidth: '400px',
        nzContentParams: {
          clientId: id,
          mode: 'view'
        }
      });
      drawerRef.afterClose.subscribe((result: any) => {
        if (result?.success) {
          this.drawerRef.close();
        }
      })
    }
  }
  replyToDriverOffer(offer?: any) {
    const modal = this.modal.create({
      nzComponentParams: {
        offer: offer,
        clientId: this.data.client.id
      },
      nzTitle: this.translate.instant('sendOffer'),
      nzContent: SendOfferComponent,
      nzMaskClosable: false,
      nzOkText: this.translate.instant('save'),
      nzOnOk: (componentInstance: SendOfferComponent) =>
        componentInstance.replyToDriverOffer(),
    });
    modal.afterClose.subscribe((result) => {
      if (result?.success) {
        this.getById();
      }
    });
  }
  acceptOffer(offer) {
    let data = {
      orderId: offer.order.id,
      offerId: offer.isReplied ? offer.clientReplyOrderOffer.id : offer.id
    }
    this.loading = true;
    const rejectMethod = offer.isReplied
      ? this.orderApi.acceptClientOffer(data)
      : this.orderApi.acceptDriverOffer(data);
    rejectMethod.subscribe(
      (res: any) => {
        if (res && res?.success) {
          this.toastr.success(this.translate.instant('successfullUpdated'));
          this.form.reset();
          this.drawerRef.close({ success: true });
        }
        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
  }
  rejectOffer(offer) {
    const modal = this.modal.create({
      nzComponentParams: {
        offer: offer,
      },
      nzTitle: this.translate.instant('rejectOffer'),
      nzContent: RejectOfferComponent,
      nzMaskClosable: false,
      nzFooter: null
    });
  }

  changeStatusOrder() {
    const statusMap = {
      [CargoStatusCodes.Accepted]: 'activate',
      [CargoStatusCodes.Active]: 'complete',
      [CargoStatusCodes.Completed]: 'finish'
    };
    const status = statusMap[this.data.cargoStatus.code];

    if (status) {
      const data = {
        orderId: this.orderId,
        status: status
      };

      this.orderApi.changeStatusOrder(data).subscribe((res: any) => {
        if (res && res.success) {
          this.toastr.success('successfullUpdated');
          this.getById();
        }
      });
    }
  }
  getButtonText(status: CargoStatusCodes): string {
    const statusTextMap = {
      [CargoStatusCodes.Accepted]: 'active',
      [CargoStatusCodes.Active]: 'completed',
      [CargoStatusCodes.Completed]: 'closed'
    };
    return this.translate.instant(statusTextMap[status] || 'change');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.cityInputSubscription) {
      this.cityInputSubscription.unsubscribe();
    }
  }

  private initForm(): void {
    this.form = new FormGroup({
      id: new FormControl(null),
      clientId: new FormControl(null, [Validators.required]),
      sendDate: new FormControl(null, [Validators.required]),
      loadingLocation: new FormControl(null, [Validators.required]),
      deliveryLocation: new FormControl(null, [Validators.required]),
      isAdr: new FormControl(false),
      isCarnetTir: new FormControl(false),
      isBorderCrossing: new FormControl(false),
      isParanom: new FormControl(false),
      offeredPrice: new FormControl(null, [Validators.min(0)]),
      offeredPriceCurrencyId: new FormControl(null),
      inAdvancePrice: new FormControl(null, [Validators.min(0)]),
      inAdvancePriceCurrencyId: new FormControl(null),
      isCashlessPayment: new FormControl(false),
      isSecureTransaction: new FormControl(false),
      transportTypeId: new FormControl(null, [Validators.required]),
      transportKindIds: new FormControl([], [Validators.required]),
      isHook: new FormControl(false),
      isRefrigerator: new FormControl(null),
      refrigeratorFromCount: new FormControl(null),
      refrigeratorToCount: new FormControl(null),
      cisternVolume: new FormControl(null),
      containerVolume: new FormControl(null),
      heightCubature: new FormControl(null),
      cargoTypeId: new FormControl(null),
      cargoWeight: new FormControl(null),
      cargoLoadMethodIds: new FormControl([]),
      cargoPackageId: new FormControl(null),
      selectedLocations: new FormControl([]),
      customsOutClearanceLocation: new FormControl(null),
      customsInClearanceLocation: new FormControl(null),
      additionalLoadingLocation: new FormControl(null),
      additionalDeliveryLocation: new FormControl(null),
      cargoLength: new FormControl(null),
      cargoWidth: new FormControl(null),
      cargoHeight: new FormControl(null),
    });

    this.form.get('isRefrigerator')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(isRefrigerator => {
      const fromControl = this.form.get('refrigeratorFromCount');
      const toControl = this.form.get('refrigeratorToCount');

      if (isRefrigerator) {
        fromControl?.setValidators([Validators.required, Validators.min(0)]);
        toControl?.setValidators([Validators.required, Validators.min(0)]);
      } else {
        fromControl?.clearValidators();
        toControl?.clearValidators();
      }

      fromControl?.updateValueAndValidity();
      toControl?.updateValueAndValidity();
    });
  }
}
