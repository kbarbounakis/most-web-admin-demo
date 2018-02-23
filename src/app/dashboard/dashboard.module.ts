import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { MostModule } from '@themost/angular/module';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CommonModule } from '@angular/common';
import { LatestOrdersModule } from "../latest-orders/latest-orders.module";
import {TopCustomersModule} from "../top-customers/top-customers.module";

@NgModule({
  imports: [
      CommonModule,
    DashboardRoutingModule,
    ChartsModule,
      LatestOrdersModule,
      TopCustomersModule,
      MostModule
  ],
  declarations: [ DashboardComponent ]
})
export class DashboardModule { }
