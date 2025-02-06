import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportBrandFormGroupComponent } from './transport-brand-form.component';

describe('TransportBrandFormGroupComponent', () => {
  let component: TransportBrandFormGroupComponent;
  let fixture: ComponentFixture<TransportBrandFormGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransportBrandFormGroupComponent]
    });
    fixture = TestBed.createComponent(TransportBrandFormGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
