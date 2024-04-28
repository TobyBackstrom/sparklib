import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LineChartComponent } from '../lib/line-chart.component';

interface TestObject {
  x: number;
  y: number;
}

describe('NgxSparklibComponent', () => {
  let component: LineChartComponent;
  let fixture: ComponentFixture<LineChartComponent>;

  let typedComponent: LineChartComponent<TestObject>;
  let typedFixture: ComponentFixture<LineChartComponent<TestObject>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    typedFixture = TestBed.createComponent(LineChartComponent<TestObject>);
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
