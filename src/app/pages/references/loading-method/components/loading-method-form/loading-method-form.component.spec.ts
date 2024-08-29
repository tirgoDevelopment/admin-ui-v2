import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingMethodFormComponent } from './loading-method-form.component';

describe('LoadingMethodFormComponent', () => {
  let component: LoadingMethodFormComponent;
  let fixture: ComponentFixture<LoadingMethodFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingMethodFormComponent]
    });
    fixture = TestBed.createComponent(LoadingMethodFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
