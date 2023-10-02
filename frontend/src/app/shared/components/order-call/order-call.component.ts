import {Component, ElementRef, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {ModalOrderType} from "../../../../types/modal-order.type";
import {FormBuilder, Validators} from "@angular/forms";
import {ServicesService} from "../../services/services.service";
import {ServiceType} from "../../../../types/service.type";
import {RequestTypeType} from "../../../../types/request-type.type";
import {DefaultResponseType} from "../../../../types/default-response.type";

// export interface DialogData {
//   isConsultation: boolean;
//   name: string;
// }

@Component({
  selector: 'order-call',
  templateUrl: './order-call.component.html',
  styleUrls: ['./order-call.component.scss']
})

export class OrderCallComponent implements OnInit {
  services: ServiceType[] = [];
  requestType: RequestTypeType;
  requestTypes = RequestTypeType;
  isError: boolean | null = null;

  orderForm = this.fb.group({
    service: [this.data.serviceName || ''],
    userName: ['', [Validators.required]],
    phone: ['', [Validators.required]],
  })

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OrderCallComponent>,
    private servicesService: ServicesService,
    @Inject(MAT_DIALOG_DATA) public data: ModalOrderType,
  ) {
    this.requestType = data.type;
  }

  ngOnInit() {
    this.services = this.servicesService.getServices();
    if(this.requestType === this.requestTypes.order){
      this.orderForm.get('service')?.setValidators(Validators.required);

    }
  }

  closePopup() {
    this.dialogRef?.close();
    //this.router.navigate(['/']);
  }

  addRequests() {
    if (this.orderForm.valid && this.orderForm.value.userName && this.orderForm.value.phone) {
      this.servicesService.addRequests(this.orderForm.value.userName, this.orderForm.value.phone, this.requestType, this.orderForm.value.service)
        .subscribe({
          next: (data: DefaultResponseType) => {
            this.isError = data.error;
          },
          error: (error: string) => {
            this.isError = true;
          }
        });
    }

  }

}
