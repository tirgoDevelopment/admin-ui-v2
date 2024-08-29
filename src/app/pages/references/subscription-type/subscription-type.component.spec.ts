import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionTypeComponent } from './subscription-type.component';

describe('SubscriptionTypeComponent', () => {
  let component: SubscriptionTypeComponent;
  let fixture: ComponentFixture<SubscriptionTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubscriptionTypeComponent]
    });
    fixture = TestBed.createComponent(SubscriptionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
