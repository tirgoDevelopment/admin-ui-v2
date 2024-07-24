import { Component } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NzModules } from '../../modules/nz-modules.module';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from 'src/app/pages/auth/services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [FormsModule, TranslateModule, NzModules, NgFor, NgIf, NgClass, RouterLink, RouterOutlet],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  isAuthRoute: boolean = false; 
  isLoading: boolean = false;
  theme: 'light' | 'dark';
  isCollapsed = true;
  selectedFlag: string = '../assets/images/flags/US.svg';
  selectedLanguage = 'en';
  userName: string = 'Super Admin';
  isDarkMode: boolean = false;
  constructor(
    public themeService: ThemeService,
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router) {
  }
  ngOnInit(): void {
    const lang = localStorage.getItem('lang') || 'uz';
    this.changeLanguage(lang.toLocaleLowerCase(), `../assets/images/flags/${lang}.svg`);
    this.themeService.initTheme();
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

}

// ant-menu-submenu ant-menu-submenu-selected ant-menu-submenu-vertical
