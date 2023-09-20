import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { HeaderComponent } from './shared/layout/header/header.component';
import {RouterModule} from "@angular/router";
import { MainComponent } from './views/main/main.component';
import {MatDialogModule} from "@angular/material/dialog";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrderCallComponent } from './shared/components/order-call/order-call.component';
import {SharedModule} from "./shared/shared.module";
import {UserAgreementComponent} from "./views/user-agreement/user-agreement.component";


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    FooterComponent,
    HeaderComponent,
    MainComponent,
    UserAgreementComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    MatDialogModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
