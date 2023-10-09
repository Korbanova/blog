import {Component, ElementRef, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {IsActiveMatchOptions, Router} from "@angular/router";
import {OrderCallComponent} from "../../components/order-call/order-call.component";
import {RequestTypeType} from "../../../../types/request-type.type";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  public linkActiveOptions: IsActiveMatchOptions = {
    matrixParams: 'exact',
    queryParams: 'exact',
    paths: 'exact',
    fragment: 'exact',
  };
  isOpenBurger = false;

  constructor(private dialog: MatDialog) {
  }

  openPopup() {
    this.dialog.open(OrderCallComponent, {
      data: {type: RequestTypeType.consultation}
    });
  }

  activeBurger() {
    this.isOpenBurger = !this.isOpenBurger;
  }
}
