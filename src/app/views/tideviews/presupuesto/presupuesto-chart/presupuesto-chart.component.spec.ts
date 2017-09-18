import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresupuestoChartComponent } from './presupuesto-chart.component';

describe('PresupuestoChartComponent', () => {
  let component: PresupuestoChartComponent;
  let fixture: ComponentFixture<PresupuestoChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresupuestoChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresupuestoChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
