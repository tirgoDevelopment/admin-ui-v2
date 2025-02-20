import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSubscriptionComponent } from './assign-subscription.component';

describe('AssignSubscriptionComponent', () => {
  let component: AssignSubscriptionComponent;
  let fixture: ComponentFixture<AssignSubscriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignSubscriptionComponent]
    });
    fixture = TestBed.createComponent(AssignSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
