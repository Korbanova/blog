import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CommentType} from "../../../types/comment.type";
import {ActionsCommentType} from "../../../types/actions-comment.type";
import {ActionsUserCommentType} from "../../../types/actions-user-comment.type";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  isAddComment$: Subject<boolean> = new Subject<boolean>();
  isAddComment = false;

  constructor(private http: HttpClient) {
  }

  setNewComment() {
    this.isAddComment$.next(true);
  }

  addComment(text: string, article: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {
      text,
      article
    });
  }

  getComments(offset: number, article: string): Observable<{ allCount: number, comments: CommentType[] }> {
    return this.http.get<{ allCount: number, comments: CommentType[] }>(environment.api + 'comments', {
      params: {offset, article}
    });
  }

  applyAction(idComment: string, action: ActionsCommentType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + idComment + '/apply-action', {
      action
    });
  }

  getAction(idComment: string): Observable<ActionsUserCommentType[]> {
    return this.http.get<ActionsUserCommentType[]>(environment.api + 'comments/' + idComment + '/actions');
  }

  getAllActions(articleId: string): Observable<ActionsUserCommentType[]> {
    return this.http.get<ActionsUserCommentType[]>(environment.api + 'comments/article-comment-actions/', {
      params: {articleId}
    });
  }


}
