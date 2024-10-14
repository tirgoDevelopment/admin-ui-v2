import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantDriverComponent } from './merchant-driver.component';

describe('MerchantDriverComponent', () => {
  let component: MerchantDriverComponent;
  let fixture: ComponentFixture<MerchantDriverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MerchantDriverComponent]
    });
    fixture = TestBed.createComponent(MerchantDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
