import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantClientComponent } from './merchant-client.component';

describe('MerchantClientComponent', () => {
  let component: MerchantClientComponent;
  let fixture: ComponentFixture<MerchantClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MerchantClientComponent]
    });
    fixture = TestBed.createComponent(MerchantClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
