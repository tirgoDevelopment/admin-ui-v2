import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportBrandGroupComponent } from './transport-brand-group.component';

describe('TransportBrandGroupComponent', () => {
  let component: TransportBrandGroupComponent;
  let fixture: ComponentFixture<TransportBrandGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransportBrandGroupComponent]
    });
    fixture = TestBed.createComponent(TransportBrandGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
