import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NgxMaskDirective } from 'ngx-mask';
import { forkJoin } from 'rxjs';
import { CargoPackagesModel } from 'src/app/pages/references/cargo-packages/models/cargo-packages.model';
import { CargoTypesModel } from 'src/app/pages/references/cargo-types/models/cargo-type.model';
import { CurrencyModel } from 'src/app/pages/references/currencies/models/currency.model';
import { LoadingMethodModel } from 'src/app/pages/references/loading-method/models/loading-method.model';
import { TransportKindModel } from 'src/app/pages/references/transport-kinds/models/transport-kinds.model';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CargoPackagesService } from 'src/app/shared/services/references/cargo-packages.service';
import { CargoTypesService } from 'src/app/shared/services/references/cargo-type.service';
import { CurrenciesService } from 'src/app/shared/services/references/currencies.service';
import { LoadingMethodService } from 'src/app/shared/services/references/loading-method.service';
import { TransportKindsService } from 'src/app/shared/services/references/transport-kinds.service';
import { TransportTypesService } from 'src/app/shared/services/references/transport-type.service';
import { DriversService } from '../../../drivers/services/drivers.service';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { TransportModel } from 'src/app/pages/references/transport-types/models/transport.model';
import { Response } from 'src/app/shared/models/reponse';
import { FileFetchPipe } from 'src/app/shared/pipes/file-fetch.pipe';
import { TransportBrandService } from 'src/app/pages/references/transport-brand/services/transport-brand.service';
import { TransportsService } from 'src/app/pages/transports/services/transports.service';
@Component({
  selector: 'app-add-transport',
  templateUrl: './add-transport.component.html',
  styleUrls: ['./add-transport.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules, NzModalModule, PipeModule, NgxMaskDirective, FileFetchPipe]

})
export class AddTransportComponent implements OnInit {
  @Input() data?: TransportModel;
  @Input() driverId?: number | string;
  @Input() mode: "add" | "edit";
  @Output() transportAdded = new EventEmitter<void>();
  confirmModal?: NzModalRef;

  form: FormGroup;
  edit: boolean = false;
  isAutotransport: boolean = false;
  isRefrigerator: boolean = false;
  isContainer: boolean = false;
  isLoad: boolean = false;
  isCistern: boolean = false;
  isRefrigeratorMode: boolean = false;

  currencies: CurrencyModel[];
  cargoTypes: CargoTypesModel[];
  transportKinds: TransportKindModel[];
  transportTypes: any;
  packagesTypes: CargoPackagesModel[];
  cargoLoadingMethods: LoadingMethodModel[];

  loading: boolean = false;

  fileRemovedtechPassportFront: boolean = false;
  previewUrltechPassportFront: string | ArrayBuffer | null = null;
  selectedFiletechPassportFront: File | null = null;

  fileRemovedtechPassportBack: boolean = false;
  previewUrltechPassportBack: string | ArrayBuffer | null = null;
  selectedFiletechPassportBack: File | null = null;

  fileRemovedTransportationLicense: boolean = false;
  previewUrlTransportationLicense: string | ArrayBuffer | null = null;
  selectedFileTransportationLicense: File | null = null;
  brandGroups: any;

  constructor(
    private driversService: DriversService,
    private transportService: TransportsService,
    private transportTypesService: TransportTypesService,
    private brandsService: TransportBrandService,
    private loadingMethodService: LoadingMethodService,
    private transportKindsService: TransportKindsService,
    private toastr: NotificationService,
    private drawerRef: NzDrawerRef,
    private translate: TranslateService,
    private modal: NzModalService,

  ) {

    this.form = new FormGroup({
      id: new FormControl(''),
      driverId: new FormControl(''),
      transportBrandId: new FormControl('', [Validators.required]),
      capacity: new FormControl('', [Validators.required]),
      transportNumber: new FormControl('', [Validators.required]),
      transportKindId: new FormControl(),
      transportTypeId: new FormControl(),
      cargoLoadMethodIds: new FormControl([]),
      refrigeratorFromCount: new FormControl('', [Validators.min(-10), Validators.max(24)]),
      refrigeratorToCount: new FormControl('', [Validators.min(0), Validators.max(25)]),
      isRefrigerator: new FormControl(''),
      loadFrom: new FormControl('', [Validators.min(17), Validators.max(24)]),
      loadTo: new FormControl('', [Validators.min(0), Validators.max(25)]),
      isHook: new FormControl(false),
      isAdr: new FormControl(false),
      isHighCube: new FormControl(false),
      volume: new FormControl(''),
      isMain: new FormControl(false),
      isKzPaidWay: new FormControl(false)
    })
  }

  ngOnInit(): void {
    this.getTransportBrands();
    this.getTypes();
    if (this.mode == 'edit') {
      this.edit = true;
      this.getTransport();
    }else {
      this.transportKindIdsChange();
    }
  }
  getTransport() {
    this.transportService.getById(this.data).subscribe((res:any) => {
      if(res) {
        this.data = res.data;
        this.patchForm();
      }
    })
  }
  getTypes() {
    forkJoin({
      transportTypes: this.transportTypesService.getAll(),
      cargoLoadingMethods: this.loadingMethodService.getAll(),
      transportKinds: this.transportKindsService.getAll()
    }).subscribe({
      next: (results: any) => {
        this.transportTypes = results.transportTypes.data;
        this.cargoLoadingMethods = results.cargoLoadingMethods.data;
        this.transportKinds = results.transportKinds.data;
      },

      error: (error: any) => {
      }
    });
  }
  patchForm() {
    this.form.patchValue({
      id: this.data.id,
      driverId: this.driverId ? this.driverId : null,
      transportBrandId: this.data.brand ? this.data.brand.id : null,
      capacity: this.data.capacity,
      transportKindId: this.data?.transportKind ? this.data.transportKind.id : null,
      transportTypeId: this.data?.transportType ? this.data.transportType.id : null,
      cargoLoadMethodIds: this.data.cargoLoadMethods.map((method: any) => method.id), 
      transportNumber: this.data.transportNumber,
      refrigeratorFromCount: this.data.refrigeratorFrom,
      refrigeratorToCount: this.data.refrigeratorTo,
      isRefrigerator: this.data.isRefrigerator,
      cisternVolume: this.data.cisternVolume,
      volume: this.data.volume,
      loadFrom: this.data.loadFrom,
      loadTo: this.data.loadTo,
      isHook: this.data.isHook,
      isAdr: this.data.isAdr,
      heightCubature: this.data.heightCubature,
      isMain: this.data.isMain,
      isKzPaidWay: this.data.isKzPaidWay
    });
  }
  getTransportBrands() {
    this.brandsService.getBrandGroups().subscribe((res: any) => {
      if (res && res.success) {
        this.brandGroups = res.data;
      }
    })
  }
  onCancel() {
    this.drawerRef.close({ success: false });
  }
  onSubmit() {
    this.form.value.transportNumber = this.form.value.transportNumber.toUpperCase().substring(0, 8);
    this.form.value.capacity = this.form.value.capacity.toString();
    this.form.value.driverId = this.driverId ? this.driverId : null;
    this.loading = true;
    console.log(this.form.value);
    
    const submitObservable = this.data
      ? this.driversService.updateTransport(this.form.value)
      : this.driversService.createTransport(this.form.value);

    submitObservable.subscribe(
      (res: any) => {
        if (res && res.success) {
          this.loading = false;
          const messageKey = this.data ? 'successfullUpdated' : 'successfullCreated';
          this.toastr.success(this.translate.instant(messageKey), '');
          this.drawerRef.close({ success: true });
          this.form.reset();
          if (!this.data) {
            this.transportAdded.emit();
          }
        }
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  onCheckboxChange(event: any) {
    this.isRefrigeratorMode = event;
  }
  onFileSelected(event: Event, type: 'techPassportFront' | 'techPassportBack' | 'transportationLicense'): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'techPassportFront') {
          this.selectedFiletechPassportFront = file;
          this.previewUrltechPassportFront = reader.result;
          this.form.get('techPassportFrontFilePath')?.setValue(file);
          this.form.get('techPassportFrontFilePath')?.updateValueAndValidity();
        }
        else if (type === 'techPassportBack') {
          this.selectedFiletechPassportBack = file;
          this.previewUrltechPassportBack = reader.result;
          this.form.get('techPassportBackFilePath')?.setValue(file);
          this.form.get('techPassportBackFilePath')?.updateValueAndValidity();
        }
        else if (type === 'transportationLicense') {
          this.selectedFileTransportationLicense = file;
          this.previewUrlTransportationLicense = reader.result;
          this.form.get('goodsTransportationLicenseCardFilePath')?.setValue(file);
          this.form.get('goodsTransportationLicenseCardFilePath')?.updateValueAndValidity();
        }
      };
      reader.readAsDataURL(file);
    }
  }
  removeFile(fileType: 'techPassportFront' | 'techPassportBack' | 'transportationLicense'): void {
    if (fileType === 'techPassportFront') {
      this.fileRemovedtechPassportFront = true;
      this.previewUrltechPassportFront = null;
      this.selectedFiletechPassportFront = null;
    }
    else if (fileType === 'techPassportBack') {
      this.fileRemovedtechPassportBack = true;
      this.previewUrltechPassportBack = null;
      this.selectedFiletechPassportBack = null;
    }
    else if (fileType === 'transportationLicense') {
      this.fileRemovedTransportationLicense = true;
      this.previewUrlTransportationLicense = null;
      this.selectedFileTransportationLicense = null;
    }
  }
  setIds(ids: any[]) {
    return ids.map(item => item.id);
  }
  transportKindIdsChange() {
    this.form.get('transportKindId').valueChanges.subscribe((values) => {
      if (values) {
        let tranportKind = this.transportKinds.find(x => x.id == values);
        this.isAutotransport = tranportKind?.name?.includes('Автовоз');
        this.isRefrigerator = tranportKind?.name?.includes('Рефрижератор');
        this.isCistern = tranportKind?.name?.includes('Цистерна');
        this.isContainer = tranportKind?.name?.includes('Контейнеровоз');
        this.isLoad = tranportKind?.name?.includes('Грузоподъемность');
      }
      else {
        this.isAutotransport = false;
        this.isRefrigerator = false;
        this.isCistern = false;
        this.isContainer = false;
        this.isLoad = false;
      }
    })
  }
  transportKindIdsChangeEdit() {
    this.form.get('transportKindId').valueChanges.subscribe((values) => {
      if (values) {
        let tranportKind = this.transportKinds.find(x => x.id == values.id);
        this.isAutotransport = tranportKind?.name?.includes('Автовоз');
        this.isRefrigerator = tranportKind?.name?.includes('Рефрижератор');
        this.isCistern = tranportKind?.name?.includes('Цистерна');
        this.isContainer = tranportKind?.name?.includes('Контейнеровоз');
        this.isLoad = tranportKind?.name?.includes('Грузоподъемность');
      }
      else {
        this.isAutotransport = false;
        this.isRefrigerator = false;
        this.isCistern = false;
        this.isContainer = false;
        this.isLoad = false;
      }
    })
  }
  remove(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: this.translate.instant('are_you_sure'),
      nzOkText: this.translate.instant('remove'),
      nzCancelText: this.translate.instant('cancel'),
      nzOkDanger: true,
      nzOnOk: () => {
        this.driversService.deleteTransport(this.driverId,this.data.id).subscribe((res: any) => {
          if (res?.success) {
            this.toastr.success(this.translate.instant('successfullDeleted'), '');
            this.drawerRef.close({ success: true });
          }
        });
      }
    });
  }
}
