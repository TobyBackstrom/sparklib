import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarChartComponent } from '../lib/bar-chart.component';

interface TestObject {
  x: number;
  y: number;
}

describe('NgxBarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;

  let typedComponent: BarChartComponent<TestObject>;
  let typedFixture: ComponentFixture<BarChartComponent<TestObject>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    typedFixture = TestBed.createComponent(BarChartComponent<TestObject>);
    typedComponent = typedFixture.componentInstance;
    typedFixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    expect(typedComponent).toBeTruthy();
  });
});
