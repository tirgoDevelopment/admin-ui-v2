import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { Response } from 'src/app/shared/models/reponse';
import { ClientsService } from '../../services/clients.service';
import { ClientModel } from '../../models/client.model';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { env } from 'src/environmens/environment';
@Component({
  selector: 'app-clients-form',
  templateUrl: './clients-form.component.html',
  styleUrls: ['./clients-form.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules, NzModalModule, PipeModule],
})
export class ClientsFormComponent implements OnInit {
  siteUrl: string = env.apiUrl;
  @Input() data?: any;
  @Output() close = new EventEmitter<void>();
  showForm: boolean = false;
  loading: boolean = false;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    phoneNumbers: new FormControl(['+998977243312'], Validators.required),
    email: new FormControl('', [Validators.email, Validators.required]),
    pasportFilePath: new FormControl('')
  });

  constructor(
    private cdr: ChangeDetectorRef,
    private toastr: NotificationService,
    private drawerRef: NzDrawerRef,
    private clientsService: ClientsService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.patchForm();
  }
  patchForm() {
    if (this.data) {
      this.form.patchValue({
        id: this.data.id,
        name: this.data.name,
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
    formData.append('phoneNumbers', this.form.get('phoneNumbers')?.value);
    formData.append('password', this.form.get('password')?.value);
    if (this.selectedFile) {
      formData.append('pasportFilePath', this.selectedFile, this.selectedFile.name);
    }

    this.loading = true;
    const submitObservable = this.data
      ? this.clientsService.update(formData)
      : this.clientsService.create(formData);

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
    this.previewUrl = null;
    this.selectedFile = null;
  }
}