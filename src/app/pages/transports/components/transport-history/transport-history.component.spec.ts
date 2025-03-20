import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportHistoryComponent } from './transport-history.component';

describe('TransportHistoryComponent', () => {
  let component: TransportHistoryComponent;
  let fixture: ComponentFixture<TransportHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransportHistoryComponent]
    });
    fixture = TestBed.createComponent(TransportHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
