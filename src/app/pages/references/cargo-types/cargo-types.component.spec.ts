import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoTypesComponent } from './cargo-types.component';

describe('CargoTypesComponent', () => {
  let component: CargoTypesComponent;
  let fixture: ComponentFixture<CargoTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CargoTypesComponent]
    });
    fixture = TestBed.createComponent(CargoTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
