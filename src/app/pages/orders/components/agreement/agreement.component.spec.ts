import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementComponent } from './agreement.component';

describe('AgreementComponent', () => {
  let component: AgreementComponent;
  let fixture: ComponentFixture<AgreementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgreementComponent]
    });
    fixture = TestBed.createComponent(AgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
