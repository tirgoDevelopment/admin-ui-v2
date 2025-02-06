import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { TransportBrandService } from '../../services/transport-brand.service';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-transport-brand-form',
  templateUrl: './transport-brand-form.component.html',
  styleUrls: ['./transport-brand-form.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules],

})
export class TransportBrandFormComponent {
  @Input() data: any;
  loading = false;
  brandGroups: any[] = [];
  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    groupId: new FormControl('', Validators.required),
  })
  formGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
  });

  constructor(
    private translate: TranslateService,
    private transportBrandService: TransportBrandService,
    private drawerRef: NzDrawerRef,
    private toastr: NotificationService
  ) { }

  ngOnInit(): void {
    this.getGroups();

    if (this.data) {
      if (this.data.brands) {
        this.formGroup.patchValue(this.data);
      } else {
        this.form.patchValue({
          id: this.data.id,
          name: this.data.name,
          groupId: this.data.group.id
        });
      }
    } else {
      this.formGroup.reset();
      this.form.reset();
    }
  }

  getGroups() {
    this.transportBrandService.getBrandGroups().subscribe((res: any) => {
      if (res) {
        this.brandGroups = res.data;
      }
    })
  }
  onSubmitBrand() {
    if (this.formGroup.valid) {
      this.loading = true;
      const brandData = this.formGroup.value;
      const request$ = brandData.id
        ? this.transportBrandService.putBrandGroups(brandData)
        : this.transportBrandService.postBrandGroups(brandData);
      request$.subscribe(
        (res: any) => {
          if (res) {
            this.loading = false;
            this.drawerRef.close({ success: true });
            this.toastr.success(this.translate.instant(brandData.id ? 'successfullUpdated' : 'successfullCreated'));
          }
        },
        (err) => {
          this.loading = false;
        }
      );
    }
  }
  onSubmitModel() {
    if (this.form.valid) {
      this.loading = true;
      const modelData = this.form.value;
      const request$ = modelData.id
        ? this.transportBrandService.putModels(modelData)
        : this.transportBrandService.postModels(modelData);
      request$.subscribe(
        (res: any) => {
          if (res) {
            this.loading = false;
            this.drawerRef.close({ success: true });
            this.toastr.success(this.translate.instant(modelData.id ? 'successfullUpdated' : 'successfullCreated'));
          }
        },
        (err) => {
          this.loading = false;
        }
      );
    }
  }
  remove() {
    
  }
}
