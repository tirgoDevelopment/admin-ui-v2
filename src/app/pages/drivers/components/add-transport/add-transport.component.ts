import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
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
import { removeDuplicateKeys } from 'src/app/shared/pipes/remove-dublicates-formData';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CargoPackagesService } from 'src/app/shared/services/references/cargo-packages.service';
import { CargoTypesService } from 'src/app/shared/services/references/cargo-type.service';
import { CurrenciesService } from 'src/app/shared/services/references/currencies.service';
import { LoadingMethodService } from 'src/app/shared/services/references/loading-method.service';
import { TransportKindsService } from 'src/app/shared/services/references/transport-kinds.service';
import { TransportTypesService } from 'src/app/shared/services/references/transport-type.service';
import { DriversService } from '../../services/drivers.service';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { TransportModel } from 'src/app/pages/references/transport-types/models/transport.model';

@Component({
  selector: 'app-add-transport',
  templateUrl: './add-transport.component.html',
  styleUrls: ['./add-transport.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules, NzModalModule, PipeModule, NgxMaskDirective]

})
export class AddTransportComponent implements OnInit {
  @Input() data?: TransportModel;
  @Input() driverId?: number | string;
  @Input() mode: "add" | "edit";

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

  formData = new FormData();

  constructor(
    private driversService: DriversService,
    private currencyService: CurrenciesService,
    private cargoTypesService: CargoTypesService,
    private transportTypesService: TransportTypesService,
    private packageService: CargoPackagesService,
    private loadingMethodService: LoadingMethodService,
    private transportKindsService: TransportKindsService,
    private toastr: NotificationService,
    private drawerRef: NzDrawerRef,
    private translate: TranslateService
  ) {

    this.form = new FormGroup({
      id: new FormControl(''),
      driverId: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      cubicCapacity: new FormControl('', [Validators.required]),
      stateNumber: new FormControl('', [Validators.required]),
      transportKindIds: new FormControl([]),
      transportTypeIds: new FormControl([]),
      loadingMethodIds: new FormControl([]),
      cargoTypeIds: new FormControl([]),
      refrigeratorFrom: new FormControl('', [Validators.min(-10), Validators.max(24)]),
      refrigeratorTo: new FormControl('', [Validators.min(0), Validators.max(25)]),
      refrigeratorCount: new FormControl(''),
      loadFrom: new FormControl('', [Validators.min(17), Validators.max(24)]),
      loadTo: new FormControl('', [Validators.min(0), Validators.max(25)]),
      isHook: new FormControl(false),
      isAdr: new FormControl(false),
      isHighCube: new FormControl(false),
      cisternVolume: new FormControl(''),
      containerVolume: new FormControl(''),
      high: new FormControl(''),
      techPassportFrontFilePath: new FormControl(undefined, [Validators.required]),
      techPassportBackFilePath: new FormControl(undefined, [Validators.required]),
      goodsTransportationLicenseCardFilePath: new FormControl(undefined, [Validators.required]),
    })
  }

  ngOnInit(): void {
    this.getTypes();
    this.transportKindIdsChange();
    
    if (this.mode == 'edit') {
      this.previewUrltechPassportFront = this.data?.techPassportFrontFilePath;
      this.previewUrltechPassportBack = this.data?.techPassportBackFilePath;
      this.previewUrlTransportationLicense = this.data?.goodsTransportationLicenseCardFilePath;
      this.edit = true;
      this.patchForm();
    }
  }
  getTypes() {
    forkJoin({
      currencies: this.currencyService.getAll(),
      cargoTypes: this.cargoTypesService.getAll(),
      transportTypes: this.transportTypesService.getAll(),
      packagesTypes: this.packageService.getAll(),
      cargoLoadingMethods: this.loadingMethodService.getAll(),
      transportKinds: this.transportKindsService.getAll()
    }).subscribe({
      next: (results: any) => {
        this.currencies = results.currencies.data;
        this.cargoTypes = results.cargoTypes.data;
        this.transportTypes = results.transportTypes.data;
        this.packagesTypes = results.packagesTypes.data;
        this.cargoLoadingMethods = results.cargoLoadingMethods.data;
        this.transportKinds = results.transportKinds.data;
      },

      error: (error: any) => {
        console.error('Error fetching currencies and cargo types:', error);
      }
    });
  }
  patchForm() {
    this.form.patchValue({
      id: this.data.id,
      driverId: this.driverId,
      name: this.data.name,
      cubicCapacity: this.data.cubicCapacity,
      transportKindIds: this.data?.transportKinds.map(kind => kind.id),
      transportTypeIds: this.data?.transportTypes.map(type => type.id),
      stateNumber: this.data.stateNumber,
      refrigeratorFrom: this.data.refrigeratorFrom,
      refrigeratorTo: this.data.refrigeratorTo,
      refrigeratorCount: this.data.refrigeratorCount,
      cisternVolume: this.data.cisternVolume,
      containerVolume: this.data.containerVolume,
      loadFrom: this.data.loadFrom,
      loadTo: this.data.loadTo,
      isHook: this.data.isHook,
      isAdr: this.data.isAdr,
      isHighCube: this.data.isHighCube,
      techPassportFrontFilePath: new FormControl(this.data.techPassportFrontFilePath, [Validators.required]),
      techPassportBackFilePath: new FormControl(this.data.techPassportBackFilePath, [Validators.required]),
      goodsTransportationLicenseCardFilePath: new FormControl(this.data.goodsTransportationLicenseCardFilePath, [Validators.required]),
    });
  }
  onCancel() {
    this.drawerRef.close({ success: false });
  }
  onSubmit() {
    const formData = new FormData();
    formData.append('id', this.form.get('id')?.value);
    formData.append('driverId', this.driverId.toString());
    formData.append('name', this.form.get('name')?.value);
    formData.append('cubicCapacity', this.form.get('cubicCapacity')?.value);
    formData.append('transportKindIds',  JSON.stringify(this.form.get('transportKindIds').value));
    formData.append('transportTypeIds', JSON.stringify(this.form.get('transportTypeIds').value));
    formData.append('loadingMethodIds', JSON.stringify(this.form.get('loadingMethodIds').value));
    formData.append('cargoTypeIds', JSON.stringify(this.form.get('cargoTypeIds').value));
    formData.append('stateNumber', this.form.get('stateNumber')?.value);
    formData.append('refrigeratorFrom', this.form.get('refrigeratorFrom')?.value);
    formData.append('refrigeratorTo', this.form.get('refrigeratorTo')?.value);
    formData.append('refrigeratorCount', this.form.get('refrigeratorCount')?.value);
    formData.append('cisternVolume', this.form.get('cisternVolume')?.value);
    formData.append('containerVolume', this.form.get('containerVolume')?.value);
    formData.append('loadFrom', this.form.get('loadFrom')?.value);
    formData.append('loadTo', this.form.get('loadTo')?.value);
    formData.append('isHook', this.form.get('isHook')?.value);
    formData.append('isAdr', this.form.get('isAdr')?.value);
    formData.append('isHighCube', this.form.get('isHighCube')?.value);
    if (this.selectedFiletechPassportFront) {
      const file = new File([this.selectedFiletechPassportFront], Date.now() + this.selectedFiletechPassportFront.name, { type: this.selectedFiletechPassportFront.type });
      formData.append('techPassportFrontFilePath', file);
    }
    if (this.selectedFiletechPassportBack) {
      const file = new File([this.selectedFiletechPassportBack],  Date.now() +this.selectedFiletechPassportBack.name, { type: this.selectedFiletechPassportBack.type });
      formData.append('techPassportBackFilePath', file);
    }
    if (this.selectedFileTransportationLicense) {
      const file = new File([this.selectedFileTransportationLicense],  Date.now() +this.selectedFileTransportationLicense.name, { type: this.selectedFileTransportationLicense.type });
      formData.append('goodsTransportationLicenseCardFilePath', file);
    }
    
    this.loading = true;
    const uniqueFormData = removeDuplicateKeys(formData);
    const submitObservable = this.data
      ? this.driversService.updateTransport(uniqueFormData)
      : this.driversService.createTransport(uniqueFormData);

    submitObservable.subscribe(
      (res: any) => {
        if (res && res.success) {
          this.loading = false;
          const messageKey = this.data ? 'successfullUpdated' : 'successfullCreated';
          this.toastr.success(this.translate.instant(messageKey), '');
          this.drawerRef.close({ success: true });
          this.form.reset();
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
    this.form.get('transportKindIds').valueChanges.subscribe((values) => {
      if (values.length == 1) {
        let tranportKind = this.transportKinds.find(x => x.id == values);
        this.isAutotransport = tranportKind?.name?.includes('Автовоз');
        this.isRefrigerator = tranportKind?.name?.includes('Рефрижератор');
        this.isCistern = tranportKind?.name?.includes('Цистерна');
        this.isContainer = tranportKind?.name?.includes('Контейнеровоз');
        this.isLoad = tranportKind?.name?.includes('Грузоподъемность');
        // this._cdr.detectChanges()
      }
      else if (values.length > 1) {
        values.forEach((x: any) => {
          let tranportKind = this.transportKinds.find(y => y.id == x);
          this.isAutotransport = this.isAutotransport || tranportKind?.name?.includes('Автовоз');
          this.isRefrigerator = this.isRefrigerator || tranportKind?.name?.includes('Рефрижератор');
          this.isCistern = this.isCistern || tranportKind?.name?.includes('Цистерна');
          this.isContainer = this.isContainer || tranportKind?.name?.includes('Контейнеровоз');
          this.isLoad = this.isLoad || tranportKind?.name?.includes('Грузоподъемность');
          // this._cdr.detectChanges()
        });
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
    this.form.get('transportKindIds').valueChanges.subscribe((values) => {

      if (values.length == 1) {
        let tranportKind = this.transportKinds.find(x => x.id == values[0].id);
        this.isAutotransport = tranportKind?.name?.includes('Автовоз');
        this.isRefrigerator = tranportKind?.name?.includes('Рефрижератор');
        this.isCistern = tranportKind?.name?.includes('Цистерна');
        this.isContainer = tranportKind?.name?.includes('Контейнеровоз');
        this.isLoad = tranportKind?.name?.includes('Грузоподъемность');
        // this._cdr.detectChanges()
      } else if (values.length > 1) {
        console.log(values)
        console.log(values.length)
        values.forEach((x: any) => {
          let tranportKind = this.transportKinds.find(y => y.id == x.id);
          this.isAutotransport = this.isAutotransport || tranportKind?.name?.includes('Автовоз');
          this.isRefrigerator = this.isRefrigerator || tranportKind?.name?.includes('Рефрижератор');
          this.isCistern = this.isCistern || tranportKind?.name?.includes('Цистерна');
          this.isContainer = this.isContainer || tranportKind?.name?.includes('Контейнеровоз');
          this.isLoad = this.isLoad || tranportKind?.name?.includes('Грузоподъемность');
        });
        // this._cdr.detectChanges()
      } else {
        this.isAutotransport = false;
        this.isRefrigerator = false;
        this.isCistern = false;
        this.isContainer = false;
        this.isLoad = false;
      }
    })
  }

}
