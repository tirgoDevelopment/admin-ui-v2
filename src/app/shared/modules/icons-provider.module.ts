import { NgModule } from '@angular/core';
import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';

import {
  MenuFoldOutline,
  MenuUnfoldOutline,
  FormOutline,
  DashboardOutline,
  LogoutOutline,
  UserOutline,
  LockOutline,
  EyeOutline,
  EyeInvisibleOutline,
  MailOutline,
  PlusOutline,
  EllipsisOutline,
  FilterFill,
  UndoOutline,
  SyncOutline
} from '@ant-design/icons-angular/icons';

const icons = [SyncOutline,UndoOutline,FilterFill,EllipsisOutline,MenuFoldOutline, MenuUnfoldOutline, DashboardOutline, FormOutline, LogoutOutline,UserOutline,LockOutline,EyeOutline,EyeInvisibleOutline,MailOutline,PlusOutline];

@NgModule({
  imports: [NzIconModule],
  exports: [NzIconModule],
  providers: [
    { provide: NZ_ICONS, useValue: icons }
  ]
})
export class IconsProviderModule {}


// 97 127 77 74