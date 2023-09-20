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
import {SharedModule} from "./shared/shared.module";
import {UserAgreementComponent} from "./views/user-agreement/user-agreement.component";
import {HttpClientModule} from "@angular/common/http";
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatMenuModule} from "@angular/material/menu";


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
    HttpClientModule,
    BrowserModule,
    RouterModule,
    MatDialogModule,
    MatSnackBarModule,
    MatMenuModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
