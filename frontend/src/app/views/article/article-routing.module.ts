import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BlogComponent} from "./blog/blog.component";
import {DatailComponent} from "./datail/datail.component";

const routes: Routes = [
  {path: 'blog', component: BlogComponent},
  {path: 'article/:url', component: DatailComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule {
}
