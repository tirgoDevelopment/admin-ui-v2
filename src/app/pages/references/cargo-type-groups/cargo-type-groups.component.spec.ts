import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoTypeGroupsComponent } from './cargo-type-groups.component';

describe('CargoTypeGroupsComponent', () => {
  let component: CargoTypeGroupsComponent;
  let fixture: ComponentFixture<CargoTypeGroupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CargoTypeGroupsComponent]
    });
    fixture = TestBed.createComponent(CargoTypeGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
