import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { Response } from 'src/app/shared/models/reponse';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { NgxMaskDirective } from 'ngx-mask';
import { removeDuplicateKeys } from 'src/app/shared/pipes/remove-dublicates-formData';
import { DriverModel } from '../../models/driver.model';
import { DriversService } from '../../services/drivers.service';
import { jwtDecode } from 'jwt-decode';
import { AddTransportComponent } from '../add-transport/add-transport.component';
import { TransportModel } from 'src/app/pages/references/transport-types/models/transport.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-driver-form',
  templateUrl: './driver-form.component.html',
  styleUrls: ['./driver-form.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules, NzModalModule, PipeModule, NgxMaskDirective]
})
export class DriverFormComponent implements OnInit {
  confirmModal?: NzModalRef;
  @Input() id?: number|string;
  @Input() mode?: 'add' | 'edit' | 'view';
  @Output() close = new EventEmitter<void>();
  showForm: boolean = false;
  loading: boolean = false;
  edit: boolean = false;

  fileRemovedPassport: boolean = false;
  previewUrlPassport: any;

  fileRemovedLicense: boolean = false;
  previewUrlLicense: string | ArrayBuffer | null = null;

  selectedFilePassport: File | null = null;
  selectedFileLicense: File | null = null;

  form: FormGroup;
  data: DriverModel;
  countries = [
    { code: 'UZ', name: 'Uzbekistan', flag: 'assets/images/flags/UZ.svg' },
    { code: 'KZ', name: 'Kazakhstan', flag: 'assets/images/flags/KZ.svg' },
    { code: 'RU', name: 'Russia', flag: 'assets/images/flags/RU.svg' },
  ];
  selectedCountry: { code: string; name: string; flag: string } = this.countries[0];
  currentMask: string = '+000 00 000-00-00';
  currentUser: any;
  loadingPage:boolean = false;

