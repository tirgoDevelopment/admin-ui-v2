import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoPackagesComponent } from './cargo-packages.component';

describe('CargoPackagesComponent', () => {
  let component: CargoPackagesComponent;
  let fixture: ComponentFixture<CargoPackagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CargoPackagesComponent]
    });
    fixture = TestBed.createComponent(CargoPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
