import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoTypesFormComponent } from './cargo-types-form.component';

describe('CargoTypesFormComponent', () => {
  let component: CargoTypesFormComponent;
  let fixture: ComponentFixture<CargoTypesFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CargoTypesFormComponent]
    });
    fixture = TestBed.createComponent(CargoTypesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
