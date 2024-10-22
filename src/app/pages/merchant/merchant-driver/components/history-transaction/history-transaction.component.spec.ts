import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryTransactionComponent } from './history-transaction.component';

describe('HistoryTransactionComponent', () => {
  let component: HistoryTransactionComponent;
  let fixture: ComponentFixture<HistoryTransactionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryTransactionComponent]
    });
    fixture = TestBed.createComponent(HistoryTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
