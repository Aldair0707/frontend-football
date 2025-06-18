import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent {
  @Input() tweetId!: number;
  @Output() commentSubmitted = new EventEmitter<{ tweetId: number, content: string }>();

  content: string = '';

  submitComment() {
    if (this.content.trim() === '') return;
    this.commentSubmitted.emit({ tweetId: this.tweetId, content: this.content });
    this.content = '';
  }
}