import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {DetailArticleType} from "../../../../types/detail-article.type";
import {ArticleService} from "../../../shared/services/article.service";
import {AuthService} from "../../../core/auth/auth.service";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {CommentsService} from "../../../shared/services/comments.service";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {finalize} from "rxjs";
import {CommentType} from "../../../../types/comment.type";
import {ActionsCommentType} from "../../../../types/actions-comment.type";
import {ActionsUserCommentType} from "../../../../types/actions-user-comment.type";

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
  restComments = 0;
  isShowedLoader = false;
  actionCommentTypes = ActionsCommentType;

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

    this.activatedRoute.params.subscribe(params => {
      //Получение инф-ции о статье
      this.processArticle(params['url']);

      //Получение связанных статей
      this.articleService.getRelatedArticle(params['url'])
        .subscribe((data: ArticleType[]) => {
          this.relatedArticles = data;
          // console.log(this.article)
        });

    })
    // подписываемся на событие добавления комментария
    this.commentsService.isAddComment$.subscribe(isAddComment => {
      this.processArticle(this.article.url, true);
    })
  }

  processArticle(articleUrl: string, isAddComment: boolean = false) {
    this.articleService.getArticle(articleUrl)
      .subscribe((data: DetailArticleType) => {
        this.article = data;
        this.commentForm.patchValue({textComment: ''});
        this.restComments = data.commentsCount - 3;

        isAddComment ? this._snackBar.open('Комментарий добавлен') : this.processActions();

      });
  }

  // Получение инф-ю об активности
  private processActions() {
    this.commentsService.getAllActions(this.article.id).subscribe(
      {
        next: (commentsData: ActionsUserCommentType[]) => {
          commentsData.forEach(item => {
            let commentFounded = this.article.comments.find(articleComment => articleComment.id === item.comment);
            if (commentFounded) commentFounded.action = item.action;
          })
        }
      }
    )
  }

  noWhitespaceValidator(control: FormControl) {
    return (control.value || '').trim().length ? null : {'whitespace': true};
  }

  addComment() {
    const textComment = this.commentForm.get('textComment')?.value as string;
    this.commentsService.addComment(textComment, this.article.id)
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
    this.commentsService.getComments(this.article.comments.length, this.article.id)
      .pipe(
        finalize(() => this.isShowedLoader = false)
      )
      .subscribe({
        next: (data: { allCount: number, comments: CommentType[] }) => {
          this.article.comments = [...this.article.comments, ...data.comments.slice(0, 10)] as CommentType[];
          this.restComments -= 10;

          this.processActions();
        }
      })
  }

  addActionComment(idComment: string, action: ActionsCommentType) {
    this.commentsService.applyAction(idComment, action).subscribe(
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
    );
  }
}
