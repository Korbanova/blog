import {ActionsCommentType} from "./actions-comment.type";

export type CommentType = {
    id: string,
    text: string,
    date: string,
    likesCount: number
    dislikesCount: number,
    user: {
      "id": string,
      "name": string
    }
    action?: ActionsCommentType | null
  }
