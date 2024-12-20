import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private currentLang = new BehaviorSubject<string>(localStorage.getItem('lang') || 'us');

  translations = {
    us: {
      today: 'Today',
      yesterday: 'Yesterday',
      edited: 'edited',
      fileSize: 'Size',
      kb: 'KB',
      mb: 'MB',
      gb: 'GB'
    },
    ru: {
      today: 'Сегодня',
      yesterday: 'Вчера',
      edited: 'изменено',
      fileSize: 'Размер',
      kb: 'КБ',
      mb: 'МБ',
      gb: 'ГБ'
    },
    uz: {
      today: 'Bugun',
      yesterday: 'Kecha',
      edited: 'tahrirlangan',
      fileSize: 'Hajmi',
      kb: 'KB',
      mb: 'MB',
      gb: 'GB'
    }
  };

  constructor() {
    this.currentLang.subscribe(lang => {
      localStorage.setItem('lang', lang);
    });
  }

  getCurrentLang() {
    return this.currentLang.value;
  }

  setLanguage(lang: string) {
    this.currentLang.next(lang);
  }

  translate(key: string): string {
    const lang = this.getCurrentLang();
    return this.translations[lang]?.[key] || key;
  }

  formatFileSize(bytes: number): string {
    if (!bytes) return '0 ' + this.translate('kb');
    
    const sizes = ['bytes', 'kb', 'mb', 'gb'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = Math.round(bytes / Math.pow(1024, i));
    
    return `${size} ${this.translate(sizes[i])}`;
  }
}
