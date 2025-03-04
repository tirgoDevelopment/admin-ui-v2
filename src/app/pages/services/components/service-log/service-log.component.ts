import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { ServicesService } from '../../services/services.service';
import { ActivatedRoute } from '@angular/router';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { Permission } from 'src/app/shared/enum/per.enum';

@Component({
  selector: 'app-service-log',
  templateUrl: './service-log.component.html',
  styleUrls: ['./service-log.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules, PipeModule],
})
export class ServiceLogComponent implements OnInit{
  Per = Permission;
  @Input() serviceId:number | string;
  data
  loading = false;
  constructor(
    private serviceService: ServicesService,
    private route: ActivatedRoute,
    public perService: PermissionService
  ) {
    this.serviceId = this.route.snapshot.params['id'];
  }
  ngOnInit(): void {
    this.getService();
  }

  getService() {
    this.loading = true;
    this.serviceService.getServiceRequestById(this.serviceId).subscribe((res:any) => {
      if(res && res.success) {
        this.data = res.data.data;
        this.loading = false;
      }
    });
  }
}
