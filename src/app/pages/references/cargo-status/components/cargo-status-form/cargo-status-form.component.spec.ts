import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoStatusFormComponent } from './cargo-status-form.component';

describe('CargoStatusFormComponent', () => {
  let component: CargoStatusFormComponent;
  let fixture: ComponentFixture<CargoStatusFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CargoStatusFormComponent]
    });
    fixture = TestBed.createComponent(CargoStatusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
