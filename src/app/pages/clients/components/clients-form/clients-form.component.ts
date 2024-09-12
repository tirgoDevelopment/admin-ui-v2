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

@Component({
  selector: 'app-clients-form',
  templateUrl: './clients-form.component.html',
  styleUrls: ['./clients-form.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules, NzModalModule, PipeModule, NgxMaskDirective],
})
export class ClientsFormComponent implements OnInit {
  confirmModal?: NzModalRef;
  siteUrl: string = env.apiUrl + '/references/files/clients/';
  @Input() data?: ClientModel;
  @Input() mode?: 'add' | 'edit' | 'view'; 
  @Output() close = new EventEmitter<void>();
  showForm: boolean = false;
  loading: boolean = false;
  edit: boolean = false;
  fileRemoved: boolean = false;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  form: FormGroup;

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
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.previewUrl = this.data?.passportFilePath;
    this.edit = this.mode === 'edit';
    this.form = new FormGroup({
      id: new FormControl(''),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      password: new FormControl('', this.edit ? [Validators.nullValidator] : [Validators.required, Validators.maxLength(16), Validators.minLength(8), Validators.pattern('^[a-zA-Z0-9]+$')]),
      phoneNumbers: new FormControl(['+998'], Validators.required),
      email: new FormControl('', [Validators.email, Validators.required]),
      passport: new FormControl('',this.edit ? [Validators.nullValidator] : [Validators.required]),
    });
    if (this.mode == 'edit') {
      this.patchForm();
    }
    if (this.mode == 'view') {
      this.getById();
    }
  }
  getById() {
    if (this.data && this.mode == 'view') {
      this.clientsService.getById(this.data.id).subscribe((res: Response<ClientModel>) => {
        this.data = res.data;
      });
    }
  }
  patchForm() {
    this.updateMask();
    if (this.data) {
      this.previewUrl = this.data?.passportFilePath;
      this.edit = true;
      this.form.patchValue({
        id: this.data.id,
        firstName: this.data.firstName,
        lastName: this.data.lastName,
        email: this.data.email,
        phoneNumbers: String('+' + this.data?.phoneNumbers[0].phoneNumber),
        passport: this.data?.passportFilePath
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
    formData.append('phoneNumbers', JSON.stringify([this.form.get('phoneNumbers').value]));
    if (!this.edit) {
      formData.append('password', this.form.get('password')?.value);
    }
    if (this.selectedFile) {
      const file = new File([this.selectedFile], this.selectedFile.name, { type: this.selectedFile.type });
      formData.append('passport', file);
    }
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
    if (this.data.blocked) {
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

}