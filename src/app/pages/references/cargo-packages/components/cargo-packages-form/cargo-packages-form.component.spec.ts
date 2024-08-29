import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoPackagesFormComponent } from './cargo-packages-form.component';

describe('CargoPackagesFormComponent', () => {
  let component: CargoPackagesFormComponent;
  let fixture: ComponentFixture<CargoPackagesFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CargoPackagesFormComponent]
    });
    fixture = TestBed.createComponent(CargoPackagesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
