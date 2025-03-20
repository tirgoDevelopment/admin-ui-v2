import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MobileDetectionService {
  private mobileSubject = new BehaviorSubject<boolean>(window.innerWidth <= 768);
  isMobile$ = this.mobileSubject.asObservable();

  constructor() {
    window.addEventListener('resize', () => {
      this.mobileSubject.next(window.innerWidth <= 768);
    });
  }

  get isMobile(): boolean {
    return this.mobileSubject.getValue();
  }
}
