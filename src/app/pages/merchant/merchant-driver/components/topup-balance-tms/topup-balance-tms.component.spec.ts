import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopupBalanceTmsComponent } from './topup-balance-tms.component';

describe('TopupBalanceTmsComponent', () => {
  let component: TopupBalanceTmsComponent;
  let fixture: ComponentFixture<TopupBalanceTmsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopupBalanceTmsComponent]
    });
    fixture = TestBed.createComponent(TopupBalanceTmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
