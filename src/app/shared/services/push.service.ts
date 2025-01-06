
import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class PushService { 

showPushNotification(title, message: string) {
    if ('Notification' in window) {
      const audio = new Audio('assets/sound/notify.mp3');
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: "assets/images/logo/auth-logo.svg",
          tag: 'update-notification',
          renotify: true,
        });
        audio.play();
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification(title, {
              body: message,
              icon: "assets/images/logo/auth-logo.svg",
              tag: 'update-notification',
              renotify: true,
            });
          }
        });
        audio.play();
      }
    } else {
      console.error('Brauzer Notification API ni qo‘llab-quvvatlamaydi.');
    }
  }
}
