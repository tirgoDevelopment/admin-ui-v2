import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportBrandComponent } from './transport-brand.component';

describe('TransportBrandComponent', () => {
  let component: TransportBrandComponent;
  let fixture: ComponentFixture<TransportBrandComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransportBrandComponent]
    });
    fixture = TestBed.createComponent(TransportBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
