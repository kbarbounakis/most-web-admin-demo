import { Component, OnInit } from '@angular/core';
import {AngularDataContext} from "@themost/angular/client";

@Component({
  selector: 'latest-orders',
  templateUrl: './latest-orders.component.html',
  styleUrls: ['./latest-orders.component.scss']
})
export class LatestOrdersComponent implements OnInit {

  public orders:any;
  constructor(public context: AngularDataContext) {

  }

  ngOnInit() {
      this.context.model('orders').asQueryable()
          .expand('customer')
          .orderByDescending('orderDate').take(5).getItems().then(res => {
        this.orders = res.value;
      });
  }

}
