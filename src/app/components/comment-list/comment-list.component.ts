import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnChanges {
  @Input() comments: { id: number, content: string, username: string, createdAt?: string }[] = [];

  editMode: { [id: number]: boolean } = {};
  editedContent: { [id: number]: string } = {};
  currentUser: string = '';
  activeCommentId: number | null = null;

  visibleComments: { id: number, content: string, username: string, createdAt?: string }[] = [];
  showAll: boolean = false;

  constructor(
    private commentService: CommentService,
    private storageService: StorageService
  ) {
    this.currentUser = this.storageService.getUser() || '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['comments']) {
      this.visibleComments = this.comments.slice(0, 2);
      this.showAll = false;
      console.log('📥 COMENTARIOS RECIBIDOS:', this.comments);
    }
  }

  toggleOptions(commentId: number): void {
    this.activeCommentId = this.activeCommentId === commentId ? null : commentId;
  }

  enableEdit(id: number, content: string): void {
    this.editMode[id] = true;
    this.editedContent[id] = content;
    this.activeCommentId = null;
  }

  cancelEdit(id: number): void {
    this.editMode[id] = false;
    this.editedContent[id] = '';
  }

  saveEdit(id: number): void {
    const newContent = this.editedContent[id];
    if (!id || !newContent) {
      console.error('❌ ID O CONTENIDO NO VALIDO AL GUARDAR');
      return;
    }

    this.commentService.updateComment(id, newContent).subscribe({
      next: () => {
        const comment = this.comments.find(c => c.id === id);
        if (comment) comment.content = newContent;
        this.editMode[id] = false;
        this.activeCommentId = null;
      },
      error: err => console.error('❌ ERROR AL ACTUALIZAR COMENTARIO:', err)
    });
  }

  deleteComment(id: number): void {
    if (!confirm('¿ELIMINAR ESTE COMENTARIO?')) return;

    this.commentService.deleteComment(id).subscribe({
      next: () => {
        this.comments = this.comments.filter(c => c.id !== id);
        this.visibleComments = this.showAll ? this.comments : this.comments.slice(0, 2);
        this.activeCommentId = null;
      },
      error: err => console.error('❌ ERROR AL ELIMINAR ESTE COMENTARIO:', err)
    });
  }

  toggleComments(): void {
    this.showAll = !this.showAll;
    this.visibleComments = this.showAll ? this.comments : [];
  }
}