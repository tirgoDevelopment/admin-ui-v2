import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingMethodComponent } from './loading-method.component';

describe('LoadingMethodComponent', () => {
  let component: LoadingMethodComponent;
  let fixture: ComponentFixture<LoadingMethodComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingMethodComponent]
    });
    fixture = TestBed.createComponent(LoadingMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
