import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderCallComponent} from "./components/order-call/order-call.component";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [OrderCallComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [OrderCallComponent]
})

export class SharedModule {
}
