import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { Response } from 'src/app/shared/models/reponse';
import { ClientsService } from '../../services/clients.service';
import { ClientModel } from '../../models/client.model';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { env } from 'src/environmens/environment';
import { NgxMaskDirective } from 'ngx-mask';
import { removeDuplicateKeys } from 'src/app/shared/pipes/remove-dublicates-formData';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clients-form',
  templateUrl: './clients-form.component.html',
  styleUrls: ['./clients-form.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules, NzModalModule, PipeModule, NgxMaskDirective],
})
export class ClientsFormComponent implements OnInit {
  confirmModal?: NzModalRef;
  siteUrl: string = env.references + '/references/files/clients/';
  @Input() clientId?: number | string;
  @Input() mode?: 'add' | 'edit' | 'view'; 
  @Output() close = new EventEmitter<void>();
  showForm: boolean = false;
  loading: boolean = false;
  edit: boolean = false;
  fileRemoved: boolean = false;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  form: FormGroup;
  data: ClientModel;
  loadingPage:boolean =false;
  countries = [
    { code: 'UZ', name: 'Uzbekistan', flag: 'assets/images/flags/UZ.svg' },
    { code: 'KZ', name: 'Kazakhstan', flag: 'assets/images/flags/KZ.svg' },
    { code: 'RU', name: 'Russia', flag: 'assets/images/flags/RU.svg' },
  ];
  selectedCountry: { code: string; name: string; flag: string } = this.countries[0];
  currentMask: string = '+000 (00) 000-00-00';

  constructor(
    private modal: NzModalService,
    private toastr: NotificationService,
    private drawerRef: NzDrawerRef,
    private clientsService: ClientsService,
    private translate: TranslateService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.edit = this.mode === 'edit';
    this.form = new FormGroup({
      id: new FormControl(''),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      phoneNumbers: new FormControl([], Validators.required),
    });
    this.getById();
  }
  getById() {
    if (this.clientId) {
      this.loadingPage = true;
      this.clientsService.getById(this.clientId).subscribe((res: Response<ClientModel>) => {
        this.data = res.data;
        this.patchForm();
        this.previewUrl = this.data?.passportFilePath;
        this.loadingPage = false;
      });
    }
  }
  patchForm() {
    this.updateMask();
    if (this.data) {
      this.edit = true;
      const mainPhoneNumber = this.data?.phoneNumbers?.find(phone => phone.id);
      const formattedPhoneNumber = mainPhoneNumber ? `+${mainPhoneNumber.code}${mainPhoneNumber.number}` : '';

      this.form.patchValue({
        id: this.data.id,
        firstName: this.data.firstName,
        lastName: this.data.lastName,
        email: this.data.email,
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
    const phoneNumbers = [
      {
        code: this.form.value.phoneNumbers.substring(0, 3),
        number: this.form.value.phoneNumbers.substring(3),
        isMain: true,
      }
    ];
    formData.append('phoneNumbers', JSON.stringify(phoneNumbers));
    
    this.loading = true;
    const uniqueFormData = removeDuplicateKeys(formData);
    
    const submitObservable = this.data
      ? this.clientsService.update(uniqueFormData)
      : this.clientsService.create(uniqueFormData);
    submitObservable.subscribe(
      (res: Response<ClientModel[]>) => {
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
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  removeFile(): void {
    this.fileRemoved = true;
    this.previewUrl = null;
    this.selectedFile = null;
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
    if (this.data.isBlocked) {
      this.clientsService.unblock(this.data.id).subscribe((res: Response<ClientModel>) => {
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
        this.clientsService.block(this.data.id).subscribe((res: any) => {
          if (res?.success) {
            this.toastr.success(this.translate.instant('successfullBlocked'), '');
            this.drawerRef.close({ success: true });
          }
        });
      }
    });
  }
  allOrders() {
    this.router.navigate(['/orders', { clientId: this.data.id  }]);
    this.drawerRef.close({success: true});
    
  }
}
