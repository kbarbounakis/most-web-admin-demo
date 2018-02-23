import {NgModule} from '@angular/core';
import {ChartsModule} from 'ng2-charts/ng2-charts';
import {MostModule} from '@themost/angular/module';
import {LatestOrdersComponent} from "./latest-orders.component";
import {CommonModule} from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        ChartsModule,
        MostModule
    ],
   declarations: [ LatestOrdersComponent ],
    exports:[LatestOrdersComponent]
})
export class LatestOrdersModule {
}
