import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresupuestoComponent } from 'app/views/tideviews/presupuesto/presupuesto.component';
import { BrowserModule } from '@angular/platform-browser';
import { FlotModule } from 'app/components/charts/flotChart';
import { IboxtoolsModule } from 'app/components/common/iboxtools/iboxtools.module';
import { PeityModule } from 'app/components/charts/peity';
import { SparklineModule } from 'app/components/charts/sparkline';
import { JVectorMapModule } from 'app/components/map/jvectorMap';
import {ChartsModule} from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ChartsModule,
    FlotModule,
    IboxtoolsModule,
    PeityModule,
    SparklineModule,
    JVectorMapModule
  ],
  declarations: [
    PresupuestoComponent
  ],
  exports: [
    PresupuestoComponent
  ]
})
export class TideviewsModule { }
