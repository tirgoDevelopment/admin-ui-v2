import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoTypeGroupsFormComponent } from './cargo-type-groups-form.component';

describe('CargoTypeGroupsFormComponent', () => {
  let component: CargoTypeGroupsFormComponent;
  let fixture: ComponentFixture<CargoTypeGroupsFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CargoTypeGroupsFormComponent]
    });
    fixture = TestBed.createComponent(CargoTypeGroupsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
