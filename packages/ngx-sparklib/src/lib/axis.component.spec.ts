import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AxisComponent } from './axis.component';

describe('StripeChartComponent', () => {
  let component: AxisComponent;
  let fixture: ComponentFixture<AxisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AxisComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AxisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
