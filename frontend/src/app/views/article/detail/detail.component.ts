import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {DetailArticleType} from "../../../../types/detail-article.type";
import {ArticleService} from "../../../shared/services/article.service";
import {AuthService} from "../../../core/auth/auth.service";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetailComponent implements OnInit {
  article!: DetailArticleType;
  relatedArticles: ArticleType[] = [];
  isLogged = false;
  serverStaticPath = environment.serverStaticPath;

  constructor(private articleService: ArticleService,
              private authService: AuthService,
              private activatedRoute: ActivatedRoute) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit() {

    this.activatedRoute.params.subscribe(params => {
      //Получение инф-ции о статье
      this.articleService.getArticle(params['url'])
        .subscribe((data: DetailArticleType) => {
          this.article = data;
           console.log(this.article.commentsCount)
        });

      //Получение связанных статей
      this.articleService.getRelatedArticle(params['url'])
        .subscribe((data: ArticleType[]) => {
          this.relatedArticles = data;
          // console.log(this.article)
        });
    })


  }
}
