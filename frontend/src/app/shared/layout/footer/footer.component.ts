import {Component, ElementRef, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {OrderCallComponent} from "../../components/order-call/order-call.component";
import {RequestTypeType} from "../../../../types/request-type.type";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  constructor(private dialog: MatDialog,
              private router: Router) {
  }

  openPopup(){
     const dialogRef = this.dialog.open(OrderCallComponent, {
       data: {type: RequestTypeType.consultation}
       // data: {isConsultation: false, name: 'Very '}
     });
  }
}
