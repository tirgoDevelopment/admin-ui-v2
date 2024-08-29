import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportKindsComponent } from './transport-kinds.component';

describe('TransportKindsComponent', () => {
  let component: TransportKindsComponent;
  let fixture: ComponentFixture<TransportKindsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransportKindsComponent]
    });
    fixture = TestBed.createComponent(TransportKindsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
