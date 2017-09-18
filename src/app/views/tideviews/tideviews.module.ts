import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresupuestoComponent } from 'app/views/tideviews/presupuesto/presupuesto.component';
import { BrowserModule } from '@angular/platform-browser';
import { FlotModule } from 'app/components/charts/flotChart';
import { IboxtoolsModule } from 'app/components/common/iboxtools/iboxtools.module';
import { PeityModule } from 'app/components/charts/peity';
import { SparklineModule } from 'app/components/charts/sparkline';
import { JVectorMapModule } from 'app/components/map/jvectorMap';
import { ChartsModule } from 'ng2-charts';
import { ChartModule } from 'angular2-highcharts';
import { PresupuestoChartComponent } from 'app/views/tideviews/presupuesto/presupuesto-chart/presupuesto-chart.component';
import { EducacionComponent } from 'app/views/tideviews/educacion/educacion.component';
import { HttpClientModule } from '@angular/common/http';
import { Ng2CompleterModule } from 'ng2-completer';


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ChartsModule,
    FlotModule,
    IboxtoolsModule,
    PeityModule,
    SparklineModule,
    JVectorMapModule,
    ChartModule,
    HttpClientModule,
    FormsModule,
    Ng2CompleterModule
  ],
  declarations: [
    PresupuestoComponent,
    PresupuestoChartComponent,
    EducacionComponent
  ],
  exports: [
    PresupuestoComponent
  ]
})
export class TideviewsModule { }
