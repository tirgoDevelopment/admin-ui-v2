import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportTypesFormComponent } from './transport-types-form.component';

describe('TransportTypesFormComponent', () => {
  let component: TransportTypesFormComponent;
  let fixture: ComponentFixture<TransportTypesFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransportTypesFormComponent]
    });
    fixture = TestBed.createComponent(TransportTypesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
