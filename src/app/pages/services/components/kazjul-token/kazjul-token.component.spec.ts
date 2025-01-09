import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KazjulTokenComponent } from './kazjul-token.component';

describe('KazjulTokenComponent', () => {
  let component: KazjulTokenComponent;
  let fixture: ComponentFixture<KazjulTokenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KazjulTokenComponent]
    });
    fixture = TestBed.createComponent(KazjulTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
