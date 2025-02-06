import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TmsComponent } from './tms.component';


describe('TmsComponent', () => {
  let component: TmsComponent;
  let fixture: ComponentFixture<TmsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TmsComponent]
    });
    fixture = TestBed.createComponent(TmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