  constructor(
    private modal: NzModalService,
    private toastr: NotificationService,
    private drawerRef: NzDrawerRef,
    private driversService: DriversService,
    private translate: TranslateService,
    private drawer: NzDrawerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // this.previewUrlPassport = this.data?.passportFilePath;
    // this.previewUrlLicense = this.data?.driverLicenseFilePath;
    this.currentUser = jwtDecode(localStorage.getItem('accessToken'));
    this.edit = this.mode === 'edit';
    this.form = new FormGroup({
      id: new FormControl(''),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      phoneNumbers: new FormControl([], Validators.required),
      email: new FormControl('', []),
      passport: new FormControl('', []),
      driverLicense: new FormControl('', []),
      isOwnBalance: new FormControl(false),
      isOwnService: new FormControl(false),
      isOwnOrder: new FormControl(false),
      isKzPaidWay: new FormControl(false),
    });

    
    if (this.mode == 'view' || this.mode == 'edit') {
      this.getById();
    }
  }
  getById() {
    if (this.id && (this.mode == 'view' || this.mode == 'edit')) {
      this.loadingPage = true;
      this.driversService.getById(this.id).subscribe((res: Response<DriverModel>) => {
        this.data = res.data;
        this.patchForm();
        this.loadingPage = false;
      }, err => {
        this.loadingPage = false;
      });
    }
  }
  patchForm() {
    this.updateMask();
    if (this.data) {
      this.previewUrlPassport = this.data?.passportFilePath;
      this.previewUrlLicense = this.data?.driverLicenseFilePath;
      this.edit = true;
      const mainPhoneNumber = this.data?.phoneNumbers?.find(phone => phone.isMain ? phone.isMain : this.data?.phoneNumbers[0]);
      const formattedPhoneNumber = mainPhoneNumber ? `+${mainPhoneNumber.code}${mainPhoneNumber.number}` : '';
      this.form.patchValue(this.data)
      this.form.patchValue({
        phoneNumbers: formattedPhoneNumber,
      });
    }
  }
  onCancel(): void {
    this.drawerRef.close({ success: false });
    this.form.reset();
  }
  onSubmit() {
    const formData = new FormData();
    formData.append('id', this.form.get('id')?.value);
    formData.append('firstName', this.form.get('firstName')?.value);
    formData.append('lastName', this.form.get('lastName')?.value);
    formData.append('email', this.form.get('email')?.value);
    formData.append('isOwnBalance', this.form.get('isOwnBalance')?.value);
    formData.append('isOwnService', this.form.get('isOwnService')?.value);
    formData.append('isOwnOrder', this.form.get('isOwnOrder')?.value);
    formData.append('isKzPaidWay', this.form.get('isKzPaidWay')?.value);

    const phoneNumbers = [
      {
        code: this.form.value.phoneNumbers.substring(0, 3),
        number: this.form.value.phoneNumbers.substring(3),
        isMain: true,
      }
    ];
    formData.append('phoneNumbers', JSON.stringify(phoneNumbers));
    if (this.selectedFilePassport) {
      const file = new File([this.selectedFilePassport], Date.now() + this.selectedFilePassport.name, { type: this.selectedFilePassport.type });
      formData.append('passport', file);
    }
    if (this.selectedFileLicense) {
      const file = new File([this.selectedFileLicense], Date.now() + this.selectedFileLicense.name, { type: this.selectedFileLicense.type });
      formData.append('driverLicense', file);
    }

    this.loading = true;
    const uniqueFormData = removeDuplicateKeys(formData);

    const submitObservable = this.data
      ? this.driversService.update(this.form.get('id')?.value,uniqueFormData)
      : this.driversService.create(uniqueFormData);

    submitObservable.subscribe(
      (res: any) => {
        if (res && res.success) {
          this.loading = false;
          const messageKey = this.data ? 'successfullUpdated' : 'successfullCreated';
          this.toastr.success(this.translate.instant(messageKey), '');
          this.drawerRef.close({ success: true, mode: this.data ? 'edit' : 'add', driverId: res.data?.id });
          this.form.reset();
        }
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  onFileSelected(event: Event, type: 'passport' | 'license'): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'passport') {
          this.selectedFilePassport = file;
          this.previewUrlPassport = reader.result;
          this.form.get('passport')?.setValue(file);
          this.form.get('passport')?.updateValueAndValidity();
        } else if (type === 'license') {
          this.selectedFileLicense = file;
          this.previewUrlLicense = reader.result;
          this.form.get('driverLicense')?.setValue(file);
          this.form.get('driverLicense')?.updateValueAndValidity();
        }
      };
      reader.readAsDataURL(file);
    }
  }
  removeFile(fileType: 'passport' | 'license'): void {
    if (fileType === 'passport') {
      this.fileRemovedPassport = true;
      this.previewUrlPassport = null;
      this.selectedFilePassport = null;
    } else if (fileType === 'license') {
      this.fileRemovedLicense = true;
      this.previewUrlLicense = null;
      this.selectedFileLicense = null;
    }
  }
  updateMask() {
    switch (this.selectedCountry.code) {
      case 'UZ':
        this.currentMask = '+000 00 000-00-00';
        break;
      case 'KZ':
        this.currentMask = '+0 000 000-00-00';
        break;
      case 'RU':
        this.currentMask = '+0 000 000-00-00';
        break;
      default:
        this.currentMask = '';
    }
    this.form.get('phoneNumbers')?.updateValueAndValidity();
  }
  selectCountry(country: { code: string; name: string; flag: string }) {
    this.selectedCountry = country;
    this.updateMask();
  }
  onBlock() {
    if (this.data.blocked) {
      this.driversService.unblock(this.data.id).subscribe((res: Response<DriverModel>) => {
        this.toastr.success(this.translate.instant('successfullyActivated'), '');
        this.drawerRef.close({ success: true });
      });
    }
    else {
      this.blockModal()
    }
  }
  blockModal(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: this.translate.instant('are_you_sure'),
      nzContent: this.translate.instant('block_sure'),
      nzOkText: this.translate.instant('block'),
      nzCancelText: this.translate.instant('cancel'),
      nzOkDanger: true,
      nzOnOk: () => {
        this.driversService.block(this.data.id).subscribe((res: any) => {
          if (res?.success) {
            this.toastr.success(this.translate.instant('successfullBlocked'), '');
            this.drawerRef.close({ success: true });
          }
        });
      }
    });
  }
  addTransport() {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant('add_transport'),
      nzContent: AddTransportComponent,
      nzPlacement: 'right',
      nzContentParams: {
        driverId: this.data.id,
        mode: 'add'
      }
    });
    drawerRef.afterClose.subscribe((res: any) => {
      if (res && res?.success) {
        this.getById()
        this.drawerRef.close({ success: true });
      }
    });
  }
  editTransport(item: TransportModel) {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant('edit_transport'),
      nzContent: AddTransportComponent,
      nzPlacement: 'right',
      nzContentParams: {
        driverId: this.data.id,
        data: item,
        mode: 'edit'
      }
    });
    drawerRef.afterClose.subscribe((res: any) => {
      this.getById()
    });
  }
  allOrders() {
    this.router.navigate(['/orders', { driverId: this.data.id  }]);
    this.drawerRef.close({success: true});
  }
}
