import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTypesComponent } from './company-types.component';

describe('CompanyTypesComponent', () => {
  let component: CompanyTypesComponent;
  let fixture: ComponentFixture<CompanyTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyTypesComponent]
    });
    fixture = TestBed.createComponent(CompanyTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
