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
  SyncOutline,
  FileSearchOutline,
} from '@ant-design/icons-angular/icons';

const icons = [FileSearchOutline,SyncOutline,UndoOutline,FilterFill,EllipsisOutline,MenuFoldOutline, MenuUnfoldOutline, DashboardOutline, FormOutline, LogoutOutline,UserOutline,LockOutline,EyeOutline,EyeInvisibleOutline,MailOutline,PlusOutline];

@NgModule({
  imports: [NzIconModule],
  exports: [NzIconModule],
  providers: [
    { provide: NZ_ICONS, useValue: icons }
  ]
})
export class IconsProviderModule {}


// 97 127 77 74