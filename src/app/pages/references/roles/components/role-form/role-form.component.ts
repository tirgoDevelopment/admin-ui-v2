import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules],
})
export class RoleFormComponent implements OnInit {
  permissionsForm: FormGroup;
  @Input() data?: any;
  constructor(private fb: FormBuilder) {
    this.permissionsForm = this.fb.group({});
  }
  ngOnInit(): void {
    this.permissions.forEach(permission => {
      this.permissionsForm.addControl(permission.name, this.fb.control(permission.value));
    });
  }
  permissions = [
    { name: 'activePage', value: true },
    { name: 'addBalanceAgent', value: true },
    { name: 'addClient', value: true },
    { name: 'addDriver', value: true },
    { name: 'addOrder', value: true },
    { name: 'adminAgentPage', value: true },
    { name: 'adminPage', value: true },
    { name: 'agentPage', value: false },
    { name: 'archivedPage', value: true },
    { name: 'attachDriverAgent', value: true },
    { name: 'cancelOrder', value: true },
    { name: 'chat', value: true },
    { name: 'clientMerchantFinance', value: true },
    { name: 'clientMerchantList', value: true },
    { name: 'clientMerchantPage', value: true },
    { name: 'dashboardPage', value: true },
    { name: 'driverFinance', value: true },
    { name: 'driverMerchantFinance', value: true },
    { name: 'driverMerchantList', value: true },
    { name: 'driverMerchantPage', value: true },
    { name: 'driverVerification', value: true },
    { name: 'finRequest', value: true },
    { name: 'orderPage', value: true },
    { name: 'referencesPage', value: true },
    { name: 'registerClientMerchant', value: true },
    { name: 'registerDriverMerchant', value: true },
    { name: 'seeClientsInfo', value: true },
    { name: 'seeDriversInfo', value: true },
    { name: 'seePaymentTransactionAdmin', value: true },
    { name: 'seeServiceTransactionAdmin', value: true },
    { name: 'seeSubscriptionTransactionAgent', value: true },
    { name: 'sendPush', value: true },
    { name: 'tracking', value: true },
    { name: 'verifyDriver', value: true },
  ];
  toKebabCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  }
  toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }
  onSubmit(): void {
    const formattedPermissions = Object.keys(this.permissionsForm.value).reduce((acc:any, key) => {
      const camelCaseKey = this.toCamelCase(key);
      acc[camelCaseKey] = this.permissionsForm.value[key];
      return acc;
    }, {});
  }
}
