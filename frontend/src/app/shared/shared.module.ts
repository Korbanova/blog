import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderCallComponent} from "./components/order-call/order-call.component";
import {ReactiveFormsModule} from "@angular/forms";
import {ArticleCardComponent} from "./components/article-card/article-card.component";
import { ServiceCardComponent } from './components/service-card/service-card.component';
import {RouterLink} from "@angular/router";


@NgModule({
  declarations: [OrderCallComponent, ArticleCardComponent, ServiceCardComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink
    ],
  exports: [OrderCallComponent, ArticleCardComponent, ServiceCardComponent]
})

export class SharedModule {
}
