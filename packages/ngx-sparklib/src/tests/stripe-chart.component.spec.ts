import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StripeChartComponent } from '../lib/stripe-chart.component';

describe('StripeChartComponent', () => {
  let component: StripeChartComponent;
  let fixture: ComponentFixture<StripeChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StripeChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StripeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
