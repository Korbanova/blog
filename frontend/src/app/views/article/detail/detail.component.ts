import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {DetailArticleType} from "../../../../types/detail-article.type";
import {ArticleService} from "../../../shared/services/article.service";
import {AuthService} from "../../../core/auth/auth.service";
import {ActivatedRoute, Params} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {CommentsService} from "../../../shared/services/comments.service";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {finalize, Subscription, switchMap, tap} from "rxjs";
import {CommentType} from "../../../../types/comment.type";
import {ActionsCommentType} from "../../../../types/actions-comment.type";
import {ActionsUserCommentType} from "../../../../types/actions-user-comment.type";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetailComponent implements OnInit, OnDestroy {
  article!: DetailArticleType;
  relatedArticles: ArticleType[] = [];
  isLogged = false;
  serverStaticPath = environment.serverStaticPath;
  restComments = 0;
  isShowedLoader = false;
  actionCommentTypes = ActionsCommentType;
  private subscriptionRoute: Subscription | null = null;
  private subscriptionComment: Subscription | null = null;
  private subscriptionLoadComment: Subscription | null = null;
  private subscriptionAddComment: Subscription | null = null;
  private subscriptionAddActive: Subscription | null = null;

  commentForm = this.fb.group({
    textComment: ['', {validators: [Validators.required, this.noWhitespaceValidator], updateOn: 'change'}],
  });

  constructor(private articleService: ArticleService,
              private authService: AuthService,
              private activatedRoute: ActivatedRoute,
              private commentsService: CommentsService,
              private fb: FormBuilder,
              private _snackBar: MatSnackBar) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit() {
    this.subscriptionRoute = this.activatedRoute.params
      .pipe(
        switchMap((params: Params) => {

          //Получение инф-ции о статье
          return this.articleService.getArticle(params['url']).pipe(
            switchMap((articleData: DetailArticleType) => {
              this.article = articleData;
              this.restComments = articleData.commentsCount - 3;

              //Получение связанных статей
              return this.articleService.getRelatedArticle(this.article.url).pipe(
                switchMap((dataRelated: ArticleType[]) => {
                  this.relatedArticles = dataRelated;

                  // Получение инф-ю об активности
                  return this.commentsService.getAllActions(this.article.id);
                })
              )
            })
          )
        })
      )
      .subscribe(
        this.processActions()
      )

    // подписываемся на событие добавления комментария
    this.subscriptionComment = this.commentsService.isAddComment$.pipe(
      switchMap(() => this.articleService.getArticle(this.article.url))
    )
      .subscribe((data: DetailArticleType) => {
        this.article = data;
        this.commentForm.patchValue({textComment: ''});
        this.restComments = data.commentsCount - 3;

        this._snackBar.open('Комментарий добавлен');
    })
  }

  ngOnDestroy() {
    this.subscriptionRoute?.unsubscribe();
    this.subscriptionComment?.unsubscribe();
    this.subscriptionLoadComment?.unsubscribe();
    this.subscriptionAddComment?.unsubscribe();
    this.subscriptionAddActive?.unsubscribe();
  }

  // Получение инф-ю об активности
  private processActions() {
    return {
      next: (commentsData: ActionsUserCommentType[]) => {
        commentsData.forEach(item => {
          let commentFounded = this.article.comments.find(articleComment => articleComment.id === item.comment);
          if (commentFounded) commentFounded.action = item.action;
        })
      }
    }
  }

  noWhitespaceValidator(control: FormControl) {
    return (control.value || '').trim().length ? null : {'whitespace': true};
  }

  addComment() {
    const textComment = this.commentForm.get('textComment')?.value as string;
    this.subscriptionAddComment = this.commentsService.addComment(textComment, this.article.id)
      .subscribe(
        {
          next: (data: DefaultResponseType) => {
            this.commentsService.setNewComment();
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка добавления');
            }
          }
        });
  }

  loadMoreComments() {
    this.isShowedLoader = true;
    this.subscriptionLoadComment = this.commentsService.getComments(this.article.comments.length, this.article.id)
      .pipe(
        finalize(() => this.isShowedLoader = false),
        switchMap((dataComments: { allCount: number, comments: CommentType[] }) => {
          this.article.comments = [...this.article.comments, ...dataComments.comments.slice(0, 10)] as CommentType[];
          this.restComments -= 10;
          return this.commentsService.getAllActions(this.article.id)
        })
      )
      .subscribe(
        this.processActions()
      )
  }

  addActionComment(idComment: string, action: ActionsCommentType) {
    this.subscriptionAddActive = this.commentsService.applyAction(idComment, action).subscribe(
      {
        next: (data: DefaultResponseType) => {
          if (!data.error) {
            let message = '';
            if (action === ActionsCommentType.violate) {
              message = 'Жалоба отправлена';
            } else {
              message = 'Ваш голос учтен';
              let commentFounded = this.article.comments.find(item => item.id === idComment);

              if (commentFounded) {
                switch (commentFounded.action) {
                  case ActionsCommentType.like:
                    commentFounded.likesCount--;
                    if (action === ActionsCommentType.like) {
                      commentFounded.action = null;
                    } else {
                      commentFounded.dislikesCount++;
                      commentFounded.action = ActionsCommentType.dislike;
                    }
                    break;
                  case ActionsCommentType.dislike:
                    commentFounded.dislikesCount--;
                    if (action === ActionsCommentType.like) {
                      commentFounded.likesCount++;
                      commentFounded.action = ActionsCommentType.like;
                    } else {
                      commentFounded.action = null;
                    }
                    break;
                  default:
                    if (action === ActionsCommentType.like) {
                      commentFounded.likesCount++;
                      commentFounded.action = ActionsCommentType.like;
                    } else {
                      commentFounded.dislikesCount++;
                      commentFounded.action = ActionsCommentType.dislike;
                    }
                    break;
                }
              }
            }
            this._snackBar.open(message);
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            let errorMessage = '';
            if (action === ActionsCommentType.violate) {
              errorMessage = 'Жалоба уже отправлена';
            } else {
              errorMessage = errorResponse.error.message;
            }

            this._snackBar.open(errorMessage);
          } else {
            this._snackBar.open('Ошибка сохранения');
          }
        }
      }
    )
  }
}
