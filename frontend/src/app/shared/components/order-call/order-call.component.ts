import {Component, ElementRef, Inject, TemplateRef, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {ModalOrderType} from "../../../../types/modal-order.type";
import {FormBuilder, Validators} from "@angular/forms";

// export interface DialogData {
//   isConsultation: boolean;
//   name: string;
// }

@Component({
  selector: 'order-call',
  templateUrl: './order-call.component.html',
  styleUrls: ['./order-call.component.scss']
})
export class OrderCallComponent {
  orderForm = this.fb.group({
    userName: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
  })


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OrderCallComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalOrderType,
  ) {}


  closePopup() {
    this.dialogRef?.close();
    //this.router.navigate(['/']);
  }
}
