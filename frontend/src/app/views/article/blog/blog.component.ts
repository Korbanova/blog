import {Component, OnInit} from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleType} from "../../../../types/article.type";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActivatedRoute, Router} from "@angular/router";
import {CategoryType} from "../../../../types/category.type";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.util";
import {AppliedFilterType} from "../../../../types/applied-filter.type";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  articles: ArticleType[] = [];
  categories: CategoryType[] = [];
  pages: number[] = [];
  activeParams: ActiveParamsType = {categories: []};
  appliedFilters: AppliedFilterType[] = [];

  filterOpen = false;

  constructor(private articleService: ArticleService,
              private router: Router,
              private http: HttpClient,
              private activatedRoute: ActivatedRoute,) {
  }

  ngOnInit() {
    // Получение категорий
    this.getCategories()
      .subscribe((result: CategoryType[]) => {
        this.categories = result;
        console.log(this.categories)

        // Подписка на квери-параметры

        this.activatedRoute.queryParams
          // .pipe(
          //   debounceTime(500)
          // )
          .subscribe(params => {
            this.activeParams = ActiveParamsUtil.processParams(params);

            this.appliedFilters = [];

            this.activeParams.categories.forEach(url => {
              const foundCategory = this.categories.find(item => item.url === url);
              if(foundCategory){
                this.appliedFilters.push({
                  name: foundCategory.name,
                  urlParam: url
                })
              }
            })
            //

            // Запрос на получение статей
            this.articleService.getArticles(this.activeParams)
              .subscribe(data => {
                this.pages = [];
                for (let i = 1; i <= data.pages; i++) {
                  this.pages.push(i);
                }

                this.articles = data.items;
              })
          })
      })


  }

  getCategories(): Observable<CategoryType[]> {
    return this.http.get<CategoryType[]>(environment.api + 'categories');
  }

  toggleFilter() {
    this.filterOpen = !this.filterOpen;
  }

  updateFilterParam(url: string) {
    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingCategoryInParams = this.activeParams.categories.find(item => item === url);
      if (existingCategoryInParams) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== url);
      } else {
        // this.activeParams.types.push(url);
        this.activeParams.categories = [...this.activeParams.categories, url]
      }
    } else {
      this.activeParams.categories = [url];
    }

    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    })
  }

  removeAppliedFilter(appliedFilter: AppliedFilterType) {

    this.activeParams.categories = this.activeParams.categories.filter(item => item !== appliedFilter.urlParam);


    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    })
  }

  openPage(page: number): void {
    this.activeParams.page = page;

    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    })
  }

  openNextPage(): void {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;

      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      })
    }
  }

  openPrevPage(): void {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;

      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      })
    }
  }
}

