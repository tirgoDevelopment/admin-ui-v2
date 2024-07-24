import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private notification: NzNotificationService) { }

  success(title: string, content: string): void {
    this.notification.success(title, content, { nzDuration: 3000, nzAnimate: true, nzPauseOnHover: true, nzStyle: { background: '#F6FFED' } });
  }

  error(title: string, content: string): void {
    this.notification.error(title, content,{ nzDuration: 3000, nzAnimate: true, nzPauseOnHover: true, nzStyle: { background: '#FFF2F0' } });
  }

  warning(title: string, content: string): void {
    this.notification.warning(title, content,{ nzDuration: 3000, nzAnimate: true, nzPauseOnHover: true, nzStyle: { background: '#FFFBE6' } });
  }
}
