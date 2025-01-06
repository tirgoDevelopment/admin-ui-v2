import { ChangeDetectorRef, Component } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NzModules } from '../../modules/nz-modules.module';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from 'src/app/pages/auth/services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { ChatComponent } from '../chat/chat.component';
import { CommonModules } from '../../modules/common.module';
import { SocketService } from '../../services/socket.service';
import { ServicesService } from 'src/app/pages/services/services/services.service';
import { jwtDecode } from 'jwt-decode';
import { PushService } from '../../services/push.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [FormsModule, TranslateModule, NzModules, NgIf, RouterLink, RouterOutlet, ChatComponent, CommonModules],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {

  chatIconPosition = { x: 0, y: 0 };

  isLoading: boolean = false;
  theme: 'light' | 'dark';
  isCollapsed = true;
  selectedFlag: string = '../assets/images/flags/US.svg';
  selectedLanguage = 'en';
  userName: string = 'Super Admin';
  isDarkMode: boolean = false;
  isChatVisible: boolean = false;
  subscription
  serviceReqCount = 0;
  newMessageCount = 0;
  currentUser: any;
  chat
  constructor(
    private socketService: SocketService,
    private changeDetector: ChangeDetectorRef,
    public themeService: ThemeService,
    private translate: TranslateService,
    public authService: AuthService,
    private serviceApi: ServicesService,
    private pushService: PushService,
    private router: Router) {
  }
  ngOnInit(): void {
   this.currentUser = jwtDecode(localStorage.getItem('accessToken'));
      
    const lang = localStorage.getItem('lang') || 'uz';
    this.changeLanguage(lang.toLocaleLowerCase(), `../assets/images/flags/${lang}.svg`);
    this.themeService.initTheme();
    this.setInitialChatIconPosition();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects.startsWith('/services')) {
          this.serviceReqCount = 0;
          this.changeDetector.detectChanges();
        }
      }
    });
    this.getChats();
    this.subscription = this.socketService.getSSEEvents().subscribe((event) => {
      if (event.event === 'newMessage' && event.data.userType != 'staff' && (this.chat && this.chat.id) !== event.data.requestId) {
        this.newMessageCount = this.newMessageCount + 1;
        this.changeDetector.detectChanges();
        this.pushService.showPushNotification(`Новое сообщение поступило на сервис в id ${event.data.requestId}`, event.data.message.message );
      }
      if (event.event === 'newServiceRequest') {
        this.pushService.showPushNotification(`Новая заявка на сервис `, '' );
      }
    });

  }
 
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  changeLanguage(language: string, flag: string): void {
    this.selectedFlag = flag;
    this.translate.use(language.toLocaleLowerCase());
    localStorage.setItem('lang', language.toLocaleUpperCase());
  }
  toggleTheme() {
    const newTheme = this.themeService.colorTheme === 'light-mode' ? 'dark-mode' : 'light-mode';
    this.themeService.setTheme(newTheme);
  }
  logout() {
    this.authService.signOut();
    this.router.navigate(['/auth/sign-up']);
  } 
  toggleChat() {
    this.isChatVisible = !this.isChatVisible;
  }
  closeChat() {
    this.isChatVisible = false;
  }
  setInitialChatIconPosition() {
    const padding = 16;
    this.chatIconPosition = {
      x: window.innerWidth - 64 - padding,
      y: window.innerHeight - 64 - padding
    };
  }
  onDrag(event: DragEvent) {
    if (event.clientX > 0 && event.clientY > 0) {
      this.chatIconPosition = { x: event.clientX, y: event.clientY };
    }
  }
  onDragEnd(event: DragEvent) {
    if (event.clientX > 0 && event.clientY > 0) {
      this.chatIconPosition = { x: event.clientX, y: event.clientY };
    }
  }
  getChats() {
    this.serviceApi.getDriverServices({}).subscribe({
      next: (res: any) => {
        this.newMessageCount = res.data.content.reduce((total, item) => total + (item.unreadMessagesCount || 0), 0);
      },
      error: (error) => {
      },
      complete: () => {
      },
    });
  }
  updateNewMessageCount(count: number) {
    this.newMessageCount += count;
  }
  
}