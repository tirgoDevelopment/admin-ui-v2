import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { RolesService } from 'src/app/shared/services/references/role.service';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls:['./role-form.component.scss'],
  standalone: true,
  imports: [TranslateModule, CommonModules, NzModules, IconsProviderModule],
})
export class RoleFormComponent implements OnInit {
  @Input() data?: any;
  form: FormGroup;
  loading = false;
  permissionKeys = [
    "sendPush", "chat", "trackingPage",
    "adminsPage", "adminCreate", "adminUpdate", "adminDelete",
    "driversPage", "driverTopUpBalance", "driverCreate", "driverUpdate", "driverDelete", 
    "driverDetail", "driverBlock", "driverAddTransport", "driverPush",
    "clientsPage", "clientCreate", "clientUpdate", "clientDetail", "clientDelete", 
    "clientPush", "servicesPage", "serviceCreate", "serviceDetail", "serviceStatusChange", 
    "serviceLog", "serviceChat", "gsmPage", "gsmTopUpBalance", "gsmCardManagment", 
    "ordersPage", "orderCreate", "orderUpdate", "orderDetail", "orderOffer", 
    "orderCancel", "orderAssignDriver", "orderSendOfferToDriver", "orderChangeStatus", 
    "tmsesPage", "tmsDeatil", "tmsUpdate", "tmsDriversList", "tmsTransactionsHistory", 
    "tmsTopupBalance", "tmsBlock", "tmsRequstsList", "merchantsPage", "dashboardPage", 
    "archivePage", "driverServicesPage", "rolesPage", "loadingMethodsPage", 
    "subscriptionTypesPage", "currenciesPage", "transportTypesPage", "transportKindsPage", 
    "cargoStatusPage", "cargoPackagesPage", "serviceStatusPage", "cargoTypeGroupsPage", 
    "cargoTypesPage"
  ];

  constructor(
    private fb: FormBuilder,
    private roleService: RolesService,
    private toastr: NotificationService,
    private translate: TranslateService,
    private drawerRef: NzDrawerRef
  ) {
    this.form = this.fb.group({
      id: new FormControl(''),
      name: new FormControl('', Validators.required),
      permission: this.fb.group({})
    });
  }
  ngOnInit(): void {
    if (this.data) {
      this.permissionKeys = Object.keys(this.data.permission || {}).filter(
        (key) => !['id', 'createdAt', 'active', 'deleted'].includes(key)
      );
      
      const permissionGroup = this.fb.group({});
      this.permissionKeys.forEach((key) => {
        permissionGroup.addControl(key, new FormControl(this.data.permission[key] || false));
      });
      
      this.form.setControl('permission', permissionGroup);
      this.form.patchValue(this.data);
    } else {
      const permissionGroup = this.fb.group({});
      this.permissionKeys.forEach((key) => {
        permissionGroup.addControl(key, new FormControl(false));
      });

      this.form.setControl('permission', permissionGroup);
    }
  }
  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      if (this.data) {
        this.roleService.update(this.form.value).subscribe((res: any) => {
          if (res && res.success) {
            this.loading = false;
            this.toastr.success(this.translate.instant('successfullUpdated'), '');
            this.drawerRef.close({ success: true });
          }
        }, (err) => {
          this.loading = false;
        });
      } else {
        this.roleService.create(this.form.value).subscribe((res: any) => {
          if (res && res.success) {
            this.loading = false;
            this.toastr.success(this.translate.instant('successfullCreated'), '');
            this.drawerRef.close({ success: true });
          }
        }, (err) => {
          this.loading = false;
        });
      }
    }
  }
  onDelete() {
  }
}
