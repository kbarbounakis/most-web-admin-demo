import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMonthChartComponent } from './order-month-chart.component';

describe('OrderMonthChartComponent', () => {
  let component: OrderMonthChartComponent;
  let fixture: ComponentFixture<OrderMonthChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMonthChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMonthChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
