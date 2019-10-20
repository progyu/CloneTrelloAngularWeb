import { Component, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CardService } from '../../core/service/card.service';

@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.css']
})
export class DialogContentComponent {
  onAdd = new EventEmitter();
  changeCardContent = new EventEmitter();

  descriptionState = true;
  flag = -1;

  constructor(
    public dialogRef: MatDialogRef<DialogContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { cardId: number },
    public cardService: CardService
  ) {}

  // title 변경 및 저장
  changeTitle(titleInput: HTMLInputElement): void {
    if(!(titleInput.value.trim())) return;
    this.cardService.card.cardTitle = titleInput.value;
  }
  
  // Description input 변경
  changeDescriptionState(description: HTMLTextAreaElement): void {
    this.cardService.card.description = description.value;
    this.descriptionState ? (this.descriptionState = false) : (this.descriptionState = true);
  }

  // Description 변경 및 저장
  clickDescriptionBtn(descriptionInput: HTMLTextAreaElement): void {
    this.cardService.card.description = descriptionInput.value;
  }

  // Description textarea 글 입력시 높이 조절
  textareaResize(textarea: HTMLTextAreaElement): void {
    textarea.style.height = '1px';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  // 코멘트 아이디 생성
  get generateCommentId(): number {
    return this.cardService.card.comments.length ? Math.max(...this.cardService.card.comments.map(({ id }) => id)) + 1 : 0;
  }

  // 코멘트 추가
  addComment(inputComment: HTMLInputElement): void {
    this.cardService.card.comments = [...this.cardService.card.comments, {
      id: this.generateCommentId,
      comment: inputComment.value,
      card: this.cardService.card.id
     }];
    inputComment.value = '';
  }

  // 코멘트 수정
  EditComment(activityEdit: HTMLTextAreaElement, commentID: number) {
    if (!activityEdit.value.trim()) return;
    this.cardService.card.comments = this.cardService.card.comments.map(comment => {
      return comment.id === commentID ? { ...comment, comment: activityEdit.value } : comment;
    });
    this.flag = -1;
  }

  // 코멘트 삭제
  deleteComment(commentID: number) {
    this.cardService.card.comments = this.cardService.card.comments.filter(comment => comment.id !== commentID);
  }
}