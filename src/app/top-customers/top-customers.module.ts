import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopCustomersComponent } from './top-customers.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TopCustomersComponent],
    exports: [TopCustomersComponent]
})
export class TopCustomersModule { }
