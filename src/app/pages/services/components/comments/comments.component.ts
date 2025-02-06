import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { ServicesService } from '../../services/services.service';
import { ServiceModel } from '../../models/service.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  standalone: true,
  imports: [CommonModules, NzModules, TranslateModule, IconsProviderModule, PipeModule, NzListModule, NzCommentModule],
})
export class ServiceCommentsComponent implements OnInit {
  @Input() service: ServiceModel;
  data = [];
  inputValue = '';
  loading = false;
  loadingPage = false;
  user = {
    name: 'John Doe',
    avatar: 'https://joeschmoe.io/api/v1/random',
  };
  constructor(
    private serviceApi: ServicesService,
    private toastr: NotificationService,
    private translate: TranslateService,
    private drawerRef: NzDrawerRef
  ) { }
  ngOnInit(): void {
    this.getComments();
  }

  getComments() {
    this.loadingPage = true
    this.serviceApi.getServiceComments(this.service.id).subscribe((res: any) => {
        if(res) {
          this.loadingPage = false;
          this.data = res.data;
        }
    },err => {
      this.loadingPage = false;
    })
  }
  onSubmit() {
    this.loading = true;
    this.serviceApi.postServiceComments({ serviceRequestId: this.service.id, message:this.inputValue}).subscribe((res: any) => {
      if(res) {
        this.loading = false;
        this.toastr.success(this.translate.instant('successfullUpdated'));
        this.drawerRef.close();
      } 
    },err => {
      this.loading = false;
    })
  }
}
