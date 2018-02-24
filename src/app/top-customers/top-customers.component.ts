import { Component, OnInit } from '@angular/core';
import {AngularDataContext} from "@themost/angular/client";

@Component({
  selector: 'top-customers',
  templateUrl: './top-customers.component.html',
  styleUrls: ['./top-customers.component.scss']
})
export class TopCustomersComponent implements OnInit {

  constructor(public context: AngularDataContext) { }

  public topCustomers:Array<any>;

  ngOnInit() {
    this.context.model('orders')
        .select('customer','count(id) as total')
        .expand('customer($expand=address)')
        .groupBy('customer')
        .orderByDescending('count(id)').take(5).getItems().then(res=> {
            this.topCustomers = res.value;
    });
  }

}
