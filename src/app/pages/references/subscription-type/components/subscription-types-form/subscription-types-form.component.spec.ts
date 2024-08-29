import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionTypesFormComponent } from './subscription-types-form.component';

describe('SubscriptionTypesFormComponent', () => {
  let component: SubscriptionTypesFormComponent;
  let fixture: ComponentFixture<SubscriptionTypesFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubscriptionTypesFormComponent]
    });
    fixture = TestBed.createComponent(SubscriptionTypesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
