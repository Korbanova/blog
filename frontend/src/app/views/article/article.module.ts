import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleRoutingModule } from './article-routing.module';
import { BlogComponent } from './blog/blog.component';
import { DatailComponent } from './datail/datail.component';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    BlogComponent,
    DatailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ArticleRoutingModule
  ]
})
export class ArticleModule { }
