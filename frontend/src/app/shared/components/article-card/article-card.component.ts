import {Component, Input} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {environment} from "../../../../environments/environment";
import {Router} from "@angular/router";

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent {
  @Input() article!: ArticleType;
  serverStaticPath = environment.serverStaticPath;

  constructor(private router: Router) {
  }

  navigate() {
    this.router.navigate(['/article/' + this.article.url]);

  }
}
