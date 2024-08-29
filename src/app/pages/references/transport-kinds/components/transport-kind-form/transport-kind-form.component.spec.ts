import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportKindFormComponent } from './transport-kind-form.component';

describe('TransportKindFormComponent', () => {
  let component: TransportKindFormComponent;
  let fixture: ComponentFixture<TransportKindFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransportKindFormComponent]
    });
    fixture = TestBed.createComponent(TransportKindFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
