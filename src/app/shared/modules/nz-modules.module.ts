import { NgModule } from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@NgModule({
    imports: [
        NzDropDownModule,
        NzAvatarModule,
        NzLayoutModule,
        NzSelectModule,
        NzButtonModule,
        NzIconModule,
        NzMenuModule,
        NzSpinModule,
        NzWaveModule,
        NzInputModule,
        NzAlertModule,
        NzNotificationModule,
        NzFormModule,
        NzToolTipModule
    ],

    exports: [
        NzDropDownModule,
        NzAvatarModule,
        NzLayoutModule,
        NzSelectModule,
        NzButtonModule,
        NzIconModule,
        NzMenuModule,
        NzSpinModule,
        NzWaveModule,
        NzInputModule,
        NzAlertModule,
        NzNotificationModule,
        NzFormModule,
        NzToolTipModule
    ],
})
export class NzModules {
}
