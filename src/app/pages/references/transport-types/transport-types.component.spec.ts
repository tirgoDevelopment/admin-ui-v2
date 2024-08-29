import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportTypesComponent } from './transport-types.component';

describe('TransportTypesComponent', () => {
  let component: TransportTypesComponent;
  let fixture: ComponentFixture<TransportTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransportTypesComponent]
    });
    fixture = TestBed.createComponent(TransportTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
