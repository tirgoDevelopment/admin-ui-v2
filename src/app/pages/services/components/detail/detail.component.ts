import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslateModule } from '@ngx-translate/core';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { Permission } from 'src/app/shared/enum/per.enum';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  standalone: true,
  imports: [CommonModule, NzIconModule, PipeModule, TranslateModule, NzModules]
})
export class ServiceDetailComponent implements OnInit {
  @Input() item?: any;
  Per = Permission;
  loadingPage = true;
  loading = false;
  constructor(
   public perService: PermissionService
  ) { }

  ngOnInit(): void {
    if(this.item) {
      this.loadingPage = false;
    }
    console.log(this.item);
  }
}
