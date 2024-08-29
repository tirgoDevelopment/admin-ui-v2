import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoStatusComponent } from './cargo-status.component';

describe('CargoStatusComponent', () => {
  let component: CargoStatusComponent;
  let fixture: ComponentFixture<CargoStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CargoStatusComponent]
    });
    fixture = TestBed.createComponent(CargoStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
