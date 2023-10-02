import {Component, Input} from '@angular/core';
import {ServiceType} from "../../../../types/service.type";
import {OrderCallComponent} from "../order-call/order-call.component";
import {MatDialog} from "@angular/material/dialog";
import {RequestTypeType} from "../../../../types/request-type.type";

@Component({
  selector: 'service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss']
})
export class ServiceCardComponent {
  @Input() service!: ServiceType;

  constructor(private dialog: MatDialog) {
  }

  openPopup() {
    const dialogRef = this.dialog.open(OrderCallComponent, {
      data: {type: RequestTypeType.order, serviceName: this.service.title}
    });
  }
}
